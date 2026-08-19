// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useDebouncedValue } from "./use-debounced-value";

describe("useDebouncedValue", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("returns the initial value immediately", () => {
		const { result } = renderHook(() => useDebouncedValue("alpha", 200));
		expect(result.current).toBe("alpha");
	});

	it("does not update until the delay elapses", () => {
		const { result, rerender } = renderHook(({ value }: { value: string }) => useDebouncedValue(value, 200), {
			initialProps: { value: "alpha" },
		});

		rerender({ value: "beta" });
		expect(result.current).toBe("alpha");

		act(() => {
			vi.advanceTimersByTime(199);
		});
		expect(result.current).toBe("alpha");

		act(() => {
			vi.advanceTimersByTime(1);
		});
		expect(result.current).toBe("beta");
	});
});
