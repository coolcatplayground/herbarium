import { useEffect } from "react";

const SITE_NAME = "Folia Codex";

// Sets document.title to "<page> — Folia Codex". Every routed page calls
// this, so there's no need to restore a previous value on unmount — the
// next page's own call handles that.
export default function useDocumentTitle(pageTitle) {
  useEffect(() => {
    document.title = pageTitle ? `${pageTitle} — ${SITE_NAME}` : SITE_NAME;
  }, [pageTitle]);
}

