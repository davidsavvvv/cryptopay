"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { href: "#features", label: "Services" },
  { href: "#process", label: "Comment ça marche" },
  { href: "#testimonials", label: "Témoignages" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(9,9,11,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(39,39,42,0.6)" : "1px solid transparent",
      }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 group">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-transform group-hover:scale-110"
          style={{ background: "var(--foreground)", color: "var(--background)" }}
        >
          CP
        </div>
        <span className="font-semibold tracking-tight">CryptoPay</span>
      </Link>

      {/* Links */}
      <div className="hidden md:flex items-center gap-8">
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="text-sm transition-colors"
            style={{ color: "var(--muted)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--foreground)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
          >
            {l.label}
          </a>
        ))}
      </div>

      {/* CTA */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="hidden md:inline-block text-sm transition-colors"
          style={{ color: "var(--muted)" }}
        >
          Se connecter
        </Link>
        <Link href="/dashboard" className="btn-primary text-sm !py-2.5 !px-5">
          Commencer →
        </Link>
      </div>
    </nav>
  );
}
