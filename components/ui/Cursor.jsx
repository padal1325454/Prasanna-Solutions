"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Cursor.module.css";

const INTERACTIVE_SELECTOR =
  "a, button, [role='button'], input, textarea, select, label, [data-cursor='hover']";

export default function Cursor() {
  const ringRef = useRef(null);
  const glowRef = useRef(null);
  const dotRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { x: target.x, y: target.y };
    const glowPos = { x: target.x, y: target.y };
    let raf;
    let lastHover = false;

    const tick = () => {
      // Ring trails the dot with a soft lag — gives the premium "comet" feel
      ringPos.x += (target.x - ringPos.x) * 0.18;
      ringPos.y += (target.y - ringPos.y) * 0.18;
      glowPos.x += (target.x - glowPos.x) * 0.28;
      glowPos.y += (target.y - glowPos.y) * 0.28;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px) translate(-50%, -50%)`;
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${glowPos.x}px, ${glowPos.y}px) translate(-50%, -50%)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${target.x}px, ${target.y}px) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };
    tick();

    function resolveHover(x, y) {
      const el = document.elementFromPoint(x, y);
      return !!(el && el.closest(INTERACTIVE_SELECTOR));
    }

    const onMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!ready) setReady(true);

      const isHover = resolveHover(e.clientX, e.clientY);
      if (isHover !== lastHover) {
        lastHover = isHover;
        setHover(isHover);
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        className={`${styles.ring} ${ready ? styles.ringReady : ""} ${hover ? styles.ringHover : ""}`}
        aria-hidden
      />
      <div
        ref={glowRef}
        className={`${styles.glow} ${ready ? styles.glowReady : ""} ${hover ? styles.glowHover : ""}`}
        aria-hidden
      />
      <div
        ref={dotRef}
        className={`${styles.dot} ${ready ? styles.dotReady : ""} ${hover ? styles.dotHover : ""}`}
        aria-hidden
      />
    </>
  );
}
