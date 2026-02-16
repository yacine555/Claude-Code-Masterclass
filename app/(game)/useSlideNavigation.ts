"use client";

import { useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

/**
 * Hook that manages slide transitions between game screens.
 * Returns a ref to attach to the animated container and a navigate function
 * that triggers the slide-out animation before routing.
 */
export function useSlideNavigation(slideOutClass: string) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const navigatingRef = useRef(false);

  const navigate = useCallback(
    (path: string) => {
      if (navigatingRef.current) return;
      navigatingRef.current = true;

      const el = containerRef.current;
      if (el) {
        el.classList.add(slideOutClass);
        const onEnd = () => router.push(path);
        el.addEventListener("animationend", onEnd, { once: true });
        setTimeout(onEnd, 600);
      } else {
        router.push(path);
      }
    },
    [router, slideOutClass],
  );

  return { containerRef, navigate };
}
