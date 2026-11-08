export type PayNotice = "off" | "mock" | "mock-recorded" | "paid" | "pending";

/** What the screen may say after the server answers. Mock is never a real payment. */
export function payNotice(input: { qpay: "live" | "mock" | "off"; invoiceMock?: boolean; status: string; paidAmount: number; previousPaid: number }): PayNotice {
  if (input.qpay === "off") return "off";
  const recorded = input.status === "paid" || input.paidAmount > input.previousPaid;
  if (input.qpay === "mock" || input.invoiceMock) return recorded ? "mock-recorded" : "mock";
  return recorded ? "paid" : "pending";
}

export function payNoticeText(notice: PayNotice) {
  switch (notice) {
    case "off":
      return "Онлайн төлбөр түр ажиллахгүй байна. Манай багтай холбогдоно уу.";
    case "mock":
      return "Сервер энэ нэхэмжлэхийг туршилтын горим гэж тэмдэглэсэн. Төлбөр хийгдсэнд тооцохгүй.";
    case "mock-recorded":
      return "Сервер туршилтын төлбөр гэж бүртгэсэн. Бодит орлого биш.";
    case "paid":
      return "Сервер төлбөрийг хүлээн авсан.";
    case "pending":
      return "Сервер төлбөр хараахан бүртгээгүй байна.";
  }
}
