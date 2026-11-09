export function formatPrice(price: number | null | undefined) {
  if (price == null) return "Удахгүй";
  const digits = String(Math.round(price)).replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  return `₮${digits}`;
}

/** Insert Cloudinary transforms into a public upload URL. Leaves other URLs unchanged. */
export function imageUrl(url: string, width: number, height?: number) {
  const marker = "/image/upload/";
  const at = url.indexOf(marker);
  if (at < 0) return url;
  const rest = url.slice(at + marker.length);
  if (/^[a-z]_/.test(rest)) return url;
  const crop = height ? `c_fill,g_auto,h_${height},` : "c_limit,";
  return `${url.slice(0, at + marker.length)}f_auto,q_auto,${crop}w_${width}/${rest}`;
}
