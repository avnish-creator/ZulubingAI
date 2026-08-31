import { describe, expect, it, vi } from "vitest";
import { resetScrollToTop } from "./navigation";

describe("resetScrollToTop", () => {
  it("requests an immediate scroll to the top-left corner", () => {
    const scrollTo = vi.fn();

    resetScrollToTop(scrollTo);

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: "auto" });
  });
});

