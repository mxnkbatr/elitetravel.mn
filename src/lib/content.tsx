"use client";

import type { NewsItem } from "@/data/news";
import type { Tour } from "@/data/tours";
import { createContext, useContext, type ReactNode } from "react";

type Content = { tours: Tour[]; news: NewsItem[] };

const ContentContext = createContext<Content>({ tours: [], news: [] });

/** Tours and news from the database, loaded once in the root layout and shared with client components. */
export function ContentProvider({ tours, news, children }: Content & { children: ReactNode }) {
  return <ContentContext.Provider value={{ tours, news }}>{children}</ContentContext.Provider>;
}

export function useTours() {
  return useContext(ContentContext).tours;
}

export function useNews() {
  return useContext(ContentContext).news;
}
