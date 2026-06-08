"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const WORDS = ["carte", "crypto", "USDT", "liberté", "simplicité", "Polygon", "sécurité"];

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [animClass, setAnimClass] = useState("word-enter");

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimClass("word-exit");
      setTimeout(() => {
        setIndex((i) => (i + 1) % WORDS.length);
        setAnimClass("word-enter");
      }, 380);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden noise">
      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(108,99,255,0.08) 0%, transparent 65%)" }}
      />

      <div className="relative z-10 max-w-4xl animate-fade-in-up">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 tag mb-10">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Powered by Polygon · USDT · On-Ramp
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] mb-6">
          Vendez en{" "}
          <span
            className="inline-block overflow-hidden align-bottom"
            style={{ height: "1.1em", minWidth: "3ch" }}
          >
            <span
              key={index}
              className={`inline-block ${animClass}`}
              style={{
                background: "linear-gradient(135deg, #6c63ff 0%, #a78bfa 50%, #818cf8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {WORDS[index]}
            </span>
          </span>
          ,<br />encaissez partout.
        </h1>

        {/* Sub */}
        <p className="text-lg md:text-xl max-w-xl mx-auto mb-12 leading-relaxed" style={{ color: "var(--muted-light)" }}>
          Créez votre lien de paiement en 60 secondes. Vos clients paient par carte —
          vous recevez de l&apos;USDT directement dans votre wallet Polygon.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dashboard" className="btn-primary animate-glow">
            Créer mon lien gratuit
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <a href="#process" className="btn-secondary">
            Comment ça marche
          </a>
        </div>

        {/* Social proof */}
        <p className="mt-10 text-sm" style={{ color: "var(--muted)" }}>
          Déjà utilisé par <span style={{ color: "var(--foreground)" }}>80+ marchands</span> dans 12 pays
        </p>
      </div>

      {/* Mock card floating */}
      <div
        className="relative z-10 mt-20 w-full max-w-sm text-left rounded-2xl p-6 shadow-2xl animate-fade-in-up"
        style={{
          background: "var(--card)",
          border: "1px solid var(--card-border)",
          animationDelay: "0.3s",
          boxShadow: "0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)",
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs mb-0.5" style={{ color: "var(--muted)" }}>Paiement vers</p>
            <p className="font-semibold">Boutique Luxe Paris</p>
          </div>
          <div className="tag">✓ Sécurisé</div>
        </div>
        <div className="text-4xl font-bold tracking-tight mb-1">€ 249.00</div>
        <p className="text-xs mb-6" style={{ color: "var(--muted)" }}>≈ 249.00 USDT sur Polygon</p>
        <div
          className="w-full py-3.5 rounded-xl text-center font-semibold text-sm"
          style={{ background: "var(--foreground)", color: "var(--background)" }}
        >
          Payer par Carte Bancaire →
        </div>
        <div className="flex items-center justify-center gap-4 mt-4">
          {["Visa", "MC", "USDT"].map((b) => (
            <span key={b} className="text-xs" style={{ color: "var(--muted)" }}>{b}</span>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce" style={{ color: "var(--muted)" }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 4v12M5 11l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </section>
  );
}
