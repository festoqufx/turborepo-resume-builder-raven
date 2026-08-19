import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const source = readFileSync(fileURLToPath(new URL("./level-display.tsx", import.meta.url)), "utf8").replaceAll("\r\n", "\n");

describe("LevelDisplay", () => {
	it("does not inherit item-icon hideIcons/flex display when rendering icon-type levels", () => {
		expect(source).toContain("ignoreItemSlotDisplay");
	});
});
