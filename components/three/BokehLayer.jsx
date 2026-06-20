"use client";

import { useEffect, useRef } from "react";

// Build a soft circular gradient sprite once and reuse it for every particle.
function makeSpriteTexture(THREE) {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,0.7)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

export default function BokehLayer() {
  const mountRef = useRef(null);

  useEffect(() => {
    let cleanup = () => {};
    let cancelled = false;

    // Dynamic import keeps three out of the initial JS bundle —
    // only loads when the Hero is actually rendered on the client.
    import("three").then((THREE) => {
      if (cancelled) return;
      const mount = mountRef.current;
      if (!mount) return;

      let W = mount.clientWidth || window.innerWidth;
      let H = mount.clientHeight || window.innerHeight;

      const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.setSize(W, H);
      renderer.domElement.style.cssText =
        "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;";
      mount.appendChild(renderer.domElement);

      const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 200);
      camera.position.z = 9;

      const scene = new THREE.Scene();
      const tex = makeSpriteTexture(THREE);

      // Pink + lavender + pearl bokeh palette
      const PALETTE = [
        new THREE.Color("#ffffff"),
        new THREE.Color("#fdf4ff"),
        new THREE.Color("#fbcfe8"),
        new THREE.Color("#f0abfc"),
        new THREE.Color("#c4b5fd"),
      ];

      // Layer 1: small fast drifters
      const N1 = 55;
      const p1 = new Float32Array(N1 * 3);
      const c1 = new Float32Array(N1 * 3);
      const s1 = new Float32Array(N1); // speeds
      for (let i = 0; i < N1; i++) {
        p1[i * 3]     = (Math.random() - 0.5) * 18;
        p1[i * 3 + 1] = (Math.random() - 0.5) * 11;
        p1[i * 3 + 2] = (Math.random() - 0.5) * 5;
        const col = PALETTE[i % PALETTE.length];
        c1[i * 3]     = col.r;
        c1[i * 3 + 1] = col.g;
        c1[i * 3 + 2] = col.b;
        s1[i] = Math.random() * 0.35 + 0.12;
      }
      const g1 = new THREE.BufferGeometry();
      g1.setAttribute("position", new THREE.BufferAttribute(p1, 3));
      g1.setAttribute("color", new THREE.BufferAttribute(c1, 3));
      const m1 = new THREE.PointsMaterial({
        size: 0.08,
        map: tex,
        vertexColors: true,
        transparent: true,
        opacity: 0.75,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      });
      const pts1 = new THREE.Points(g1, m1);
      scene.add(pts1);

      // Layer 2: large slow blobs
      const N2 = 18;
      const p2 = new Float32Array(N2 * 3);
      const c2 = new Float32Array(N2 * 3);
      const s2 = new Float32Array(N2);
      for (let i = 0; i < N2; i++) {
        p2[i * 3]     = (Math.random() - 0.5) * 16;
        p2[i * 3 + 1] = (Math.random() - 0.5) * 10;
        p2[i * 3 + 2] = (Math.random() - 0.5) * 3 - 3;
        const col = PALETTE[i % PALETTE.length];
        c2[i * 3]     = col.r;
        c2[i * 3 + 1] = col.g;
        c2[i * 3 + 2] = col.b;
        s2[i] = Math.random() * 0.14 + 0.04;
      }
      const g2 = new THREE.BufferGeometry();
      g2.setAttribute("position", new THREE.BufferAttribute(p2, 3));
      g2.setAttribute("color", new THREE.BufferAttribute(c2, 3));
      const m2 = new THREE.PointsMaterial({
        size: 0.6,
        map: tex,
        vertexColors: true,
        transparent: true,
        opacity: 0.18,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      });
      const pts2 = new THREE.Points(g2, m2);
      scene.add(pts2);

      // Mouse parallax
      const mouse = { x: 0, y: 0 };
      const cam = { x: 0, y: 0 };
      function onMove(e) {
        const r = mount.getBoundingClientRect();
        mouse.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
        mouse.y = -((e.clientY - r.top) / r.height - 0.5) * 2;
      }
      mount.parentElement?.addEventListener("mousemove", onMove);

      // Pause RAF when this layer is offscreen (huge CPU/GPU saver)
      let running = true;
      const io = new IntersectionObserver(
        ([entry]) => {
          running = entry.isIntersecting;
        },
        { threshold: 0.05 }
      );
      io.observe(mount);

      let raf;
      let last = performance.now();
      function tick(now) {
        raf = requestAnimationFrame(tick);
        if (!running) return;
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        const t = now * 0.001;

        cam.x += (mouse.x * 0.5 - cam.x) * 0.05;
        cam.y += (mouse.y * 0.3 - cam.y) * 0.05;
        camera.position.x = cam.x;
        camera.position.y = cam.y;

        // Drift layer 1
        for (let i = 0; i < N1; i++) {
          p1[i * 3 + 1] += s1[i] * dt * 0.75;
          p1[i * 3]     += Math.sin(t * s1[i] * 0.7 + i) * dt * 0.12;
          if (p1[i * 3 + 1] > 6) p1[i * 3 + 1] = -6;
        }
        g1.attributes.position.needsUpdate = true;

        // Drift layer 2
        for (let i = 0; i < N2; i++) {
          p2[i * 3 + 1] += s2[i] * dt * 0.55;
          p2[i * 3]     += Math.sin(t * s2[i] * 0.5 + i) * dt * 0.09;
          if (p2[i * 3 + 1] > 6) p2[i * 3 + 1] = -6;
        }
        g2.attributes.position.needsUpdate = true;

        renderer.render(scene, camera);
      }
      raf = requestAnimationFrame(tick);

      const ro = new ResizeObserver(() => {
        W = mount.clientWidth || window.innerWidth;
        H = mount.clientHeight || window.innerHeight;
        camera.aspect = W / H;
        camera.updateProjectionMatrix();
        renderer.setSize(W, H);
      });
      ro.observe(mount);

      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        ro.disconnect();
        mount.parentElement?.removeEventListener("mousemove", onMove);
        g1.dispose();
        g2.dispose();
        m1.dispose();
        m2.dispose();
        tex.dispose();
        renderer.dispose();
        if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      };
    });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
