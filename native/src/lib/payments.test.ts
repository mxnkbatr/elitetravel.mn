import { describe, expect, it } from "vitest";
import { bookingError } from "./booking-rules";
import { mergeBookings } from "./bookings-merge";
import { payNotice, payNoticeText, paymentLinkKind, QPAY_PATH } from "./payments";
import { bookingCreated, bookingPayload } from "./booking-rules";
import { isBookable, seatHint } from "./tours";

describe("booking rules", () => {
  it("matches the server phone and name checks", () => {
    const tour = { dates: "11/10 – 11/17 · 11/17 – 11/24" };
    const draft = { adults: 1, kidsOwnBed: 0, kidsSharedBed: 0, singleRooms: 0, name: "Болд", phone: "99001122", date: "11/10 – 11/17", note: "" };
    expect(bookingError(tour, draft)).toBeNull();
    expect(bookingError(tour, { ...draft, phone: "12" })).toBe("Утасны дугаараа шалгана уу.");
    expect(bookingError(tour, { ...draft, date: "өөр" })).toBe("Огноо буруу байна.");
  });
});

describe("payment handoff", () => {
  it("opens https in the browser and refuses cleartext or the mock-pay route", () => {
    expect(paymentLinkKind("https://qpay.mn/pay")).toBe("browser");
    expect(paymentLinkKind("qpay://invoice/1")).toBe("external");
    expect(paymentLinkKind("http://qpay.mn/pay")).toBe("reject");
    expect(Object.values(QPAY_PATH).join(" ")).not.toMatch(/mock-pay/);
  });

  it("does not treat a booking response without a server total as created", () => {
    const body = bookingPayload("hainan-4", { adults: 2, kidsOwnBed: 0, kidsSharedBed: 0, singleRooms: 0, name: "Болд", phone: "99001122", date: "", note: "" });
    expect(body).not.toHaveProperty("total");
    expect(body.website).toBe("");
    expect(bookingCreated({ id: "ET-1" })).toBeNull();
    expect(bookingCreated({ id: "ET-1", total: 10, token: "abc" })?.total).toBe(10);
  });
});

describe("pay notices", () => {
  it("never calls a mock invoice a real payment", () => {
    expect(payNotice({ qpay: "mock", status: "paid", paidAmount: 10, previousPaid: 0 })).toBe("mock-recorded");
    expect(payNoticeText("mock-recorded")).toMatch(/Бодит орлого биш/);
    expect(payNotice({ qpay: "live", status: "new", paidAmount: 0, previousPaid: 0, invoiceMock: true })).toBe("mock");
    expect(payNotice({ qpay: "live", status: "paid", paidAmount: 10, previousPaid: 0 })).toBe("paid");
  });
});

describe("catalogue helpers", () => {
  it("hides ended and coming-soon tours from booking", () => {
    expect(isBookable({ tag: "hot", price: 1 })).toBe(true);
    expect(isBookable({ status: "ended", price: 1 })).toBe(false);
    expect(isBookable({ tag: "soon", price: null })).toBe(false);
  });

  it("only mentions a seat count the server published", () => {
    expect(seatHint({ bali: { a: { left: 4, closed: false } } }, "bali")).toBe("4 суудал үлдсэн");
    expect(seatHint({}, "bali")).toBeNull();
  });
});

describe("mergeBookings", () => {
  it("keeps the access token and applies server status", () => {
    const merged = mergeBookings(
      [{ id: "ET-1", tourId: "bali", tourTitle: "Бали", token: "a".repeat(24), createdAt: "2026-11-01", total: 1, deposit: 0 }],
      [],
      [{ id: "ET-1", status: "waitlist", unread: 2, paidAmount: 0, total: 5 }],
    );
    expect(merged[0]?.status).toBe("waitlist");
    expect(merged[0]?.token).toHaveLength(24);
    expect(merged[0]?.total).toBe(5);
  });
});
