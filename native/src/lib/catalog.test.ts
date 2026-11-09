import { describe, expect, it } from "vitest";
import { parsePublicPage } from "./catalog";

const html = `<script>self.__next_f.push([1,"{\\"id\\":\\"bali\\",\\"title\\":\\"Бали\\",\\"destination\\":\\"Бали\\",\\"price\\":5790000,\\"image\\":\\"https://img/bali\\",\\"highlights\\":[\\"Нуса\\"]}\\n{\\"id\\":\\"bali\\",\\"title\\":\\"Бали\\",\\"destination\\":\\"Бали\\",\\"price\\":5790000,\\"image\\":\\"https://img/bali\\",\\"itinerary\\":[{\\"day\\":\\"1\\",\\"title\\":\\"Нислэг\\",\\"detail\\":\\"УБ\\"}],\\"includes\\":[\\"Нислэг\\"],\\"pricing\\":\\"$ref\\"}\\n{\\"id\\":\\"note\\",\\"title\\":\\"Мэдээ\\",\\"excerpt\\":\\"Товч\\",\\"category\\":\\"Мэдээ\\",\\"image\\":\\"https://img/n\\",\\"body\\":[\\"Нэг\\"]}\\n\\"seats\\":{\\"bali\\":{\\"Хүссэн\\":{\\"left\\":4,\\"closed\\":false}}}"])</script>`;

describe("parsePublicPage", () => {
  it("reads tours, detail, news and seats from a flight payload", () => {
    const page = parsePublicPage(html);
    expect(page.tours).toHaveLength(1);
    expect(page.tours[0]?.highlights).toEqual(["Нуса"]);
    expect(page.tours[0]?.itinerary?.[0]?.title).toBe("Нислэг");
    expect(page.tours[0]?.includes).toEqual(["Нислэг"]);
    expect(page.tours[0]?.pricing).toBeUndefined();
    expect(page.news[0]?.title).toBe("Мэдээ");
    expect(page.seats.bali?.["Хүссэн"]).toEqual({ left: 4, closed: false });
  });

  it("returns an empty catalogue when the page has no flight data", () => {
    expect(parsePublicPage("<html></html>").tours).toEqual([]);
  });
});
