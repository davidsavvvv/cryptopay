import Link from "next/link";

const features = [
  {
    icon: "💳",
    title: "Paiement Carte Bancaire",
    desc: "Vos clients paient par carte Visa ou Mastercard, comme ils en ont l'habitude.",
  },
  {
    icon: "⚡",
    title: "Encaissement en USDT",
    desc: "Les fonds arrivent directement en USDT sur votre wallet Polygon en quelques minutes.",
  },
  {
    icon: "🔗",
    title: "Lien de paiement unique",
    desc: "Partagez votre lien personnalisé — aucun site e-commerce requis.",
  },
  {
    icon: "🛡️",
    title: "Sécurisé & non-custodial",
    desc: "Vous gardez le contrôle total de vos fonds. Nous ne touchons jamais à votre crypto.",
  },
  {
    icon: "📊",
    title: "Dashboard en temps réel",
    desc: "Suivez chaque transaction, le statut et les montants reçus depuis votre dashboard.",
  },
  {
    icon: "🌍",
    title: "Acceptez des paiements globaux",
    desc: "Fini les frictions bancaires. Servez des clients du monde entier sans restriction.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--card-border)" }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ background: "var(--accent)" }}>
            CP
          </div>
          <span className="font-semibold text-lg">CryptoPay</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-sm px-4 py-2 rounded-lg font-medium transition-colors"
            style={{ color: "var(--muted)" }}
          >
            Se connecter
          </Link>
          <Link
            href="/dashboard"
            className="text-sm px-4 py-2 rounded-lg font-semibold text-white transition-all"
            style={{ background: "var(--accent)" }}
          >
            Commencer gratuitement
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 relative overflow-hidden">
        {/* Background glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%)" }}
        />

        <div className="relative z-10 max-w-3xl animate-fade-in-up">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-8"
            style={{ background: "var(--card)", border: "1px solid var(--card-border)", color: "var(--accent)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Powered by Polygon · USDT · On-Ramp
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight mb-6">
            Vendez par{" "}
            <span style={{ color: "var(--accent)" }}>Carte</span>
            ,<br />
            encaissez en{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #6c63ff, #a78bfa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Crypto
            </span>
          </h1>

          <p className="text-lg md:text-xl mb-10 max-w-xl mx-auto" style={{ color: "var(--muted)" }}>
            Créez votre lien de paiement en 60 secondes. Vos clients paient par carte — vous recevez de l&apos;USDT directement dans votre wallet.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="px-8 py-4 rounded-xl font-semibold text-white text-base transition-all animate-glow"
              style={{ background: "#6c63ff", display: "inline-block", WebkitTextFillColor: "white" }}
            >
              Créer mon lien de paiement →
            </Link>
            <a
              href="#features"
              className="px-8 py-4 rounded-xl font-semibold text-base transition-all"
              style={{
                background: "var(--card)",
                border: "1px solid var(--card-border)",
                color: "var(--foreground)",
              }}
            >
              Comment ça marche
            </a>
          </div>
        </div>

        {/* Mock payment card preview */}
        <div
          className="relative z-10 mt-20 rounded-2xl p-6 w-full max-w-sm text-left shadow-2xl"
          style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs mb-1" style={{ color: "var(--muted)" }}>Paiement vers</p>
              <p className="font-semibold">Boutique Luxe Paris</p>
            </div>
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{ background: "var(--accent)", opacity: 0.15 }}>
              🛍️
            </div>
          </div>
          <div className="text-4xl font-bold mb-1">€ 249.00</div>
          <p className="text-xs mb-5" style={{ color: "var(--muted)" }}>≈ 249.00 USDT sur Polygon</p>
          <div
            className="w-full py-3 rounded-xl text-center font-semibold text-white text-sm"
            style={{ background: "var(--accent)" }}
          >
            Payer par Carte Bancaire
          </div>
          <p className="text-center text-xs mt-3" style={{ color: "var(--muted)" }}>
            Sécurisé · 1% de frais · Non-custodial
          </p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-24" style={{ background: "var(--card)" }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Tout ce dont vous avez besoin
          </h2>
          <p className="text-center mb-16" style={{ color: "var(--muted)" }}>
            Une infrastructure complète pour accepter des paiements crypto sans friction.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-xl p-6 transition-all hover:-translate-y-1"
                style={{ background: "var(--background)", border: "1px solid var(--card-border)" }}
              >
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-base mb-2">{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Prêt à encaisser en crypto ?
          </h2>
          <p className="mb-8" style={{ color: "var(--muted)" }}>
            Rejoignez les marchands qui ont déjà adopté le futur du paiement.
          </p>
          <Link
            href="/dashboard"
            className="inline-block px-10 py-4 rounded-xl font-semibold text-white text-base transition-all"
            style={{ background: "var(--accent)" }}
          >
            Créer mon compte gratuitement →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 text-center text-sm border-t" style={{ borderColor: "var(--card-border)", color: "var(--muted)" }}>
        © 2026 CryptoPay · Paiements Card-to-Crypto sur Polygon
      </footer>
    </div>
  );
}
