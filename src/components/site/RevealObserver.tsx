import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";

/**
 * Global scroll-reveal: any element with `data-reveal` becomes visible
 * once it enters the viewport. Re-scans on route change.
 */
export function RevealObserver() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Auto-tag common content blocks so pages animate on scroll without
    // needing every element to opt in manually.
    const autoTag = () => {
      const selectors = [
        "main section > div",
        "main section > div > *",
        ".stagger > *",
      ];
      const nodes = document.querySelectorAll<HTMLElement>(selectors.join(","));
      nodes.forEach((el) => {
        if (!el.hasAttribute("data-reveal")) {
          el.setAttribute("data-reveal", "");
        }
      });
    };

    if (!("IntersectionObserver" in window)) {
      autoTag();
      document
        .querySelectorAll<HTMLElement>("[data-reveal]")
        .forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -120px 0px" },
    );

    const scan = () => {
      autoTag();
      const revealEls = document.querySelectorAll<HTMLElement>("[data-reveal]");

      revealEls.forEach((el) => {
        const rect = el.getBoundingClientRect();

        // If a route/HMR update left below-the-fold elements visible, reset them
        // so the user sees the reveal when they actually scroll to that content.
        if (rect.top > window.innerHeight + 80) {
          el.classList.remove("is-visible");
        }

        if (!el.classList.contains("is-visible")) {
          io.observe(el);
        }
      });
    };

    scan();
    const unsub = router.subscribe("onResolved", () => {
      // Let the new route paint, then scan.
      requestAnimationFrame(() => requestAnimationFrame(scan));
    });

    return () => {
      io.disconnect();
      unsub();
    };
  }, [router]);

  return null;
}