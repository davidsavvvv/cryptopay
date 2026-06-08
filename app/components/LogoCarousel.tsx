const LOGOS = [
  { name: "Stripe", symbol: "⚡" },
  { name: "Polygon", symbol: "◆" },
  { name: "Coinbase", symbol: "○" },
  { name: "Binance", symbol: "◈" },
  { name: "Circle", symbol: "◉" },
  { name: "Tether", symbol: "₮" },
  { name: "Alchemy", symbol: "⬡" },
  { name: "Metamask", symbol: "🦊" },
  { name: "Ledger", symbol: "▣" },
  { name: "Fireblocks", symbol: "⬛" },
  { name: "Chainalysis", symbol: "⬢" },
  { name: "Paxos", symbol: "◇" },
];

function LogoItem({ name, symbol }: { name: string; symbol: string }) {
  return (
    <div
      className="flex items-center gap-3 px-8 py-4 rounded-xl mx-3 whitespace-nowrap transition-colors"
      style={{
        border: "1px solid var(--card-border)",
        background: "var(--card)",
        color: "var(--muted)",
      }}
    >
      <span className="text-xl">{symbol}</span>
      <span className="text-sm font-medium">{name}</span>
    </div>
  );
}

export default function LogoCarousel() {
  const doubled = [...LOGOS, ...LOGOS];

  return (
    <section className="py-16 overflow-hidden" style={{ borderTop: "1px solid var(--card-border)", borderBottom: "1px solid var(--card-border)" }}>
      <p className="text-center text-xs tracking-widest uppercase mb-8" style={{ color: "var(--muted)" }}>
        Intégré avec les meilleurs protocoles
      </p>
      <div className="carousel-track">
        {doubled.map((logo, i) => (
          <LogoItem key={i} {...logo} />
        ))}
      </div>
    </section>
  );
}
