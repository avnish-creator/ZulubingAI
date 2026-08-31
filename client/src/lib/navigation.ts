export type ScrollToTop = (options: ScrollToOptions) => void;

export function resetScrollToTop(scrollTo: ScrollToTop) {
  scrollTo({ top: 0, left: 0, behavior: "auto" });
}

