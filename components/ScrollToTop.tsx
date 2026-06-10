"use client";

import { useEffect } from "react";

export function ScrollToTop() {
  useEffect(() => {
    // Stop the browser from restoring the previous scroll position on refresh
    window.history.scrollRestoration = "manual";
    // Keep anchor navigation (e.g. #contact) working
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, []);

  return null;
}
