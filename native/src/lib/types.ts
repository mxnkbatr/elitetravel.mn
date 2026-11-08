export type ItineraryDay = {
  day: string;
  title: string;
  detail: string;
  flight?: string;
  meals?: string;
  hotel?: string;
  host?: string;
};

export type TourPricing = {
  child?: string;
  childSharedBed?: number;
  childOwnBed?: boolean;
  singleSupplement?: number;
  depositPercent?: number;
};

export type Tour = {
  id: string;
  title: string;
  destination: string;
  destinationKey?: string;
  description?: string;
  story?: string;
  price: number | null;
  oldPrice?: number | null;
  duration?: string;
  nights?: number | null;
  tag?: string;
  status?: string;
  discount?: string;
  image: string;
  gallery?: string[];
  dates?: string;
  stay?: string;
  departure?: string;
  highlights?: string[];
  includes?: string[];
  excludes?: string[];
  itinerary?: ItineraryDay[];
  pricing?: TourPricing;
  notes?: string[];
};

export type NewsItem = {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  body: string[];
  image: string;
  tourId?: string;
  readMin?: number;
};

export type SeatInfo = { left: number; closed: boolean };
export type SeatMap = Record<string, Record<string, SeatInfo>>;

export type CatalogPage = { tours: Tour[]; news: NewsItem[]; seats: SeatMap };

export type AccountProfile = { email: string; name: string; phone: string; saved: string[] };

export type AccountBooking = {
  id: string;
  tourId: string;
  createdAt: string;
  name: string;
  phone: string;
  date?: string;
  adults: number;
  kidsOwnBed: number;
  kidsSharedBed: number;
  singleRooms: number;
  total: number;
  deposit: number;
  note?: string;
  synced?: boolean;
  token?: string;
};

export type AccountState = { user: AccountProfile | null; bookings: AccountBooking[] };

export type TripStatus = "new" | "contacted" | "confirmed" | "paid" | "cancelled" | "waitlist";

export type PayKind = "deposit" | "balance" | "full";

export type PayOption = { kind: PayKind; label: string; amount: number };

export type TripInvoice = {
  id: string;
  amount: number;
  qrImage: string | null;
  qrText: string | null;
  urls: { name: string; description?: string; logo?: string; link: string }[];
  mock: boolean;
};

export type QpayInvoice = {
  paymentId: string;
  amount: number;
  qrText: string | null;
  qrImage: string | null;
  urls: TripInvoice["urls"];
  mock: boolean;
};

export type Passenger = {
  name: string;
  gender?: "M" | "F";
  birth?: string;
  passport?: string;
  expiry?: string;
};

export type TripMessage = { id: number; at: string; sender: "traveller" | "staff" | "system"; body: string };

export type Trip = {
  id: string;
  tourId: string;
  tourTitle: string;
  travelDate: string | null;
  status: TripStatus;
  adults: number;
  kidsOwnBed: number;
  kidsSharedBed: number;
  singleRooms: number;
  total: number;
  deposit: number;
  paidAmount: number;
  passengers: Passenger[];
  passportConsent: boolean;
  passportStorage: boolean;
  messages: TripMessage[];
  invoice: TripInvoice | null;
  payOptions: PayOption[];
  qpay: "live" | "mock" | "off";
  receipts: { amount: number; status: string; billId: string | null; lottery: string | null; at: string; mock: boolean }[];
  installments: { id: string; name: string; min: number | null; max: number | null; terms: string | null }[];
  installment: { id: string; provider: string; amount: number; phone: string | null; sent: boolean; at: string } | null;
  documents: { type: string; slot: number; label: string; status: string | null; note: string | null }[];
  care: {
    emergencyName: string;
    emergencyPhone: string;
    emergencyRelation?: string;
    diet?: string;
    medical?: string;
    mobility?: string;
  } | null;
  contract: { state: "unavailable" } | { state: "unsigned"; body: string } | { state: "signed"; body: string; name: string; signedAt: string };
};

export type TripSummary = { id: string; status: TripStatus; unread: number; paidAmount: number; total: number };

export type LocalBooking = {
  id: string;
  tourId: string;
  tourTitle: string;
  token?: string;
  createdAt: string;
  total: number;
  deposit: number;
  date?: string;
  status?: TripStatus;
  unread?: number;
  paidAmount?: number;
};

export type Party = { adults: number; kidsOwnBed: number; kidsSharedBed: number; singleRooms: number };
