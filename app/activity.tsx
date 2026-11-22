"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { record } from "./analytics-events";

export function Activity() {
  const path = usePathname();
  useEffect(() => {
    if (path !== "/" && path !== "/projects/olist-excel-analytics") return;
    record(path === "/" ? "home" : "caseStudy");
    let remaining = 30000;
    let started = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let done = false;
    function toggle() {
      if (timer !== undefined) {
        clearTimeout(timer);
        remaining -= performance.now() - started;
        timer = undefined;
      }
      if (!document.hidden && !done) {
        started = performance.now();
        timer = setTimeout(() => { done = true; timer = undefined; record("engaged"); }, Math.max(0, remaining));
      }
    }
    function click(event: MouseEvent) {
      const link = event.target instanceof Element ? event.target.closest("a") : null;
      if (!link) return;
      if (link.hasAttribute("download")) record("download");
      else if (link.hostname === "coursera.org") record("verify");
      else if (link.protocol === "mailto:" || link.hostname === "www.linkedin.com") record("contact");
    }
    toggle();
    document.addEventListener("visibilitychange", toggle);
    document.addEventListener("click", click);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", toggle);
      document.removeEventListener("click", click);
    };
  }, [path]);
  return null;
}
