import { useState, useEffect, useRef } from "react";

// ── Utility ──────────────────────────────────────────────────────────────────
const useScrollY = () => {
  const [y, setY] = useState(0);
  useEffect(() => {
    const h = () => setY(window.scrollY);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  return y;
};

const useInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
};

// ── CSS ───────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink: #0f1117;
    --ink2: #1c2030;
    --cream: #f7f5f0;
    --accent: #007aff;
    --accent2: #5874ff;
    --teal: #0127e5;
    --gold: #7787d4;
    --glass: rgba(255,255,255,0.06);
    --glass-border: rgba(255,255,255,0.12);
    --radius: 18px;
    --font-display: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: var(--font-body);
    background: var(--ink);
    color: var(--cream);
    cursor: none;
    overflow-x: hidden;
  }

  /* Custom cursor */
  #cursor-dot {
    position: fixed; top: 0; left: 0; z-index: 9999;
    width: 10px; height: 10px; border-radius: 50%;
    background: var(--accent);
    pointer-events: none;
    transform: translate(-50%,-50%);
    transition: transform 0.08s ease, width 0.2s, height 0.2s, background 0.2s;
    mix-blend-mode: exclusion;
  }
  #cursor-ring {
    position: fixed; top: 0; left: 0; z-index: 9998;
    width: 36px; height: 36px; border-radius: 50%;
    border: 1.5px solid rgba(0, 122, 255, 0.5);
    pointer-events: none;
    transform: translate(-50%,-50%);
    transition: transform 0.18s ease, width 0.25s, height 0.25s, border-color 0.2s;
  }
  body.hovering #cursor-dot { width: 18px; height: 18px; }
  body.hovering #cursor-ring { width: 56px; height: 56px; border-color: var(--accent); }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--ink); }
  ::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 2px; }

  /* Nav */
  nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 48px;
    height: 72px;
    backdrop-filter: blur(20px) saturate(180%);
    background: rgba(15,17,23,0.65);
    border-bottom: 1px solid var(--glass-border);
    transition: background 0.3s;
  }
  nav.scrolled { background: rgba(15,17,23,0.92); }
  .nav-logo {
    font-family: var(--font-display);
    font-size: 1.5rem; font-weight: 800;
    background: linear-gradient(135deg, var(--cream) 0%, var(--accent2) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    letter-spacing: -0.02em;
  }
  .nav-links { display: flex; gap: 36px; list-style: none; }
  .nav-links a {
    font-size: 0.875rem; font-weight: 500; color: rgba(247,245,240,0.7);
    text-decoration: none; letter-spacing: 0.02em;
    position: relative; transition: color 0.2s;
  }
  .nav-links a::after {
    content: ''; position: absolute; bottom: -3px; left: 0; right: 0; height: 1px;
    background: var(--accent); transform: scaleX(0); transition: transform 0.25s;
  }
  .nav-links a:hover { color: var(--cream); }
  .nav-links a:hover::after { transform: scaleX(1); }
  .nav-cta {
    background: var(--accent); color: #fff;
    padding: 9px 22px; border-radius: 999px;
    font-size: 0.875rem; font-weight: 600; border: none;
    cursor: none; transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 0 0 0 rgba(0, 122, 255, 0);
  }
  .nav-cta:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 122, 255, 0.4);
  }

  /* Hero */
  .hero {
    min-height: 100vh;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    position: relative; overflow: hidden;
    padding: 100px 24px 60px;
    text-align: center;
  }
  .hero-blob {
    position: absolute; border-radius: 50%;
    filter: blur(80px); opacity: 0.25; pointer-events: none;
  }
  .blob1 { width: 500px; height: 500px; background: var(--accent); top: -100px; left: -100px; animation: blobFloat 8s ease-in-out infinite; }
  .blob2 { width: 400px; height: 400px; background: var(--teal); bottom: -80px; right: -80px; animation: blobFloat 10s ease-in-out infinite reverse; }
  .blob3 { width: 300px; height: 300px; background: var(--gold); top: 40%; left: 50%; transform: translate(-50%,-50%); animation: blobFloat 6s ease-in-out infinite 2s; }
  @keyframes blobFloat { 0%,100% { transform: translate(0,0) scale(1); } 33% { transform: translate(20px,-20px) scale(1.05); } 66% { transform: translate(-15px,15px) scale(0.95); } }

  .hero-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--glass); border: 1px solid var(--glass-border);
    backdrop-filter: blur(10px);
    padding: 6px 16px; border-radius: 999px;
    font-size: 0.8rem; font-weight: 500; color: var(--accent2);
    margin-bottom: 28px;
    animation: fadeUp 0.8s ease both;
  }
  .hero-badge span { width: 6px; height: 6px; border-radius: 50%; background: var(--accent2); animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.8); } }

  .hero h1 {
    font-family: var(--font-display);
    font-size: clamp(3rem, 8vw, 7rem);
    font-weight: 800; line-height: 0.95;
    letter-spacing: -0.03em;
    animation: fadeUp 0.9s ease 0.1s both;
    position: relative;
  }
  .hero h1 .outline {
    -webkit-text-stroke: 2px rgba(247,245,240,0.3);
    -webkit-text-fill-color: transparent;
  }
  .hero h1 .grad {
    background: linear-gradient(135deg, var(--accent) 0%, var(--accent2) 50%, var(--gold) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .hero-sub {
    max-width: 560px; margin: 24px auto 0;
    font-size: 1.1rem; line-height: 1.7; color: rgba(247,245,240,0.6);
    animation: fadeUp 1s ease 0.2s both;
  }
  .hero-actions {
    display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;
    margin-top: 40px;
    animation: fadeUp 1s ease 0.3s both;
  }
  .btn-primary {
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    color: #fff; border: none; padding: 14px 32px; border-radius: 999px;
    font-family: var(--font-body); font-size: 0.95rem; font-weight: 600;
    cursor: none; transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 20px rgba(0, 122, 255, 0.3);
  }
  .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0, 122, 255, 0.45); }
  .btn-outline {
    background: transparent; color: var(--cream);
    border: 1px solid var(--glass-border); padding: 14px 32px; border-radius: 999px;
    font-family: var(--font-body); font-size: 0.95rem; font-weight: 600;
    cursor: none; backdrop-filter: blur(10px);
    transition: background 0.2s, border-color 0.2s, transform 0.2s;
  }
  .btn-outline:hover { background: var(--glass); border-color: rgba(255,255,255,0.3); transform: translateY(-3px); }

  /* Printer animation */
  .printer-wrap {
    margin-top: 64px; position: relative;
    animation: fadeUp 1s ease 0.5s both;
    width: 280px; height: 200px; margin-left: auto; margin-right: auto;
  }
  .printer-body {
    width: 280px; height: 140px;
    background: linear-gradient(160deg, #2a2d3e, #1c1f2e);
    border-radius: 16px;
    border: 1px solid rgba(255,255,255,0.08);
    box-shadow: 0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04);
    position: relative; overflow: visible;
    display: flex; align-items: center; justify-content: center;
  }
  .printer-slot {
    position: absolute; bottom: -2px; left: 50%; transform: translateX(-50%);
    width: 160px; height: 8px;
    background: #0f1117;
    border-radius: 0 0 4px 4px;
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.8);
  }
  .printer-paper {
    position: absolute; bottom: -60px; left: 50%; transform: translateX(-50%);
    width: 150px; height: 80px;
    background: linear-gradient(180deg, #fff 0%, #f0ede6 100%);
    border-radius: 0 0 4px 4px;
    animation: paperOut 2.5s ease-in-out infinite 1s;
    transform-origin: top center;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  }
  .paper-lines {
    padding: 12px; display: flex; flex-direction: column; gap: 8px;
  }
  .paper-line { height: 6px; border-radius: 3px; background: rgba(0,0,0,0.1); }
  .paper-line:nth-child(1) { width: 80%; }
  .paper-line:nth-child(2) { width: 60%; }
  .paper-line:nth-child(3) { width: 90%; }
  .paper-line-accent { background: rgba(0, 122, 255, 0.3) !important; }
  @keyframes paperOut {
    0% { height: 0; opacity: 0; }
    20% { opacity: 1; }
    70% { height: 80px; }
    85% { height: 80px; opacity: 1; }
    100% { height: 0; opacity: 0; }
  }
  .printer-light {
    position: absolute; top: 20px; right: 20px;
    width: 10px; height: 10px; border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 0 10px var(--accent);
    animation: blink 2s infinite;
  }
  @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.2; } }
  .printer-screen {
    width: 100px; height: 40px;
    background: linear-gradient(135deg, #0d1117, #111827);
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.1);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.6rem; color: var(--accent); font-family: monospace;
    letter-spacing: 0.1em;
  }

  /* Stats bar */
  .stats-bar {
    display: flex; justify-content: center; gap: 0; flex-wrap: wrap;
    border-top: 1px solid var(--glass-border);
    border-bottom: 1px solid var(--glass-border);
    background: var(--glass);
    backdrop-filter: blur(10px);
  }
  .stat-item {
    flex: 1; min-width: 160px;
    padding: 28px 24px; text-align: center;
    border-right: 1px solid var(--glass-border);
  }
  .stat-item:last-child { border-right: none; }
  .stat-num {
    font-family: var(--font-display);
    font-size: 2.5rem; font-weight: 800;
    background: linear-gradient(135deg, var(--cream), var(--accent2));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    line-height: 1;
  }
  .stat-label { font-size: 0.8rem; color: rgba(247,245,240,0.5); margin-top: 6px; text-transform: uppercase; letter-spacing: 0.1em; }

  /* Section basics */
  section { padding: 100px 48px; max-width: 1200px; margin: 0 auto; }
  .section-tag {
    display: inline-block;
    font-size: 0.75rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase;
    color: var(--accent2);
    background: rgba(88, 116, 255, 0.1); border: 1px solid rgba(88, 116, 255, 0.2);
    padding: 4px 14px; border-radius: 999px; margin-bottom: 16px;
  }
  .section-h {
    font-family: var(--font-display);
    font-size: clamp(2rem, 4vw, 3.5rem);
    font-weight: 800; line-height: 1.05; letter-spacing: -0.025em;
  }
  .section-sub { color: rgba(247,245,240,0.55); font-size: 1rem; line-height: 1.7; max-width: 500px; margin-top: 12px; }

  /* Fade up animation */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .reveal { opacity: 0; transform: translateY(40px); transition: opacity 0.7s ease, transform 0.7s ease; }
  .reveal.visible { opacity: 1; transform: translateY(0); }
  .reveal-delay-1 { transition-delay: 0.1s; }
  .reveal-delay-2 { transition-delay: 0.2s; }
  .reveal-delay-3 { transition-delay: 0.3s; }
  .reveal-delay-4 { transition-delay: 0.4s; }

  /* Services */
  .services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; margin-top: 56px; }
  .service-card {
    background: linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01));
    border: 1px solid var(--glass-border);
    border-radius: var(--radius);
    padding: 32px;
    transition: transform 0.35s cubic-bezier(.34,1.56,.64,1), border-color 0.3s, box-shadow 0.3s;
    cursor: none; position: relative; overflow: hidden;
  }
  .service-card::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(circle at 50% 0%, rgba(0, 122, 255, 0.08), transparent 70%);
    opacity: 0; transition: opacity 0.3s;
  }
  .service-card:hover { transform: translateY(-8px); border-color: rgba(0, 122, 255, 0.3); box-shadow: 0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(0, 122, 255, 0.1); }
  .service-card:hover::before { opacity: 1; }
  .service-icon {
    width: 52px; height: 52px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.5rem; margin-bottom: 20px;
    background: linear-gradient(135deg, rgba(0, 122, 255, 0.15), rgba(88, 116, 255, 0.08));
    border: 1px solid rgba(0, 122, 255, 0.2);
  }
  .service-card h3 { font-family: var(--font-display); font-size: 1.15rem; font-weight: 700; margin-bottom: 8px; }
  .service-card p { font-size: 0.875rem; color: rgba(247,245,240,0.5); line-height: 1.65; }
  .service-tag { display: inline-block; margin-top: 16px; font-size: 0.72rem; font-weight: 600; color: var(--accent2); background: rgba(88, 116, 255, 0.1); padding: 3px 10px; border-radius: 999px; }

  /* Categories */
  .cat-section { background: linear-gradient(180deg, var(--ink) 0%, var(--ink2) 50%, var(--ink) 100%); }
  .cat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-top: 52px; }
  .cat-card {
    border-radius: var(--radius); padding: 28px 20px; text-align: center;
    cursor: none; position: relative; overflow: hidden;
    border: 1px solid var(--glass-border);
    transition: transform 0.3s, box-shadow 0.3s;
    background: var(--glass); backdrop-filter: blur(10px);
  }
  .cat-card:hover { transform: scale(1.04); box-shadow: 0 20px 50px rgba(0,0,0,0.3); }
  .cat-emoji { font-size: 2.5rem; display: block; margin-bottom: 14px; }
  .cat-card h4 { font-family: var(--font-display); font-size: 1rem; font-weight: 700; }
  .cat-card p { font-size: 0.78rem; color: rgba(247,245,240,0.45); margin-top: 4px; }

  /* Upload section */
  .upload-section {
    background: var(--ink2); border-radius: 28px;
    border: 1px solid var(--glass-border);
    padding: 64px 56px;
    display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center;
    position: relative; overflow: hidden;
    margin: 0 48px;
  }
  .upload-section::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse at 80% 50%, rgba(0, 122, 255, 0.06), transparent 60%);
    pointer-events: none;
  }
  .upload-drop {
    border: 2px dashed rgba(0, 122, 255, 0.3);
    border-radius: 16px; padding: 48px 32px;
    text-align: center;
    background: rgba(0, 122, 255, 0.03);
    transition: border-color 0.3s, background 0.3s;
    cursor: none;
  }
  .upload-drop:hover { border-color: var(--accent); background: rgba(0, 122, 255, 0.06); }
  .upload-drop .upload-icon { font-size: 2.5rem; margin-bottom: 16px; }
  .upload-drop h3 { font-family: var(--font-display); font-size: 1.2rem; font-weight: 700; }
  .upload-drop p { font-size: 0.85rem; color: rgba(247,245,240,0.45); margin-top: 8px; }
  .progress-steps { display: flex; gap: 0; margin-top: 32px; }
  .step {
    flex: 1; display: flex; flex-direction: column; align-items: center; gap: 8px;
    position: relative;
  }
  .step::after {
    content: ''; position: absolute; top: 16px; left: 50%; width: 100%; height: 2px;
    background: var(--glass-border);
  }
  .step:last-child::after { display: none; }
  .step-dot {
    width: 32px; height: 32px; border-radius: 50%; z-index: 1;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.75rem; font-weight: 700;
  }
  .step-dot.active { background: var(--accent); box-shadow: 0 0 16px rgba(0, 122, 255, 0.4); color: #fff; }
  .step-dot.done { background: var(--accent2); color: #fff; }
  .step-dot.pending { background: var(--glass); border: 1px solid var(--glass-border); color: rgba(247,245,240,0.4); }
  .step-label { font-size: 0.7rem; color: rgba(247,245,240,0.5); text-align: center; }

  /* Why us */
  .why-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; margin-top: 56px; }
  .why-points { display: flex; flex-direction: column; gap: 24px; }
  .why-point { display: flex; gap: 16px; align-items: flex-start; }
  .why-dot {
    width: 40px; height: 40px; flex-shrink: 0;
    border-radius: 12px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem;
    box-shadow: 0 4px 16px rgba(0, 122, 255, 0.3);
  }
  .why-point h4 { font-family: var(--font-display); font-size: 1rem; font-weight: 700; margin-bottom: 4px; }
  .why-point p { font-size: 0.85rem; color: rgba(247,245,240,0.5); line-height: 1.6; }
  .quality-card {
    background: var(--ink2); border: 1px solid var(--glass-border);
    border-radius: 24px; padding: 40px;
    display: flex; flex-direction: column; gap: 20px;
  }
  .quality-bar-wrap { display: flex; flex-direction: column; gap: 12px; }
  .q-label { display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 6px; }
  .q-label span:last-child { color: var(--accent2); font-weight: 600; }
  .q-bar { height: 6px; border-radius: 3px; background: var(--glass); overflow: hidden; }
  .q-fill { height: 100%; border-radius: 3px; background: linear-gradient(90deg, var(--accent), var(--accent2)); transition: width 1.5s cubic-bezier(.16,1,.3,1); }

  /* Testimonials */
  .testi-carousel { margin-top: 56px; position: relative; overflow: hidden; }
  .testi-track {
    display: flex; gap: 24px;
    transition: transform 0.5s cubic-bezier(.25,.46,.45,.94);
  }
  .testi-card {
    min-width: 360px; flex-shrink: 0;
    background: var(--ink2); border: 1px solid var(--glass-border);
    border-radius: var(--radius); padding: 32px;
  }
  .testi-stars { color: var(--gold); font-size: 0.9rem; margin-bottom: 16px; }
  .testi-text { font-size: 0.95rem; line-height: 1.7; color: rgba(247,245,240,0.75); font-style: italic; }
  .testi-author { display: flex; align-items: center; gap: 12px; margin-top: 24px; }
  .testi-avatar {
    width: 40px; height: 40px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem; font-weight: 700;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    color: #fff;
  }
  .testi-name { font-weight: 600; font-size: 0.9rem; }
  .testi-role { font-size: 0.75rem; color: rgba(247,245,240,0.45); }
  .carousel-btns { display: flex; gap: 12px; margin-top: 32px; }
  .car-btn {
    width: 44px; height: 44px; border-radius: 50%; border: 1px solid var(--glass-border);
    background: var(--glass); color: var(--cream);
    font-size: 1rem; cursor: none;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.2s, border-color 0.2s;
  }
  .car-btn:hover { background: var(--accent); border-color: var(--accent); }

  /* Pricing */
  .pricing-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-top: 56px; }
  .price-card {
    background: var(--ink2); border: 1px solid var(--glass-border);
    border-radius: 24px; padding: 36px; position: relative; overflow: hidden;
    transition: transform 0.3s, box-shadow 0.3s;
    cursor: none;
  }
  .price-card:hover { transform: translateY(-6px); box-shadow: 0 24px 60px rgba(0,0,0,0.3); }
  .price-card.featured {
    background: linear-gradient(145deg, #1e1520, #1a1025);
    border-color: rgba(0, 122, 255, 0.4);
    box-shadow: 0 0 0 1px rgba(0, 122, 255, 0.1), 0 20px 60px rgba(0, 122, 255, 0.1);
  }
  .price-badge {
    position: absolute; top: 20px; right: 20px;
    background: var(--accent); color: #fff;
    font-size: 0.7rem; font-weight: 700; padding: 4px 12px; border-radius: 999px;
    letter-spacing: 0.05em;
  }
  .price-plan { font-size: 0.78rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: var(--accent2); }
  .price-amount {
    font-family: var(--font-display); font-size: 3rem; font-weight: 800;
    line-height: 1; margin: 12px 0;
  }
  .price-amount sup { font-size: 1.2rem; font-weight: 600; vertical-align: super; }
  .price-desc { font-size: 0.82rem; color: rgba(247,245,240,0.45); margin-bottom: 28px; }
  .price-features { list-style: none; display: flex; flex-direction: column; gap: 12px; }
  .price-features li { display: flex; align-items: center; gap: 10px; font-size: 0.875rem; color: rgba(247,245,240,0.75); }
  .price-features li::before { content: '✓'; color: var(--teal); font-weight: 700; flex-shrink: 0; }
  .price-btn { width: 100%; margin-top: 28px; padding: 13px; border-radius: 999px; font-weight: 600; font-size: 0.9rem; cursor: none; transition: transform 0.2s, box-shadow 0.2s; border: none; }
  .price-btn.outline { background: transparent; border: 1px solid var(--glass-border); color: var(--cream); }
  .price-btn.filled { background: linear-gradient(135deg, var(--accent), var(--accent2)); color: #fff; box-shadow: 0 4px 20px rgba(0, 122, 255, 0.3); }
  .price-btn:hover { transform: translateY(-2px); }
  .price-btn.filled:hover { box-shadow: 0 8px 28px rgba(0, 122, 255, 0.45); }

  /* CTA banner */
  .cta-wrap { padding: 0 48px; margin-bottom: 0; }
  .cta-banner {
    background: linear-gradient(135deg, var(--accent) 0%, #0056b3 50%, #003d80 100%);
    border-radius: 28px; padding: 64px 56px;
    display: flex; align-items: center; justify-content: space-between; gap: 32px;
    position: relative; overflow: hidden;
  }
  .cta-banner::before {
    content: ''; position: absolute; inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }
  .cta-banner h2 {
    font-family: var(--font-display); font-size: clamp(1.8rem, 3vw, 2.8rem);
    font-weight: 800; line-height: 1.1; letter-spacing: -0.02em;
    position: relative;
  }
  .cta-banner p { color: rgba(255,255,255,0.75); margin-top: 10px; font-size: 1rem; position: relative; }
  .cta-actions { display: flex; gap: 12px; flex-shrink: 0; }
  .btn-white { background: #fff; color: var(--accent); border: none; padding: 14px 28px; border-radius: 999px; font-weight: 700; font-size: 0.9rem; cursor: none; transition: transform 0.2s; }
  .btn-white:hover { transform: translateY(-3px); }
  .btn-ghost { background: rgba(255,255,255,0.15); color: #fff; border: 1px solid rgba(255,255,255,0.3); padding: 14px 28px; border-radius: 999px; font-weight: 600; font-size: 0.9rem; cursor: none; backdrop-filter: blur(10px); transition: background 0.2s; }
  .btn-ghost:hover { background: rgba(255,255,255,0.25); }

  /* Footer */
  footer {
    background: #090b10;
    border-top: 1px solid rgba(255,255,255,0.06);
    padding: 72px 48px 40px;
  }
  .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 48px; }
  .footer-brand p { font-size: 0.875rem; color: rgba(247,245,240,0.45); margin-top: 14px; line-height: 1.7; max-width: 280px; }
  .footer-socials { display: flex; gap: 10px; margin-top: 24px; }
  .social-btn {
    width: 36px; height: 36px; border-radius: 10px;
    border: 1px solid var(--glass-border); background: var(--glass);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.85rem; cursor: none;
    transition: background 0.2s, border-color 0.2s;
  }
  .social-btn:hover { background: var(--accent); border-color: var(--accent); }
  .footer-col h5 {
    font-family: var(--font-display); font-size: 0.85rem;
    font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;
    color: rgba(247,245,240,0.4); margin-bottom: 20px;
  }
  .footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 10px; }
  .footer-col a { color: rgba(247,245,240,0.65); font-size: 0.875rem; text-decoration: none; transition: color 0.2s; }
  .footer-col a:hover { color: var(--cream); }
  .footer-bottom {
    margin-top: 56px; padding-top: 24px;
    border-top: 1px solid rgba(255,255,255,0.06);
    display: flex; justify-content: space-between; align-items: center;
  }
  .footer-bottom p { font-size: 0.8rem; color: rgba(247,245,240,0.3); }

  /* Compare slider */
  .compare-wrap {
    position: relative; border-radius: var(--radius); overflow: hidden;
    height: 300px; user-select: none;
    border: 1px solid var(--glass-border);
    background: #1a1c25;
    display: flex; align-items: center; justify-content: center;
  }
  .compare-before, .compare-after {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 4rem;
  }
  .compare-before { background: linear-gradient(135deg, #2a2030, #1a1525); }
  .compare-after { background: linear-gradient(135deg, #0a1a18, #0d1f1c); clip-path: inset(0 50% 0 0); transition: clip-path 0s; }
  .compare-handle {
    position: absolute; top: 0; bottom: 0; width: 3px;
    background: #fff; left: 50%; transform: translateX(-50%);
    cursor: ew-resize; z-index: 10;
    display: flex; align-items: center; justify-content: center;
  }
  .compare-handle::after {
    content: '⬌'; position: absolute;
    width: 36px; height: 36px; border-radius: 50%;
    background: #fff; color: #000; font-size: 0.9rem;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 16px rgba(0,0,0,0.4);
  }
  .compare-label {
    position: absolute; top: 16px;
    font-size: 0.75rem; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.1em; padding: 4px 12px; border-radius: 999px;
    background: rgba(0,0,0,0.5); backdrop-filter: blur(10px);
  }
  .compare-label.left { left: 16px; }
  .compare-label.right { right: 16px; }

  /* Floating button */
  .float-btn {
    position: fixed; bottom: 32px; right: 32px; z-index: 200;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    color: #fff; border: none; border-radius: 999px;
    padding: 14px 24px; font-weight: 700; font-size: 0.9rem;
    cursor: none; box-shadow: 0 8px 30px rgba(0, 122, 255, 0.5);
    display: flex; align-items: center; gap: 8px;
    transition: transform 0.2s, box-shadow 0.2s;
    animation: floatPulse 3s ease-in-out infinite;
  }
  @keyframes floatPulse { 0%,100% { box-shadow: 0 8px 30px rgba(0, 122, 255, 0.5); } 50% { box-shadow: 0 8px 40px rgba(0, 122, 255, 0.7), 0 0 60px rgba(0, 122, 255, 0.15); } }
  .float-btn:hover { transform: translateY(-4px) scale(1.05); }

  /* Dark mode toggle */
  .mode-toggle {
    background: var(--glass); border: 1px solid var(--glass-border);
    border-radius: 999px; padding: 8px 14px;
    cursor: none; color: var(--cream); font-size: 0.85rem;
    display: flex; align-items: center; gap: 6px;
    transition: background 0.2s;
  }
  .mode-toggle:hover { background: rgba(255,255,255,0.1); }

  /* AI block */
  .ai-block {
    background: linear-gradient(135deg, rgba(88, 116, 255, 0.08), rgba(88, 116, 255, 0.02));
    border: 1px solid rgba(88, 116, 255, 0.2);
    border-radius: 20px; padding: 32px;
    display: flex; flex-direction: column; gap: 12px;
  }
  .ai-chip { display: inline-flex; align-items: center; gap: 6px; font-size: 0.75rem; color: var(--accent2); font-weight: 600; letter-spacing: 0.08em; }
  .ai-suggestions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
  .ai-sug {
    background: rgba(0, 122, 255, 0.1); border: 1px solid rgba(0, 122, 255, 0.2);
    border-radius: 999px; padding: 6px 14px; font-size: 0.8rem; cursor: none;
    transition: background 0.2s; color: rgba(247,245,240,0.8);
  }
  .ai-sug:hover { background: rgba(0, 122, 255, 0.2); }

  @media (max-width: 768px) {
    nav { padding: 0 20px; }
    .nav-links { display: none; }
    section { padding: 60px 20px; }
    .upload-section { grid-template-columns: 1fr; margin: 0 20px; padding: 40px 24px; }
    .why-grid { grid-template-columns: 1fr; }
    .footer-grid { grid-template-columns: 1fr 1fr; }
    .cta-wrap { padding: 0 20px; }
    .cta-banner { flex-direction: column; padding: 40px 28px; }
    .cta-actions { flex-direction: column; }
  }
`;

// ── Data ──────────────────────────────────────────────────────────────────────
const services = [
  { icon: "🖨️", title: "Digital Printing", desc: "Crystal-clear prints with vibrant CMYK color accuracy on premium substrates.", tag: "Most Popular" },
  { icon: "📋", title: "Offset Printing", desc: "Large-run commercial printing with consistent quality and cost efficiency.", tag: "Best Value" },
  { icon: "🎨", title: "Design Services", desc: "Professional graphic design by our in-house team for all your print needs.", tag: "Premium" },
  { icon: "🏷️", title: "Labels & Stickers", desc: "Custom die-cut labels with waterproof, UV, and foil finishes.", tag: "Custom" },
  { icon: "📦", title: "Packaging", desc: "Bespoke box printing with structural design expertise included.", tag: "Enterprise" },
  { icon: "🎁", title: "Promotional", desc: "Branded merchandise, brochures, and marketing collateral at scale.", tag: "Bulk Deals" },
];
const categories = [
  { emoji: "📄", name: "Business Cards", count: "50+ designs" },
  { emoji: "📰", name: "Brochures", count: "3-fold & Z-fold" },
  { emoji: "🗓️", name: "Calendars", count: "Wall & Desk" },
  { emoji: "🪧", name: "Banners", count: "Roll-up & Flex" },
  { emoji: "📒", name: "Notebooks", count: "Hardback & Soft" },
  { emoji: "🎟️", name: "Vouchers", count: "Numbered & Foil" },
];
const testimonials = [
  { stars: 5, text: "PrintA4 delivered 5000 brochures in under 48 hours — impeccable quality, colours were exactly as designed. Our most reliable print partner to date.", name: "Arjun Mehta", role: "Marketing Director, Zephyr Labs", init: "A" },
  { stars: 5, text: "The online ordering experience is seamless. Upload, proof, approve — done. Every batch of business cards looks premium and feels luxurious.", name: "Priya Nair", role: "Brand Strategist, Helio Agency", init: "P" },
  { stars: 5, text: "Switched from three different vendors to PrintA4. The consistency and turnaround time are unmatched. The packaging range is exceptional.", name: "Rohan Sharma", role: "COO, Vestige Retail", init: "R" },
  { stars: 5, text: "Our event banners and roll-ups were ready in 24 hours. The print team proactively flagged a bleed issue before printing — saved us major headaches.", name: "Kavya Reddy", role: "Events Head, NovaSpark", init: "K" },
];
const whyPoints = [
  { icon: "⚡", title: "24-Hour Turnaround", desc: "Express delivery available on all standard products. Rush orders shipped same day." },
  { icon: "🎯", title: "Colour Matched Accuracy", desc: "ICC-calibrated presses ensure your brand colours are reproduced with < 1ΔE variance." },
  { icon: "♻️", title: "Eco-Certified Stock", desc: "FSC-certified papers, soy-based inks, and carbon-offset delivery as standard." },
  { icon: "🔒", title: "Secure File Handling", desc: "256-bit encrypted uploads, NDA-backed print processes for sensitive documents." },
];
const pricing = [
  { plan: "Starter", price: "₹999", desc: "Perfect for freelancers & small runs", features: ["Up to 500 prints", "3 product categories", "Standard turnaround", "Email support", "PDF proofing"], btn: "outline" },
  { plan: "Professional", price: "₹2,499", desc: "For growing businesses & agencies", features: ["Up to 5,000 prints", "All product categories", "48-hr express option", "Dedicated account manager", "Premium paper upgrades", "Blind shipping"], btn: "filled", featured: true },
  { plan: "Enterprise", price: "Custom", desc: "High-volume & bespoke solutions", features: ["Unlimited print volume", "White-label service", "Same-day rush available", "On-site press checks", "API ordering integration", "SLA guarantee"], btn: "outline" },
];

// ── Cursor component ───────────────────────────────────────────────────────────
function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  useEffect(() => {
    const move = (e) => {
      const { clientX: x, clientY: y } = e;
      if (dot.current) { dot.current.style.left = x + "px"; dot.current.style.top = y + "px"; }
      if (ring.current) { ring.current.style.left = x + "px"; ring.current.style.top = y + "px"; }
    };
    const over = (e) => { if (e.target.closest("button,a,[data-hover]")) document.body.classList.add("hovering"); else document.body.classList.remove("hovering"); };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseover", over); };
  }, []);
  return (
    <>
      <div id="cursor-dot" ref={dot} />
      <div id="cursor-ring" ref={ring} />
    </>
  );
}

// ── Compare Slider ─────────────────────────────────────────────────────────────
function CompareSlider() {
  const [pos, setPos] = useState(50);
  const dragging = useRef(false);
  const wrapRef = useRef(null);
  const handleMove = (clientX) => {
    if (!dragging.current || !wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    const p = Math.max(5, Math.min(95, ((clientX - rect.left) / rect.width) * 100));
    setPos(p);
  };
  return (
    <div
      ref={wrapRef}
      className="compare-wrap"
      onMouseDown={() => { dragging.current = true; }}
      onMouseUp={() => { dragging.current = false; }}
      onMouseMove={(e) => handleMove(e.clientX)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
    >
      <div className="compare-before">
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "8px" }}>📄</div>
          <div style={{ fontSize: "0.75rem", color: "rgba(247,245,240,0.4)", fontFamily: "var(--font-display)" }}>LOW QUALITY PRINT</div>
          <div style={{ display: "flex", gap: "4px", marginTop: "12px", justifyContent: "center" }}>
            {[...Array(5)].map((_, i) => <div key={i} style={{ width: "40px", height: "5px", borderRadius: "3px", background: `rgba(247,245,240,${0.05 + i * 0.05})` }} />)}
          </div>
        </div>
      </div>
      <div className="compare-after" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "8px" }}>🖨️</div>
          <div style={{ fontSize: "0.75rem", color: "var(--teal)", fontFamily: "var(--font-display)", fontWeight: 700 }}>PRINTA4 BLUE</div>
          <div style={{ display: "flex", gap: "4px", marginTop: "12px", justifyContent: "center" }}>
            {[...Array(5)].map((_, i) => <div key={i} style={{ width: "40px", height: "5px", borderRadius: "3px", background: `rgba(1, 39, 229, ${0.3 + i * 0.14})` }} />)}
          </div>
        </div>
      </div>
      <div className="compare-handle" style={{ left: `${pos}%` }} />
      <span className="compare-label left">Before</span>
      <span className="compare-label right">PrintA4</span>
    </div>
  );
}

// ── Counter ────────────────────────────────────────────────────────────────────
function Counter({ target, suffix = "" }) {
  const [val, setVal] = useState(0);
  const [ref, inView] = useInView();
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const steps = 60;
    const inc = target / steps;
    const t = setInterval(() => {
      start += inc;
      if (start >= target) { setVal(target); clearInterval(t); }
      else setVal(Math.floor(start));
    }, 24);
    return () => clearInterval(t);
  }, [inView]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

// ── Quality Bars ───────────────────────────────────────────────────────────────
function QualityBars({ inView }) {
  const bars = [
    { label: "Print Resolution", val: "98%" },
    { label: "Colour Accuracy", val: "99%" },
    { label: "On-Time Delivery", val: "97%" },
    { label: "Customer Rating", val: "96%" },
  ];
  return (
    <div className="quality-bar-wrap">
      {bars.map((b, i) => (
        <div key={i}>
          <div className="q-label"><span>{b.label}</span><span>{b.val}</span></div>
          <div className="q-bar">
            <div className="q-fill" style={{ width: inView ? b.val : "0%", transitionDelay: `${i * 0.15}s` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────────
export default function PrintA4() {
  const scrollY = useScrollY();
  const [carIdx, setCarIdx] = useState(0);
  const [isDark, setIsDark] = useState(true);
  const [uploadStep, setUploadStep] = useState(1);
  const [whyRef, whyInView] = useInView();

  // Reveal observer
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const maxCar = testimonials.length - 1;

  return (
    <>
      <style>{CSS}</style>
      <Cursor />

      {/* Floating Order Button */}
      <button className="float-btn">🛒 Quick Order</button>

      {/* Nav */}
      <nav className={scrollY > 40 ? "scrolled" : ""}>
        <div className="nav-logo">PrintA4</div>
        <ul className="nav-links">
          {["Services", "Products", "Pricing", "About", "Contact"].map(l => (
            <li key={l}><a href="#">{l}</a></li>
          ))}
        </ul>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button className="mode-toggle" onClick={() => setIsDark(!isDark)}>
            {isDark ? "☀️" : "🌙"} {isDark ? "Light" : "Dark"}
          </button>
          <button className="nav-cta">Start Printing →</button>
        </div>
      </nav>

      {/* Hero */}
      <div className="hero">
        <div className="hero-blob blob1" />
        <div className="hero-blob blob2" />
        <div className="hero-blob blob3" />
        <div className="hero-badge"><span /> India's #1 Premium Print Studio</div>
        <h1>
          Print that <span className="outline">speaks</span><br />
          <span className="grad">volumes.</span>
        </h1>
        <p className="hero-sub">
          From 50 to 500,000 copies — delivered in 24 hours. Professional-grade printing with unmatched colour precision and zero compromise on quality.
        </p>
        <div className="hero-actions">
          <button className="btn-primary">Upload & Print →</button>
          <button className="btn-outline">Explore Services</button>
        </div>
        {/* Printer */}
        <div className="printer-wrap">
          <div className="printer-body">
            <div className="printer-light" />
            <div className="printer-screen">PRINTING…</div>
            <div className="printer-slot" />
          </div>
          <div className="printer-paper">
            <div className="paper-lines">
              <div className="paper-line paper-line-accent" />
              <div className="paper-line" />
              <div className="paper-line" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-bar">
        {[
          { num: 250000, suf: "+", label: "Prints Delivered" },
          { num: 12000, suf: "+", label: "Happy Clients" },
          { num: 24, suf: "hr", label: "Turnaround Time" },
          { num: 99, suf: "%", label: "Satisfaction Rate" },
        ].map((s, i) => (
          <div className="stat-item" key={i}>
            <div className="stat-num"><Counter target={s.num} suffix={s.suf} /></div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Services */}
      <section>
        <div className="reveal">
          <div className="section-tag">Our Expertise</div>
          <h2 className="section-h">Every print need,<br />one studio.</h2>
          <p className="section-sub">From quick digital runs to large-scale offset campaigns — we handle it all with precision.</p>
        </div>
        <div className="services-grid">
          {services.map((s, i) => (
            <div key={i} className={`service-card reveal reveal-delay-${(i % 4) + 1}`}>
              <div className="service-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <span className="service-tag">{s.tag}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <div className="cat-section">
        <section>
          <div className="reveal">
            <div className="section-tag">Product Range</div>
            <h2 className="section-h">Browse by category.</h2>
          </div>
          <div className="cat-grid">
            {categories.map((c, i) => (
              <div key={i} className={`cat-card reveal reveal-delay-${(i % 4) + 1}`}>
                <span className="cat-emoji">{c.emoji}</span>
                <h4>{c.name}</h4>
                <p>{c.count}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Upload Section */}
      <section style={{ padding: "100px 0" }}>
        <div className="upload-section">
          <div>
            <div className="section-tag">Custom Print</div>
            <h2 className="section-h" style={{ fontSize: "2.2rem" }}>Upload your design.<br />We handle the rest.</h2>
            <p className="section-sub" style={{ marginTop: "16px" }}>PDF, AI, PSD, EPS — we accept all major design formats. Our pre-press team checks every file before going to press.</p>
            {/* AI suggestions */}
            <div className="ai-block" style={{ marginTop: "28px" }}>
              <div className="ai-chip">✦ AI Design Assistant</div>
              <p style={{ fontSize: "0.85rem", color: "rgba(247,245,240,0.55)" }}>Not sure what you need? Our AI can suggest templates based on your industry:</p>
              <div className="ai-suggestions">
                {["Restaurant Menu", "Real Estate Flyer", "Startup Brochure", "Wedding Invite", "Tech Pitch Deck"].map((s, i) => (
                  <span key={i} className="ai-sug">{s}</span>
                ))}
              </div>
            </div>
            {/* Progress steps */}
            <div className="progress-steps" style={{ marginTop: "32px" }}>
              {[{ n: "01", l: "Upload" }, { n: "02", l: "Review" }, { n: "03", l: "Print" }].map((s, i) => (
                <div key={i} className="step" onClick={() => setUploadStep(i + 1)}>
                  <div className={`step-dot ${uploadStep === i + 1 ? "active" : uploadStep > i + 1 ? "done" : "pending"}`}>
                    {uploadStep > i + 1 ? "✓" : s.n}
                  </div>
                  <span className="step-label">{s.l}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="upload-drop">
            <div className="upload-icon">📤</div>
            <h3>Drop your file here</h3>
            <p>or click to browse<br /><span style={{ color: "var(--accent2)" }}>PDF, AI, PSD, EPS, PNG up to 500MB</span></p>
            <button className="btn-primary" style={{ marginTop: "24px", width: "100%" }}>Browse Files</button>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section ref={whyRef}>
        <div className="reveal">
          <div className="section-tag">Why PrintA4</div>
          <h2 className="section-h">Built for professionals<br />who demand more.</h2>
        </div>
        <div className="why-grid">
          <div className="why-points reveal">
            {whyPoints.map((w, i) => (
              <div key={i} className="why-point">
                <div className="why-dot">{w.icon}</div>
                <div>
                  <h4>{w.title}</h4>
                  <p>{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="quality-card reveal reveal-delay-2">
            <div>
              <div className="section-tag">Quality Metrics</div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: 700, marginTop: "8px" }}>Our benchmark numbers</h3>
            </div>
            <QualityBars inView={whyInView} />
            <CompareSlider />
            <p style={{ fontSize: "0.75rem", color: "rgba(247,245,240,0.35)", textAlign: "center" }}>Drag slider to compare print quality</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <div style={{ background: "var(--ink2)", padding: "80px 0" }}>
        <section style={{ padding: "0 48px" }}>
          <div className="reveal" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px" }}>
            <div>
              <div className="section-tag">Client Stories</div>
              <h2 className="section-h">Trusted by brands<br />that matter.</h2>
            </div>
            <div className="carousel-btns">
              <button className="car-btn" onClick={() => setCarIdx(i => Math.max(0, i - 1))}>←</button>
              <button className="car-btn" onClick={() => setCarIdx(i => Math.min(maxCar, i + 1))}>→</button>
            </div>
          </div>
          <div className="testi-carousel" style={{ marginTop: "40px" }}>
            <div className="testi-track" style={{ transform: `translateX(calc(-${carIdx}*384px))` }}>
              {testimonials.map((t, i) => (
                <div key={i} className="testi-card">
                  <div className="testi-stars">{"★".repeat(t.stars)}</div>
                  <p className="testi-text">"{t.text}"</p>
                  <div className="testi-author">
                    <div className="testi-avatar">{t.init}</div>
                    <div>
                      <div className="testi-name">{t.name}</div>
                      <div className="testi-role">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Pricing */}
      <section>
        <div className="reveal" style={{ textAlign: "center" }}>
          <div className="section-tag">Pricing</div>
          <h2 className="section-h">Simple, transparent<br />pricing.</h2>
          <p className="section-sub" style={{ margin: "12px auto 0" }}>No hidden fees. Volume discounts applied automatically at checkout.</p>
        </div>
        <div className="pricing-grid">
          {pricing.map((p, i) => (
            <div key={i} className={`price-card reveal reveal-delay-${i + 1} ${p.featured ? "featured" : ""}`}>
              {p.featured && <span className="price-badge">MOST POPULAR</span>}
              <div className="price-plan">{p.plan}</div>
              <div className="price-amount">
                {p.price !== "Custom" && <sup>₹</sup>}
                {p.price === "Custom" ? "Custom" : p.price.replace("₹", "")}
              </div>
              <div className="price-desc">{p.desc}</div>
              <ul className="price-features">
                {p.features.map((f, j) => <li key={j}>{f}</li>)}
              </ul>
              <button className={`price-btn ${p.btn}`}>
                {p.featured ? "Get Started →" : "Choose Plan"}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="cta-wrap" style={{ paddingBottom: "100px" }}>
        <div className="cta-banner reveal">
          <div>
            <h2>Ready to print something<br />extraordinary?</h2>
            <p>Join 12,000+ businesses printing with confidence. Upload your file and get a quote in seconds.</p>
          </div>
          <div className="cta-actions">
            <button className="btn-white">Upload & Print Now</button>
            <button className="btn-ghost">Request a Quote</button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer>
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="nav-logo">PrintA4</div>
            <p>India's most trusted premium print studio. Precision printing for businesses of every scale, delivered fast.</p>
            <div className="footer-socials">
              {["𝕏", "in", "f", "📸"].map((s, i) => <button key={i} className="social-btn">{s}</button>)}
            </div>
          </div>
          {[
            { title: "Services", links: ["Digital Printing", "Offset Printing", "Design Services", "Labels & Stickers", "Packaging"] },
            { title: "Products", links: ["Business Cards", "Brochures", "Banners", "Calendars", "Notebooks"] },
            { title: "Company", links: ["About Us", "Careers", "Blog", "Press Kit", "Contact"] },
          ].map((col, i) => (
            <div key={i} className="footer-col">
              <h5>{col.title}</h5>
              <ul>{col.links.map((l, j) => <li key={j}><a href="#">{l}</a></li>)}</ul>
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <p>© 2025 PrintA4. All rights reserved.</p>
          <p style={{ display: "flex", gap: "24px" }}>
            <a href="#" style={{ color: "rgba(247,245,240,0.3)", textDecoration: "none", fontSize: "0.8rem" }}>Privacy Policy</a>
            <a href="#" style={{ color: "rgba(247,245,240,0.3)", textDecoration: "none", fontSize: "0.8rem" }}>Terms of Service</a>
          </p>
        </div>
      </footer>
    </>
  );
}
