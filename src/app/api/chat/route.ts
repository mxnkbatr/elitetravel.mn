import { formatPrice, isBookable } from "@/data/tours";
import { getTours } from "@/lib/server/content";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

export const maxDuration = 60;

/** Keeps a single visitor from running up the model bill with huge or endless chats. */
const MAX_TURNS = 12;
const MAX_CHARS = 1000;

const textLength = (m: UIMessage) => m.parts.reduce((n, p) => n + (p.type === "text" ? p.text.length : 0), 0);

export async function POST(req: Request) {
  let messages: UIMessage[];
  try {
    ({ messages } = (await req.json()) as { messages: UIMessage[] });
  } catch {
    return Response.json({ error: "bad request" }, { status: 400 });
  }
  if (!Array.isArray(messages) || messages.length === 0) return Response.json({ error: "bad request" }, { status: 400 });
  const recent = messages.slice(-MAX_TURNS);
  if (recent.some((m) => textLength(m) > MAX_CHARS)) return Response.json({ error: "too long" }, { status: 413 });

  const catalog = (await getTours())
    .filter(isBookable)
    .map((t) =>
      [
        `- ${t.title} (/tours/${t.id})`,
        t.destination,
        t.duration,
        formatPrice(t.price),
        t.dates ? `Огноо: ${t.dates}` : null,
        t.description,
      ]
        .filter(Boolean)
        .join(" | "),
    )
    .join("\n");

  const result = streamText({
    model: "openai/gpt-4o-mini",
    system: `Чи Elite Travel Mongolia-ийн аяллын туслах. Монгол хэлээр богино (2–4 өгүүлбэр), найрсаг хариул.
Зөвхөн доорх бодит аяллуудаас зөвлө, үнэ огноог зохиож болохгүй. Аялал санал болгохдоо холбоосыг нь яг "/tours/<id>" хэлбэрээр бич.
Захиалах бол аяллын хуудсан дээрх "Захиалах" товчийг ашиглахыг, тодорхойгүй зүйлд +976 9003 1771 руу залгахыг санал болго.
Аялалтай холбоогүй асуултад эелдгээр татгалз.

Одоо нээлттэй аяллууд:
${catalog}`,
    messages: await convertToModelMessages(recent),
    maxOutputTokens: 400,
  });

  return result.toUIMessageStreamResponse();
}
