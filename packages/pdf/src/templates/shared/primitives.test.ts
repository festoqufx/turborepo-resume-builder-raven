import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const source = readFileSync(fileURLToPath(new URL("./primitives.tsx", import.meta.url)), "utf8").replaceAll(
	"\r\n",
	"\n",
);

describe("Link", () => {
	it("passes the resume page underline preference to shared link styles", () => {
		expect(source).toContain("metadata.page.hideLinkUnderline");
		expect(source).toContain("{ hideUnderline: metadata.page.hideLinkUnderline }");
		expect(source).toContain("resolved.style");
	});
});

describe("SectionHeadingIcon", () => {
	it("passes the resolved heading icon size through the icon size prop", () => {
		expect(source).toContain("size: sizeProp");
		expect(source).toContain("{...(resolvedSize === undefined ? {} : { size: resolvedSize })}");
		expect(source).not.toContain("{ size: headingFontSize } as Style");
	});
});

describe("Icon", () => {
	it("lets level decorations ignore the item-icon slot display so hideIcons and flex layout cannot collapse them", () => {
		expect(source).toContain("ignoreItemSlotDisplay = false");
		expect(source).toContain('if ((!ignoreItemSlotDisplay && display === "none") || !visible) return null;');
		expect(source).toContain("{...(!ignoreItemSlotDisplay && display !== undefined ? { display } : {})}");
	});
});
