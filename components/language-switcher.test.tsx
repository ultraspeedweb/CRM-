import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { LanguageSwitcher } from "./language-switcher";

describe("LanguageSwitcher", () => {
  it("uses document navigations so the locale cookie refreshes server-rendered copy", () => {
    const html = renderToStaticMarkup(<LanguageSwitcher locale="ar" next="/pricing" />);

    expect(html).toContain('<a class="active" href="/api/locale?locale=ar&amp;next=%2Fpricing">AR</a>');
    expect(html).toContain('<a class="" href="/api/locale?locale=tr&amp;next=%2Fpricing">TR</a>');
    expect(html).toContain('<a class="" href="/api/locale?locale=en&amp;next=%2Fpricing">EN</a>');
  });
});
