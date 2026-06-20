"use client";

import profile from "@/data/profile.json";
import { SocialIcon } from "@/components/ui/socialIcons";
import styles from "./FooterSection.module.css";

export default function FooterSection({ onBackToTop }) {
  const pubs = profile.publications;
  const year = new Date().getFullYear();

  return (
    <section className={styles.section}>
      <div className={styles.pubsWrap}>
        {/* Left: press list */}
        <div>
          <div className={styles.pubsHeader}>
            <span className={styles.label}>Press &amp; Releases</span>
            <h2 className={styles.heading}>
              Highlight <span className={styles.headingAccent}>Reel.</span>
            </h2>
          </div>

          <div className={styles.pubList}>
            {pubs.map((pub, i) => (
              <a
                key={pub.id}
                href={pub.link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.pub}
                style={{
                  // staggered entrance delay + per-card counter for the bg numeral
                  "--i": i,
                  counterReset: `pubcount ${i + 1}`,
                }}
              >
                <span className={styles.pubNum}>0{i + 1} · {pub.year}</span>
                <div className={styles.pubBody}>
                  <div className={styles.pubTopRow}>
                    <h3 className={styles.pubTitle}>{pub.title}</h3>
                    <span className={styles.pubPlatform}>{pub.platform}</span>
                  </div>
                  <p className={styles.pubDesc}>{pub.desc}</p>
                </div>
                <div className={styles.pubMeta}>
                  <span className={styles.pubYear}>{pub.year}</span>
                  <span className={styles.pubArrow}>
                    View
                    <svg
                      className={styles.pubArrowIcon}
                      width="11"
                      height="11"
                      viewBox="0 0 11 11"
                      fill="none"
                      aria-hidden
                    >
                      <path d="M2 9L9 2M9 2H4M9 2V7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Right: contact card */}
        <aside className={styles.contact}>
          <p className={styles.contactEyebrow}>
            <span className={styles.contactDot} aria-hidden />
            {profile.availableLabel}
          </p>
          <h2 className={styles.cta}>
            Let&apos;s build something
            <br />
            <span className={styles.ctaAccent}>worth sharing.</span>
          </h2>

          <a href={`mailto:${profile.email}`} className={styles.emailBtn}>
            {profile.email} ↗
          </a>

          {/* Contact rows — email already above, plus phone + address */}
          <ul className={styles.contactRows}>
            {profile.phone && (
              <li className={styles.contactRow}>
                <span className={styles.contactRowLabel}>Phone</span>
                <a
                  href={`tel:${profile.phone.replace(/\s+/g, "")}`}
                  className={styles.contactRowValue}
                >
                  {profile.phone}
                </a>
              </li>
            )}
            {profile.address && (
              <li className={styles.contactRow}>
                <span className={styles.contactRowLabel}>Studio</span>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.contactRowValue}
                >
                  {profile.address}
                </a>
              </li>
            )}
          </ul>

          <div className={styles.socials}>
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
                <SocialIcon label={s.label} size={18} />
              </a>
            ))}
          </div>
        </aside>
      </div>

      {/* Bottom row */}
      <div className={styles.bottom}>
        <span className={styles.copyright}>
          © {year} <span>Prasanna</span> · All rights reserved
        </span>
        <button type="button" className={styles.backToTop} onClick={onBackToTop}>
          <span>Back to top</span>
          <span className={styles.backArrow} aria-hidden>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 10V2M6 2L2 6M6 2L10 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </button>
      </div>
    </section>
  );
}
