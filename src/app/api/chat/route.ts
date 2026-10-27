import { tours } from "@/data/tours";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

export const maxDuration = 60;

const catalog = tours
  .filter((t) => t.tag !== "soon")
  .map(
    (t) =>
      `- ${t.title} | ${t.destination} | ${t.duration} | ${t.price ?? "N/A"} MNT | ${t.description}`,
  )
  .join("\n");

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: "openai/gpt-4o-mini",
    system: `Чи Elite Travel Mongolia-ийн аяллын AI туслах. Монгол хэлээр богино, найрсаг хариул. Зөвхөн доорх бодит аяллуудаас зөвлө:

${catalog}

Холбоо: +976 9003 1771. Үнэ/огноо тодорхойгүй бол холбогдохыг сануул.`,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
