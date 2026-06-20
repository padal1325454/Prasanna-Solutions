"use client";

import { useEffect, useRef, useState } from "react";
import profile from "@/data/profile.json";
import styles from "./AboutSection.module.css";

export default function AboutSection() {
  const sectionRef = useRef(null);
  const [typed, setTyped] = useState(0);
  const [done, setDone] = useState(false);

  // Run the typewriter only when the section is in view — keeps it from running off-screen
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const bio = profile.bio;
    let interval = null;
    let started = false;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          started = true;
          let i = 0;
          interval = setInterval(() => {
            i = Math.min(i + 2, bio.length);
            setTyped(i);
            if (i >= bio.length) {
              clearInterval(interval);
              setDone(true);
            }
          }, 18);
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      if (interval) clearInterval(interval);
    };
  }, []);

  const bio = profile.bio;

  // Duplicate the items so the marquee can loop seamlessly with a -50% transform
  const marqueeItems = [...profile.skills, ...profile.skills];

  return (
    <section ref={sectionRef} className={styles.section}>
      {/* Left column */}
      <div className={styles.photoCol}>
        <div className={styles.photoWrap}>
          <div className={styles.photoFrame}>
            {/* Plain <img> with object-fit: contain — no cropping */}
            <img
              src="/images/about.png"
              alt={profile.name.full}
              className={styles.photoImg}
              loading="lazy"
            />
          </div>
          {/* Looping handwritten signature — P → a, then erases L→R and repeats */}
          <div className={styles.signatureBlock} aria-hidden>
            <span className={styles.signatureGhost}>{profile.name.full}</span>
            <span className={styles.signature}>{profile.name.full}</span>
          </div>
        </div>
      </div>

      {/* Right column */}
      <div className={styles.content}>
        <p className={styles.whoLabel}>Who I Am</p>

        <div className={styles.marqueeWrap}>
          <div className={styles.marqueeTrack}>
            {marqueeItems.map((item, i) => (
              <span key={i} className={styles.marqueeItem}>
                {item}
                <span className={styles.marqueeDot}>·</span>
              </span>
            ))}
          </div>
        </div>

        <div className={styles.bioWrap}>
          <p className={styles.bio}>
            <span className={styles.typed}>{bio.slice(0, typed)}</span>
            {!done && <span className={styles.cursor} aria-hidden />}
            <span className={styles.untyped}>{bio.slice(typed)}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
