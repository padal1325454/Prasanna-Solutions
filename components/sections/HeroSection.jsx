"use client";

import dynamic from "next/dynamic";
import profile from "@/data/profile.json";
import { SocialIcon } from "@/components/ui/socialIcons";
import styles from "./HeroSection.module.css";

// three.js is client-only and heavy — load it only after first paint
const BokehLayer = dynamic(() => import("@/components/three/BokehLayer"), { ssr: false });

function splitTagline(text, highlight) {
  if (!highlight) return [text];
  const parts = text.split(highlight);
  const out = [];
  parts.forEach((part, i) => {
    out.push(part);
    if (i < parts.length - 1) {
      out.push(
        <span key={i} className={styles.taglineAccent}>
          {highlight}
        </span>
      );
    }
  });
  return out;
}

export default function HeroSection({ onViewReels }) {
  return (
    <section className={styles.section}>
      {/* Bokeh particles — paused when off-screen */}
      <BokehLayer />

      {/* Social sidebar — brand icons only, no text */}
      <aside className={styles.socialSidebar} aria-label="Social links">
        {profile.socials.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
            aria-label={s.label}
            title={s.label}
          >
            <SocialIcon label={s.label} size={22} />
          </a>
        ))}
      </aside>

      {/* Left content */}
      <div className={styles.content}>
        <h1 className={styles.nameBlock}>
          <span className={styles.nameFirst}>{profile.name.full}</span>
          <span className={styles.nameLast}>{profile.roleShort}</span>
        </h1>

        <div className={styles.pills}>
          {profile.pills.map((tag) => (
            <span key={tag} className={styles.pill}>{tag}</span>
          ))}
        </div>

        <button
          type="button"
          className={styles.viewBtn}
          onClick={() => onViewReels?.()}
        >
          View Reels →
        </button>
      </div>

      {/* Right column cards */}
      <div className={styles.cardsCol}>
        <div className={styles.taglineCard}>
          <p className={styles.taglineText}>
            {splitTagline(profile.tagline, "rhythm, voice, and lens")}
          </p>
          <p className={styles.freelanceNote}>{profile.freelanceNote}</p>
        </div>

        {profile.available && (
          <div className={styles.availCard}>
            <div className={styles.availHeader}>
              <span className={styles.availDot} aria-hidden />
              <span className={styles.availStatus}>{profile.availableLabel}</span>
            </div>
            <p className={styles.locationLine}>
              Based in <strong>{profile.location.based}</strong>
            </p>
            <p className={styles.locationLine}>
              Available {profile.location.availability}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
