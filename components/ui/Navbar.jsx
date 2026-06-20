"use client";

import { useEffect, useState } from "react";
import profile from "@/data/profile.json";
import styles from "./Navbar.module.css";

const NAV_ITEMS = [
  { label: "Home",     idx: 1 },
  { label: "About",    idx: 2 },
  { label: "Reels",    idx: 3 },
  { label: "Services", idx: 4 },
  { label: "Contact",  idx: 5 },
];

export default function Navbar({ activeIdx, onGo }) {
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);

  // Auto-hide on scroll-down, reveal on scroll-up.
  // Solid backdrop only when we're past the video intro (section 0).
  useEffect(() => {
    let lastY = 0;
    let raf = 0;
    const scroller = document.querySelector(`.${getScrollerClass()}`) || document.documentElement;

    function read() {
      const y = scroller.scrollTop ?? window.scrollY ?? 0;
      const delta = y - lastY;
      const vh = window.innerHeight || 1;

      if (delta > 6 && y > vh * 0.6) {
        setHidden(true);
      } else if (delta < -4 || y < vh * 0.3) {
        setHidden(false);
      }

      // After the video intro section the navbar should sit on a backdrop
      setSolid(y > vh * 0.6);

      lastY = y;
      raf = 0;
    }

    function onScroll() {
      if (raf) return;
      raf = requestAnimationFrame(read);
    }

    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      scroller.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <header
      className={`${styles.header} ${hidden ? styles.headerHidden : ""} ${solid ? styles.headerSolid : ""}`}
    >
      {/* Left: empty spacer (brand removed) */}
      <div className={styles.leftCol} aria-hidden />

      {/* Center: nav links */}
      <nav className={styles.nav} aria-label="Primary">
        {NAV_ITEMS.map(({ label, idx }) => (
          <button
            key={label}
            type="button"
            className={`${styles.link} ${activeIdx === idx ? styles.linkActive : ""}`}
            onClick={() => onGo?.(idx)}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* Right: 3D email button */}
      <div className={styles.rightCol}>
        <a href={`mailto:${profile.email}`} className={styles.emailBtn}>
          <span className={styles.emailDot} aria-hidden />
          Email me
        </a>
      </div>
    </header>
  );
}

// Hint: Site.jsx exports `scroller` via a CSS module class. We reach it through
// the live document instead of an import to avoid coupling. The class name is
// embedded at build-time, so we read it from any element that uses it.
function getScrollerClass() {
  // Resolved at runtime; falls back gracefully if not present.
  const el = document.querySelector('[class*="scroller"]');
  if (!el) return "";
  return el.className.split(/\s+/).find((c) => c.includes("scroller")) || "";
}
