"use client";

import { useState } from "react";
import profile from "@/data/profile.json";
import styles from "./PerformancesSection.module.css";

export default function PerformancesSection({ onContact }) {
  const items = profile.services;
  // First card open by default — gives the section more life on landing
  const [openId, setOpenId] = useState(items[0]?.id ?? null);

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <span className={styles.label}>Services</span>
        <span className={styles.count}>0{items.length} Offerings</span>
      </div>

      <h2 className={styles.heading}>
        What I can <span className={styles.headingAccent}>build for you.</span>
      </h2>

      <div className={styles.grid}>
        {items.map((s, i) => {
          const open = s.id === openId;
          return (
            <button
              key={s.id}
              type="button"
              className={`${styles.card} ${open ? styles.cardActive : ""}`}
              onClick={() => setOpenId(open ? null : s.id)}
              data-num={String(i + 1).padStart(2, "0")}
              style={{ "--i": i }}
              aria-expanded={open}
            >
              <div className={styles.cardHead}>
                <h3 className={styles.role}>
                  {s.title}
                  <span className={styles.venue}> — {s.tagline}</span>
                </h3>
                <div className={styles.meta}>
                  <span>{s.type}</span>
                </div>
              </div>

              <p className={styles.desc}>{s.desc}</p>

              <div className={`${styles.expander} ${open ? styles.expanderOpen : ""}`}>
                <ul className={styles.bullets}>
                  {s.bullets.map((b, idx) => (
                    <li key={idx} className={styles.bullet}>
                      <span className={styles.bulletDot} aria-hidden />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </button>
          );
        })}
      </div>

      <div className={styles.ctaRow}>
        <p className={styles.ctaLine}>
          Have a brief in mind? Let&apos;s make it move.
        </p>
        <button type="button" className={styles.ctaBtn} onClick={() => onContact?.()}>
          Get in touch →
        </button>
      </div>
    </section>
  );
}
