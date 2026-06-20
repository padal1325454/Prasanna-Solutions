"use client";

import { useEffect, useRef, useState } from "react";
import profile from "@/data/profile.json";
import styles from "./ProjectsSection.module.css";

export default function ProjectsSection() {
  const reels = profile.projects;
  const total = reels.length;
  const [active, setActive] = useState(0);
  const videoRefs = useRef([]);
  const stageRef = useRef(null);
  const cardRefs = useRef([]);

  // Only the active card plays — others stay frozen on their poster frame
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === active) {
        v.muted = true;
        v.play().catch(() => {});
      } else {
        v.pause();
        // Snap others to a small offset so they don't all show the same first frame
        if (v.duration && v.currentTime < 0.1) {
          try { v.currentTime = Math.min(v.duration * 0.15, 1); } catch {}
        }
      }
    });
  }, [active]);

  // Pause everything when section scrolls off-screen — saves CPU/GPU
  const sectionRef = useRef(null);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting;
        videoRefs.current.forEach((v, i) => {
          if (!v) return;
          if (inView && i === active) v.play().catch(() => {});
          else v.pause();
        });
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [active]);

  function go(delta) {
    setActive((prev) => {
      const next = Math.max(0, Math.min(total - 1, prev + delta));
      scrollToCard(next);
      return next;
    });
  }

  function scrollToCard(idx) {
    // On mobile, the stage is a horizontal scroll rail — bring the new active card into view
    const stage = stageRef.current;
    const card = cardRefs.current[idx];
    if (!stage || !card) return;
    if (stage.scrollWidth <= stage.clientWidth + 4) return; // not in mobile rail mode
    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
    const target = cardCenter - stage.clientWidth / 2;
    stage.scrollTo({ left: target, behavior: "smooth" });
  }

  // On mobile, when the user swipes the rail, sync the `active` state to whichever card is centered
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        if (stage.scrollWidth <= stage.clientWidth + 4) return;
        const center = stage.scrollLeft + stage.clientWidth / 2;
        let nearest = 0;
        let nearestDist = Infinity;
        cardRefs.current.forEach((c, i) => {
          if (!c) return;
          const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - center);
          if (d < nearestDist) { nearestDist = d; nearest = i; }
        });
        setActive((prev) => (prev === nearest ? prev : nearest));
      });
    };
    stage.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      stage.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const activeReel = reels[active];

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.topBar}>
        <span className={styles.label}>Featured Reels</span>
        <div className={styles.counter}>
          <span className={styles.cCur}>0{active + 1}</span>
          <span className={styles.cSep}>/</span>
          <span className={styles.cTot}>0{total}</span>
        </div>
      </div>

      <h2 className={styles.heading}>
        Highlights, <span className={styles.headingAccent}>looping.</span>
      </h2>

      <div ref={stageRef} className={styles.stage}>
        {reels.map((reel, i) => {
          const isActive = i === active;
          return (
            <button
              key={reel.id}
              ref={(el) => { cardRefs.current[i] = el; }}
              type="button"
              className={`${styles.card} ${isActive ? styles.cardActive : ""}`}
              onClick={() => { setActive(i); scrollToCard(i); }}
              aria-label={`Show ${reel.title}`}
              aria-pressed={isActive}
            >
              <video
                ref={(el) => { videoRefs.current[i] = el; }}
                src={reel.video}
                playsInline
                muted
                loop
                preload="metadata"
                className={styles.video}
              />
              <div className={styles.cardOverlay} aria-hidden />
              <div className={styles.cardContent}>
                <span className={styles.cardType}>{reel.type}</span>
                <h3 className={styles.cardTitle}>{reel.title}</h3>
                <p className={styles.cardSubtitle}>{reel.subtitle}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className={styles.bottomBar}>
        <div className={styles.activeInfo}>
          <h3 className={styles.activeTitle}>{activeReel.title}</h3>
          <p className={styles.activeDesc}>{activeReel.desc}</p>
        </div>

        <nav className={styles.nav} aria-label="Reel navigation">
          <button
            type="button"
            className={styles.navBtn}
            onClick={() => go(-1)}
            disabled={active === 0}
            aria-label="Previous reel"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <polyline points="9,2 3,7 9,12" />
            </svg>
          </button>
          <button
            type="button"
            className={styles.navBtn}
            onClick={() => go(1)}
            disabled={active === total - 1}
            aria-label="Next reel"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <polyline points="5,2 11,7 5,12" />
            </svg>
          </button>
        </nav>
      </div>

      <div
        className={styles.progress}
        style={{ width: `${((active + 1) / total) * 100}%` }}
        aria-hidden
      />
    </section>
  );
}
