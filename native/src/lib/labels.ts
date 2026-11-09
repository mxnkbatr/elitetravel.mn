import type { TripStatus } from "./types";

export const STATUS_LABEL: Record<TripStatus, string> = {
  new: "Шинэ",
  contacted: "Холбогдсон",
  confirmed: "Баталгаажсан",
  paid: "Төлсөн",
  cancelled: "Цуцалсан",
  waitlist: "Хүлээлэг",
};

export const DOC_LABEL: Record<string, string> = {
  passport_copy: "Паспортын зургийн хуудас",
  id_card: "Иргэний үнэмлэх",
  visa_photo: "Визийн зураг",
  employment_letter: "Ажлын газрын тодорхойлолт",
  bank_statement: "Банкны хуулга",
  birth_certificate: "Төрсний гэрчилгээ",
  minor_consent: "Эцэг/эхийн зөвшөөрөл",
};

export const DOC_STATUS: Record<string, string> = {
  pending: "Шалгаж байна",
  approved: "Зөвшөөрсөн",
  rejected: "Дахин илгээх",
};
