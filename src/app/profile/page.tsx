import { redirect } from "next/navigation";

/** Old profile URL — saved tours now live under My bookings. */
export default function ProfileRoute() {
  redirect("/bookings");
}
