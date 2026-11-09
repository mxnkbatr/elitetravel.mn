import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Network from "expo-network";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { API_ORIGIN, previewMode } from "../lib/config";
import { loadPublicCatalog, loadPublicTour } from "../lib/catalog";
import type { CatalogPage, NewsItem, SeatMap, Tour } from "../lib/types";
import { previewCatalog } from "../preview/fixture";

const CACHE = "elite.catalog.v1";

type Cache = CatalogPage & { details: Record<string, Tour>; savedAt: string };

type CatalogContext = {
  status: "loading" | "ready" | "error";
  tours: Tour[];
  news: NewsItem[];
  seats: SeatMap;
  offline: boolean;
  stale: boolean;
  preview: boolean;
  error?: string;
  refresh: () => void;
  tourById: (id: string) => Tour | undefined;
  ensureDetail: (id: string) => Promise<Tour | null>;
};

const Ctx = createContext<CatalogContext | null>(null);

function mergeDetail(page: CatalogPage, details: Record<string, Tour>): CatalogPage {
  return { ...page, tours: page.tours.map((tour) => ({ ...tour, ...details[tour.id] })) };
}

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<CatalogContext["status"]>("loading");
  const [page, setPage] = useState<CatalogPage>({ tours: [], news: [], seats: {} });
  const [details, setDetails] = useState<Record<string, Tour>>({});
  const [offline, setOffline] = useState(false);
  const [stale, setStale] = useState(false);
  const [error, setError] = useState<string>();
  const [tick, setTick] = useState(0);
  const detailTried = useRef(new Set<string>());

  useEffect(() => {
    let cancel = false;
    async function run() {
      if (previewMode) {
        setPage(previewCatalog);
        setStatus("ready");
        setOffline(false);
        setStale(false);
        return;
      }
      const cachedRaw = await AsyncStorage.getItem(CACHE).catch(() => null);
      let cached: Cache | null = null;
      if (cachedRaw) {
        try {
          cached = JSON.parse(cachedRaw) as Cache;
        } catch {
          cached = null;
        }
      }
      if (cached && !cancel) {
        setPage(mergeDetail(cached, cached.details ?? {}));
        setDetails(cached.details ?? {});
        setStatus("ready");
        setStale(true);
      }
      try {
        const net = await Network.getNetworkStateAsync();
        if (net.isConnected === false) throw new Error("offline");
        const fresh = await loadPublicCatalog(API_ORIGIN);
        if (cancel) return;
        const nextDetails = cached?.details ?? {};
        const merged = mergeDetail(fresh, nextDetails);
        setPage(merged);
        setDetails(nextDetails);
        setOffline(false);
        setStale(false);
        setError(undefined);
        setStatus("ready");
        await AsyncStorage.setItem(CACHE, JSON.stringify({ ...fresh, details: nextDetails, savedAt: new Date().toISOString() }));
      } catch (e) {
        if (cancel) return;
        if (cached) {
          setOffline(true);
          setStale(true);
          setStatus("ready");
          return;
        }
        setStatus("error");
        setError(e instanceof Error && e.message !== "offline" ? e.message : "Аяллын жагсаалтыг уншиж чадсангүй.");
      }
    }
    void run();
    return () => {
      cancel = true;
    };
  }, [tick]);

  const ensureDetail = useCallback(
    async (id: string) => {
      const known = page.tours.find((tour) => tour.id === id);
      if (previewMode || detailTried.current.has(id)) return known ?? null;
      if (known?.itinerary || known?.includes) return known ?? null;
      detailTried.current.add(id);
      try {
        const tour = await loadPublicTour(API_ORIGIN, id);
        setDetails((current) => ({ ...current, [id]: tour }));
        setPage((current) => ({ ...current, tours: current.tours.some((item) => item.id === id) ? current.tours.map((item) => (item.id === id ? { ...item, ...tour } : item)) : [tour, ...current.tours] }));
        const raw = await AsyncStorage.getItem(CACHE).catch(() => null);
        const cached = raw ? (JSON.parse(raw) as Cache) : null;
        if (cached) {
          cached.details = { ...(cached.details ?? {}), [id]: tour };
          await AsyncStorage.setItem(CACHE, JSON.stringify(cached));
        }
        return tour;
      } catch {
        return known ?? null;
      }
    },
    [page.tours],
  );

  const value = useMemo<CatalogContext>(
    () => ({
      status,
      tours: page.tours,
      news: page.news,
      seats: page.seats,
      offline,
      stale,
      preview: previewMode,
      error,
      refresh: () => setTick((n) => n + 1),
      tourById: (id) => page.tours.find((tour) => tour.id === id),
      ensureDetail,
    }),
    [status, page, offline, stale, error, ensureDetail],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCatalog() {
  const value = useContext(Ctx);
  if (!value) throw new Error("useCatalog");
  return value;
}
