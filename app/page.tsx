"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// ── Galaxy background ─────────────────────────────────────────────────────────
function GalaxyCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    // Étoiles
    const stars = Array.from({ length: 220 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.4 + 0.2,
      speed: Math.random() * 0.15 + 0.03,
      opacity: Math.random() * 0.7 + 0.2,
      twinkle: Math.random() * Math.PI * 2,
    }));

    let frame = 0;
    let raf: number;

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, w, h);

      // Fond galaxy
      const grad = ctx.createRadialGradient(w * 0.5, h * 0.4, 0, w * 0.5, h * 0.4, Math.max(w, h) * 0.75);
      grad.addColorStop(0, "rgba(60,20,120,0.45)");
      grad.addColorStop(0.4, "rgba(20,10,60,0.35)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Nébuleuse secondaire
      const grad2 = ctx.createRadialGradient(w * 0.2, h * 0.6, 0, w * 0.2, h * 0.6, w * 0.5);
      grad2.addColorStop(0, "rgba(108,99,255,0.12)");
      grad2.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, w, h);

      // Étoiles
      frame++;
      stars.forEach((s) => {
        s.y -= s.speed;
        if (s.y < -2) { s.y = h + 2; s.x = Math.random() * w; }
        s.twinkle += 0.02;
        const alpha = s.opacity * (0.7 + 0.3 * Math.sin(s.twinkle));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    }

    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
    />
  );
}

// ── Scroll reveal hook ────────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("visible"); obs.unobserve(el); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`reveal ${className}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </div>
  );
}

// ── Nav ───────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 transition-all duration-300"
      style={{
        height: "60px",
        background: scrolled ? "rgba(9,9,11,0.9)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(39,39,42,0.5)" : "1px solid transparent",
      }}
    >
      <Link href="/" className="flex items-center gap-2.5">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
          style={{ background: "var(--foreground)", color: "var(--background)" }}
        >
          CP
        </div>
        <span className="font-semibold text-sm tracking-tight">CryptoPay</span>
      </Link>

      <div className="hidden md:flex items-center gap-8">
        {[["#features","Services"],["#process","Comment ça marche"],["#testimonials","Avis"]].map(([href, label]) => (
          <a key={href} href={href} className="text-sm transition-colors" style={{ color: "var(--muted)" }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--foreground)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}>
            {label}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="hidden md:block text-sm transition-colors" style={{ color: "var(--muted)" }}>
          Se connecter
        </Link>
        <Link
          href="/dashboard"
          className="text-xs font-semibold px-4 py-2 rounded-full transition-all hover:scale-105"
          style={{ background: "var(--foreground)", color: "var(--background)" }}
        >
          Commencer →
        </Link>
      </div>
    </nav>
  );
}

// ── Hero wallets ──────────────────────────────────────────────────────────────
const HERO_WALLETS = [
  { name: "MetaMask",     color: "#E2761B", icon: "🦊" },
  { name: "Phantom",      color: "#9945FF", icon: "👻" },
  { name: "Coinbase",     color: "#0052FF", icon: "🔵" },
  { name: "Binance",      color: "#F0B90B", icon: "🟡" },
  { name: "Kraken",       color: "#5741D9", icon: "🐙" },
  { name: "Trust Wallet", color: "#3375BB", icon: "🛡" },
  { name: "Ledger",       color: "#000000", icon: "⬛" },
  { name: "Rainbow",      color: "#FF6B6B", icon: "🌈" },
  { name: "Exodus",       color: "#8B5CF6", icon: "⚡" },
  { name: "OKX",          color: "#000000", icon: "⭕" },
];

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">

      <div className="relative z-10 max-w-4xl">
        {/* Badge */}
        <div className="animate-fade-in-up" style={{ animationDelay: "0ms" }}>
          <span
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium mb-10"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "var(--muted-light)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Polygon · USDT · On-Ramp — Disponible maintenant
          </span>
        </div>

        {/* Headline */}
        <h1
          className="font-bold tracking-tight leading-[1.05] mb-6 animate-fade-in-up"
          style={{ fontSize: "clamp(2.8rem, 7vw, 5.5rem)", animationDelay: "80ms" }}
        >
          Vendez par{" "}
          <span style={{ color: "var(--accent)" }}>Carte</span>,
          <br />encaissez en{" "}
          <span style={{
            background: "linear-gradient(90deg, #6c63ff, #a78bfa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>Crypto</span>
        </h1>

        {/* Sub */}
        <p
          className="text-lg md:text-xl max-w-lg mx-auto mb-10 leading-relaxed animate-fade-in-up"
          style={{ color: "var(--muted)", animationDelay: "160ms" }}
        >
          Créez un lien de paiement en 60 secondes.
          Vos clients paient par carte — vous recevez de l&apos;USDT dans votre wallet.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in-up" style={{ animationDelay: "240ms" }}>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-semibold text-sm transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(108,99,255,0.3)]"
            style={{ background: "var(--foreground)", color: "var(--background)" }}
          >
            Créer mon lien gratuit
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <a
            href="#process"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-medium text-sm transition-all"
            style={{ border: "1px solid var(--card-border)", color: "var(--muted-light)" }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "#52525b")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--card-border)")}
          >
            Comment ça marche
          </a>
        </div>

        {/* Proof */}
        <p className="mt-8 text-sm animate-fade-in-up" style={{ color: "var(--muted)", animationDelay: "320ms" }}>
          Utilisé par <strong style={{ color: "var(--foreground)" }}>80+ marchands</strong> · 1% de frais · Non-custodial
        </p>
      </div>

      {/* Wallets marquee inline dans le Hero */}
      <div className="relative z-10 mt-16 w-full max-w-2xl animate-fade-in-up overflow-hidden" style={{ animationDelay: "360ms" }}>
        <p className="text-xs text-center mb-4 font-medium tracking-widest uppercase" style={{ color: "var(--muted)" }}>
          Compatible avec tous les wallets
        </p>
        <div className="overflow-hidden mb-3">
          <div className="flex gap-3 animate-marquee" style={{ width: "max-content" }}>
            {[...HERO_WALLETS, ...HERO_WALLETS].map((w, i) => (
              <div key={i} className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl flex-shrink-0"
                style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
                <div className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: w.color }}>
                  {w.icon}
                </div>
                <span className="text-sm font-medium whitespace-nowrap">{w.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="overflow-hidden">
          <div className="flex gap-3 animate-marquee-reverse" style={{ width: "max-content" }}>
            {[...HERO_WALLETS.slice().reverse(), ...HERO_WALLETS.slice().reverse()].map((w, i) => (
              <div key={i} className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl flex-shrink-0"
                style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
                <div className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: w.color }}>
                  {w.icon}
                </div>
                <span className="text-sm font-medium whitespace-nowrap">{w.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce" style={{ color: "var(--muted)" }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M9 4v10M4.5 10l4.5 4 4.5-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </section>
  );
}

// ── Stats ─────────────────────────────────────────────────────────────────────
const STATS = [
  { value: "80+",  label: "Marchands actifs" },
  { value: "12+",  label: "Pays couverts" },
  { value: "95%",  label: "Taux de satisfaction" },
  { value: "1%",   label: "Frais par transaction" },
];

function Stats() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px" style={{ background: "var(--card-border)" }}>
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 80}>
              <div className="flex flex-col items-center justify-center py-14 px-6 text-center" style={{ background: "var(--background)" }}>
                <span className="text-5xl md:text-6xl font-bold tracking-tight mb-2">{s.value}</span>
                <span className="text-sm" style={{ color: "var(--muted)" }}>{s.label}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Features ──────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    tag: "Paiement",
    title: "Carte vers Crypto",
    desc: "Vos clients paient avec leur Visa ou Mastercard. Aucun wallet, aucune friction de leur côté.",
    items: ["Visa & Mastercard", "3D Secure", "Conversion instantanée", "1% de frais seulement"],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="5" width="20" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M2 10h20" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="5" y="13" width="4" height="2" rx="1" fill="currentColor"/>
      </svg>
    ),
  },
  {
    tag: "Sécurité",
    title: "100% Non-custodial",
    desc: "Vos fonds vont directement dans votre wallet. Nous n'y touchons jamais — c'est architecturalement impossible.",
    items: ["Wallet personnel", "Polygon Network", "Smart Contract audité", "Zéro garde de fonds"],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L22 7v6c0 7-4.5 11-10 13C6.5 24 2 20 2 13V7l10-5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
        <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    tag: "Dashboard",
    title: "Tout en temps réel",
    desc: "Graphiques, historique, export CSV. Suivez chaque centime depuis un dashboard pensé pour les pros.",
    items: ["Graphiques live", "Export CSV", "Multi-liens", "Notifications push"],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M14 17.5h7M17.5 14v7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
];

function Features() {
  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="text-center mb-16">
            <span
              className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium mb-6"
              style={{ border: "1px solid var(--card-border)", color: "var(--muted)" }}
            >
              Services
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Une infrastructure complète
            </h2>
            <p className="text-lg max-w-md mx-auto" style={{ color: "var(--muted)" }}>
              Tout ce qu'il faut pour encaisser en crypto — sans code, sans banque, sans friction.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <Reveal key={f.tag} delay={i * 100}>
              <div
                className="rounded-2xl p-7 h-full flex flex-col group cursor-default transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--card-border)",
                  transition: "transform 0.3s, border-color 0.3s, box-shadow 0.3s",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "#3f3f46";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 20px 60px rgba(0,0,0,0.4)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--card-border)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                <div className="mb-5 p-2.5 w-fit rounded-xl" style={{ background: "var(--background)", color: "var(--muted-light)" }}>
                  {f.icon}
                </div>
                <span
                  className="inline-flex self-start px-2.5 py-1 rounded-full text-[11px] font-medium mb-4"
                  style={{ border: "1px solid var(--card-border)", color: "var(--muted)" }}
                >
                  {f.tag}
                </span>
                <h3 className="text-lg font-semibold mb-3">{f.title}</h3>
                <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--muted)" }}>{f.desc}</p>
                <ul className="mt-auto space-y-2">
                  {f.items.map(item => (
                    <li key={item} className="flex items-center gap-2 text-sm" style={{ color: "var(--muted-light)" }}>
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                        <circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" strokeWidth="1"/>
                        <path d="M4 6.5l2 2 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Process ───────────────────────────────────────────────────────────────────
const STEPS = [
  { num: "01", time: "< 1 min",    title: "Créez votre compte",     desc: "Inscrivez-vous et connectez votre wallet Polygon. Aucune vérification bancaire." },
  { num: "02", time: "< 1 min",    title: "Générez votre lien",      desc: "Nommez votre lien, fixez ou laissez libre le montant. Copiez l'URL unique." },
  { num: "03", time: "Instantané", title: "Votre client paie",       desc: "Il ouvre le lien, entre sa carte — la conversion est automatique." },
  { num: "04", time: "< 5 min",    title: "Recevez votre USDT",      desc: "L'USDT arrive directement dans votre wallet Polygon. Aucun intermédiaire." },
];

function Process() {
  return (
    <section id="process" className="py-24 px-6" style={{ background: "var(--card)", borderTop: "1px solid var(--card-border)", borderBottom: "1px solid var(--card-border)" }}>
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="text-center mb-16">
            <span className="inline-flex px-3 py-1.5 rounded-full text-xs font-medium mb-6" style={{ border: "1px solid var(--card-border)", color: "var(--muted)" }}>
              Comment ça marche
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">De zéro à encaissement</h2>
            <p className="text-lg" style={{ color: "var(--muted)" }}>4 étapes. Moins de 2 minutes.</p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-4 gap-8">
          {STEPS.map((step, i) => (
            <Reveal key={step.num} delay={i * 100}>
              <div className="relative">
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-5 left-[calc(50%+28px)] right-[-50%] h-px"
                    style={{ background: "linear-gradient(90deg, var(--card-border) 0%, transparent 100%)" }} />
                )}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold mb-5"
                  style={{ background: "var(--background)", border: "1px solid var(--card-border)", color: "var(--foreground)" }}
                >
                  {step.num}
                </div>
                <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-medium mb-3" style={{ border: "1px solid var(--card-border)", color: "var(--muted)" }}>
                  {step.time}
                </span>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{step.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Testimonials ──────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { name: "Sophie L.", role: "Créatrice de bijoux", quote: "En 5 minutes j'avais mon premier lien. Mon client a payé par carte, j'ai reçu l'USDT dans l'heure. Incroyable." },
  { name: "Marc D.", role: "Consultant freelance", quote: "Mes clients internationaux n'ont plus de friction. Ils paient comme sur Amazon, moi j'encaisse en crypto direct." },
  { name: "Aïcha B.", role: "Coach en ligne", quote: "J'avais peur de la complexité crypto. CryptoPay a tout simplifié — le dashboard est clair et les fonds arrivent vite." },
  { name: "Thomas R.", role: "E-commerçant", quote: "1% de frais vs 2.5% chez Stripe + zéro conversion bancaire. L'économie sur mes volumes est significative." },
];

function Testimonials() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % TESTIMONIALS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const t = TESTIMONIALS[current];

  return (
    <section id="testimonials" className="py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <Reveal>
          <span className="inline-flex px-3 py-1.5 rounded-full text-xs font-medium mb-6" style={{ border: "1px solid var(--card-border)", color: "var(--muted)" }}>
            Témoignages
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-16">Ils encaissent déjà</h2>
        </Reveal>

        <div className="relative">
          <div
            key={current}
            className="testimonial-enter rounded-2xl p-10"
            style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}
          >
            <p className="text-xl md:text-2xl leading-relaxed mb-8 font-light">
              &ldquo;{t.quote}&rdquo;
            </p>
            <div className="flex items-center justify-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold"
                style={{ background: "var(--accent)", color: "white" }}
              >
                {t.name[0]}
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs" style={{ color: "var(--muted)" }}>{t.role}</p>
              </div>
            </div>
          </div>

          {/* Dots */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="rounded-full transition-all"
                style={{
                  width: i === current ? "24px" : "6px",
                  height: "6px",
                  background: i === current ? "var(--foreground)" : "var(--card-border)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Wallets ───────────────────────────────────────────────────────────────────

const WALLETS = [
  { name: "MetaMask",    color: "#E2761B", bg: "#FFF3E0", logo: "https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" },
  { name: "Phantom",     color: "#9945FF", bg: "#F3E8FF", logo: "https://187760183-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-MVOiF6Zqit57erLfCUS%2Fuploads%2FHEJvPkbEBHNMFTkOoGzp%2FPhantom_SVG_Icon.svg?alt=media&token=71c3b2bd-9e8e-4460-8674-f09e77b26c5b" },
  { name: "Coinbase",    color: "#0052FF", bg: "#E8F0FF", logo: "https://upload.wikimedia.org/wikipedia/commons/1/1a/24px-Coinbase.svg.png" },
  { name: "Binance",     color: "#F0B90B", bg: "#FFFBE6", logo: "https://upload.wikimedia.org/wikipedia/commons/e/ef/Binance_Logo.svg" },
  { name: "Kraken",      color: "#5741D9", bg: "#EDE9FF", logo: "https://upload.wikimedia.org/wikipedia/commons/3/36/Kraken_logo.svg" },
  { name: "Trust Wallet",color: "#3375BB", bg: "#E8F2FF", logo: "https://trustwallet.com/assets/images/media/assets/TWT.png" },
  { name: "Ledger",      color: "#000000", bg: "#F0F0F0", logo: "https://upload.wikimedia.org/wikipedia/commons/7/76/Ledger_logo.svg" },
  { name: "Rainbow",     color: "#FF6B6B", bg: "#FFF0F0", logo: "https://rainbowkit.com/rainbow.svg" },
];

function Wallets() {
  return (
    <section className="py-20 px-6 relative z-10">
      <Reveal>
        <div className="max-w-4xl mx-auto text-center mb-12">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "var(--accent)" }}>
            Compatible avec
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Tous les wallets populaires
          </h2>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Vos clients reçoivent leurs USDT directement dans le wallet de leur choix.
          </p>
        </div>
      </Reveal>

      <Reveal delay={100}>
        <div className="max-w-5xl mx-auto">
          {/* Marquee row 1 */}
          <div className="overflow-hidden mb-4">
            <div className="flex gap-4 animate-marquee" style={{ width: "max-content" }}>
              {[...WALLETS, ...WALLETS].map((w, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-5 py-3 rounded-2xl flex-shrink-0"
                  style={{
                    background: "var(--card)",
                    border: "1px solid var(--card-border)",
                    minWidth: 160,
                  }}
                >
                  <img
                    src={w.logo}
                    alt={w.name}
                    width={28}
                    height={28}
                    style={{ objectFit: "contain", borderRadius: 6 }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <span className="text-sm font-semibold whitespace-nowrap">{w.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Marquee row 2 (inverse) */}
          <div className="overflow-hidden">
            <div className="flex gap-4 animate-marquee-reverse" style={{ width: "max-content" }}>
              {[...WALLETS.slice().reverse(), ...WALLETS.slice().reverse()].map((w, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-5 py-3 rounded-2xl flex-shrink-0"
                  style={{
                    background: "var(--card)",
                    border: "1px solid var(--card-border)",
                    minWidth: 160,
                  }}
                >
                  <img
                    src={w.logo}
                    alt={w.name}
                    width={28}
                    height={28}
                    style={{ objectFit: "contain", borderRadius: 6 }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <span className="text-sm font-semibold whitespace-nowrap">{w.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

// ── CTA ───────────────────────────────────────────────────────────────────────
function CTA() {
  return (
    <section id="contact" className="py-24 px-6">
      <Reveal>
        <div
          className="max-w-3xl mx-auto rounded-2xl p-12 text-center relative overflow-hidden"
          style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}
        >
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(ellipse, rgba(108,99,255,0.08) 0%, transparent 70%)" }}
          />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Prêt à encaisser en crypto ?
            </h2>
            <p className="text-lg mb-8 max-w-md mx-auto" style={{ color: "var(--muted)" }}>
              Rejoignez les marchands qui ont déjà adopté le futur du paiement. Gratuit, sans engagement.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(108,99,255,0.25)]"
              style={{ background: "var(--foreground)", color: "var(--background)" }}
            >
              Créer mon compte gratuitement
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="px-6 md:px-10 py-12 border-t" style={{ borderColor: "var(--card-border)" }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start justify-between gap-8">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: "var(--foreground)", color: "var(--background)" }}>CP</div>
            <span className="font-semibold text-sm">CryptoPay</span>
          </div>
          <p className="text-sm max-w-xs" style={{ color: "var(--muted)" }}>
            Vendez par carte, encaissez en USDT.<br />La passerelle crypto pour les pros.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-sm">
          <div>
            <p className="font-medium mb-3">Produit</p>
            {[["#features","Services"],["#process","Comment ça marche"],["#testimonials","Témoignages"]].map(([href, label]) => (
              <a key={href} href={href} className="block mb-2 transition-colors" style={{ color: "var(--muted)" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--foreground)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}>
                {label}
              </a>
            ))}
          </div>
          <div>
            <p className="font-medium mb-3">Compte</p>
            {[["/dashboard","Dashboard"],["/dashboard","Se connecter"],["/dashboard/lien","Créer un lien"]].map(([href, label]) => (
              <Link key={label} href={href} className="block mb-2 transition-colors" style={{ color: "var(--muted)" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--foreground)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}>
                {label}
              </Link>
            ))}
          </div>
          <div>
            <p className="font-medium mb-3">Tech</p>
            {[["Polygon Network"],["USDT (ERC-20)"],["Non-custodial"]].map(([label]) => (
              <p key={label} className="mb-2" style={{ color: "var(--muted)" }}>{label}</p>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-10 pt-6 border-t flex items-center justify-between gap-4" style={{ borderColor: "var(--card-border)" }}>
        <p className="text-xs" style={{ color: "var(--muted)" }}>© 2026 CryptoPay · Tous droits réservés</p>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs" style={{ color: "var(--muted)" }}>Polygon Mainnet</span>
        </div>
      </div>
    </footer>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <>
      <GalaxyCanvas />
      <Nav />
      <Hero />
      <Stats />
      <Features />
      <Process />
      <Wallets />
      <Testimonials />
      <CTA />
      <Footer />
    </>
  );
}
