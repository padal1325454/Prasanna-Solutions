"use client";

import { useEffect, useRef, useState } from "react";
import VideoIntro from "@/components/sections/VideoIntro";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import PerformancesSection from "@/components/sections/PerformancesSection";
import FooterSection from "@/components/sections/FooterSection";
import Navbar from "@/components/ui/Navbar";
import Cursor from "@/components/ui/Cursor";
import styles from "./Site.module.css";

const SECTIONS = [
  { id: "intro",    label: "Intro" },
  { id: "hero",     label: "Home" },
  { id: "about",    label: "About" },
  { id: "reels",    label: "Reels" },
  { id: "services", label: "Services" },
  { id: "contact",  label: "Contact" },
];

export default function Site() {
  const scrollerRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);

  // Track which section is in view so the dots indicator stays in sync
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const sections = el.querySelectorAll("[data-section]");

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = Number(e.target.getAttribute("data-section"));
            if (!Number.isNaN(idx)) setActiveIdx(idx);
          }
        });
      },
      { root: el, threshold: 0.55 }
    );

    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  function goTo(idx) {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ top: idx * window.innerHeight, behavior: "smooth" });
  }

  return (
    <>
      <Cursor />
      <Navbar activeIdx={activeIdx} onGo={goTo} />

      <div ref={scrollerRef} className={styles.scroller}>
        <section data-section="0" className={styles.snap}>
          <VideoIntro active={activeIdx === 0} onNext={() => goTo(1)} />
        </section>

        <section data-section="1" className={styles.snap}>
          <HeroSection onViewReels={() => goTo(3)} />
        </section>

        <section data-section="2" className={styles.snap}>
          <AboutSection />
        </section>

        <section data-section="3" className={styles.snap}>
          <ProjectsSection />
        </section>

        <section data-section="4" className={styles.snap}>
          <PerformancesSection onContact={() => goTo(5)} />
        </section>

        <section data-section="5" className={styles.snap}>
          <FooterSection onBackToTop={() => goTo(0)} />
        </section>
      </div>

      {/* Right-side dot navigator */}
      <nav className={styles.dots} aria-label="Section navigation">
        {SECTIONS.map((s, i) => (
          <button
            key={s.id}
            className={`${styles.dot} ${i === activeIdx ? styles.dotActive : ""}`}
            onClick={() => goTo(i)}
            aria-label={`Go to ${s.label}`}
          />
        ))}
      </nav>
    </>
  );
}

function PlaceholderSection({ idx, label, bg, color }) {
  return (
    <section
      data-section={idx}
      className={styles.snap}
      style={{
        background: bg,
        color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "1rem",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.7rem",
          letterSpacing: "0.4em",
          textTransform: "uppercase",
          opacity: 0.55,
        }}
      >
        Section 0{idx + 1}
      </p>
      <h2
        className="font-display"
        style={{
          margin: 0,
          fontSize: "clamp(3rem, 9vw, 6rem)",
          fontWeight: 900,
          letterSpacing: "-0.02em",
        }}
      >
        {label}
      </h2>
      <p style={{ opacity: 0.55, fontSize: "0.8rem" }}>
        Coming in step {idx + 4}
      </p>
    </section>
  );
}
