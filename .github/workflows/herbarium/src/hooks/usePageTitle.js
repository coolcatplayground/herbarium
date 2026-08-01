import { useEffect } from "react";

const SITE_NAME = "Folia Codex";

// Sets document.title for the active page, restoring the previous title
// on unmount so navigating away doesn't leave a stale tab name behind.
export function usePageTitle(title) {
  useEffect(() => {
    const previous = document.title;
    document.title = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — A Grass-Type Greenhouse`;
    return () => {
      document.title = previous;
    };
  }, [title]);
}
