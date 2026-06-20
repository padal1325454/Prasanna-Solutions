"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import profile from "@/data/profile.json";
import styles from "./VideoIntro.module.css";

// Video lifecycle:
//   "playing" → video is playing (muted on first load, unmuted after user clicks anywhere)
//   "ended"   → video reached its end, frozen at frame 0, "Watch again" overlay shown
export default function VideoIntro({ active = true }) {
  const videoRef = useRef(null);
  const [state, setState] = useState("playing");
  // Default `ready` to true — we don't want a black screen if the readiness event
  // doesn't fire as expected. The video's own `opacity:0` until loaded was hiding it.
  const [ready, setReady] = useState(true);
  const [muted, setMuted] = useState(true);

  // Autoplay muted on mount; pause/resume based on whether this section is in view
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (!active && state === "playing") {
      v.pause();
    }
    if (active && state === "playing" && v.paused) {
      v.play().catch(() => {});
    }
  }, [active, state]);

  // Initial autoplay (muted)
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
  }, []);

  function unmute(e) {
    e?.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    setMuted(false);
    v.play().catch(() => {
      // If even click fails, fall back to muted (shouldn't happen since this is a user gesture)
      v.muted = true;
      setMuted(true);
    });
  }

  function toggleMute(e) {
    e?.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }

  function replay() {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.muted = false; // user gesture, sound on
    setMuted(false);
    v.play().catch(() => {});
    setState("playing");
  }

  function handleEnded() {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.pause();
    setState("ended");
  }

  function handleSectionClick() {
    // Clicking anywhere on the video while muted = unmute.
    // Once unmuted, clicks don't pause (we have a dedicated mute toggle instead).
    if (state === "playing" && muted) unmute();
  }

  const roleParts = profile.roleDetailed.split("·").map((s) => s.trim());

  return (
    <section className={styles.section} onClick={handleSectionClick}>
      <video
        ref={videoRef}
        src="/video/intro.mp4"
        playsInline
        muted
        autoPlay
        preload="auto"
        onLoadedData={() => setReady(true)}
        onCanPlay={() => setReady(true)}
        onEnded={handleEnded}
        className={`${styles.video} ${ready ? styles.videoReady : ""}`}
      />

      <div className={styles.overlay} />

      {/* Bottom-left content */}
      <div className={styles.content}>
        <h1 className={styles.name}>
          <span>{profile.name.full}</span>
        </h1>
        <p className={styles.role}>
          {roleParts.map((part, i) => (
            <Fragment key={part}>
              <span>{part.toUpperCase()}</span>
              {i < roleParts.length - 1 && <span className={styles.roleSep}>|</span>}
            </Fragment>
          ))}
        </p>
      </div>

      {/* Tap for sound — icon-only, right side */}
      {state === "playing" && muted && (
        <button type="button" className={styles.soundCTA} onClick={unmute} aria-label="Tap for sound">
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M2 5.5h2.5L8 3v10l-3.5-2.5H2V5.5z" fill="currentColor" stroke="none" />
            <path d="M10.5 5.5C11.8 6.5 12.5 7.2 12.5 8s-.7 1.5-2 2.5" />
            <path d="M12 3.5C14 5 15 6.4 15 8s-1 3-3 4.5" />
          </svg>
        </button>
      )}

      {/* Sound icon toggle — just the speaker, below the navbar */}
      {state === "playing" && !muted && (
        <button type="button" className={styles.muteToggle} onClick={toggleMute} aria-label="Mute video">
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M2 5.5h2.5L8 3v10l-3.5-2.5H2V5.5z" fill="currentColor" stroke="none" />
            <path d="M10.5 5.5C11.8 6.5 12.5 7.2 12.5 8s-.7 1.5-2 2.5" />
            <path d="M12 3.5C14 5 15 6.4 15 8s-1 3-3 4.5" />
          </svg>
        </button>
      )}

      {/* Replay overlay — after video has ended */}
      {state === "ended" && (
        <button type="button" className={styles.replay} onClick={replay} aria-label="Watch again">
          <div className={styles.replayInner}>
            <span className={styles.replayIcon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
                <polygon points="6 4 20 12 6 20 6 4" fill="currentColor" />
              </svg>
            </span>
            <span className={styles.replayLabel}>Watch again</span>
          </div>
        </button>
      )}

      {/* Scroll cue — while playing */}
      {state === "playing" && (
        <div className={styles.scrollCue} aria-hidden>
          <span className={styles.scrollLine} />
          <span>Scroll to enter</span>
        </div>
      )}
    </section>
  );
}
