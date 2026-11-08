import { API_ORIGIN } from "./config";
import { applySetCookies, cookieHeader, readSetCookieHeaders, type Cookie } from "./cookies";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function messageFromBody(body: unknown, fallback: string) {
  if (body && typeof body === "object" && "error" in body && typeof body.error === "string" && body.error) return body.error;
  return fallback;
}

type RequestOptions = {
  path: string;
  method?: string;
  json?: unknown;
  form?: FormData;
  headers?: Record<string, string>;
  cookies?: Cookie[];
  origin?: string;
  fetchImpl?: typeof fetch;
};

export async function apiRequest(options: RequestOptions) {
  const cookies = options.cookies ?? [];
  const headers: Record<string, string> = { Accept: "application/json", ...options.headers };
  const headerValue = cookieHeader(cookies);
  if (headerValue) headers.Cookie = headerValue;
  let body: BodyInit | undefined;
  if (options.form) body = options.form;
  else if (options.json !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(options.json);
  }
  let response: Response;
  try {
    response = await (options.fetchImpl ?? fetch)(`${options.origin ?? API_ORIGIN}${options.path}`, { method: options.method ?? (body ? "POST" : "GET"), headers, body });
  } catch {
    throw new ApiError(0, "Интернэт холболтоо шалгана уу.");
  }
  const text = await response.text();
  let parsed: unknown = {};
  if (text) {
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = {};
    }
  }
  const nextCookies = applySetCookies(cookies, readSetCookieHeaders(response.headers));
  if (!response.ok) throw new ApiError(response.status, messageFromBody(parsed, "Алдаа гарлаа. Дахин оролдоно уу."));
  return { status: response.status, body: parsed, cookies: nextCookies };
}
