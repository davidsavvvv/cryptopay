import ScrollReveal from "./ScrollReveal";

const services = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="2" y="6" width="24" height="16" rx="3" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M2 11h24" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="6" y="15" width="4" height="2" rx="1" fill="currentColor"/>
      </svg>
    ),
    tag: "Paiement",
    title: "Carte vers Crypto",
    desc: "Vos clients paient avec leur carte Visa ou Mastercard habituelle. Aucune friction, aucun wallet requis de leur côté.",
    items: ["Visa & Mastercard", "3D Secure", "Conversion instantanée", "1% de frais"],
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 3L25 8v6c0 6-4.5 10.5-11 13C7.5 24.5 3 20 3 14V8l11-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M9 14l3 3 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    tag: "Sécurité",
    title: "Non-custodial",
    desc: "Vos fonds vont directement dans votre wallet. Nous n'avons jamais accès à votre crypto — c'est une garantie architecturale.",
    items: ["Wallet personnel", "Polygon Network", "USDT natif", "Audit Smart Contract"],
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="3" y="3" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="16" y="3" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="3" y="16" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M16 20.5h9M20.5 16v9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    tag: "Dashboard",
    title: "Tout en temps réel",
    desc: "Suivez chaque transaction, exportez vos données, gérez vos liens de paiement depuis un dashboard conçu pour les pros.",
    items: ["Graphiques en temps réel", "Export CSV", "Multi-liens", "Notifications"],
  },
];

export default function Services() {
  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <div className="tag inline-flex mb-6">Services</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Une infrastructure complète
            </h2>
            <p className="text-lg max-w-lg mx-auto" style={{ color: "var(--muted)" }}>
              Tout ce qu'il faut pour accepter des paiements crypto sans friction, sans code, sans compromis.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <ScrollReveal key={s.tag} delay={i * 120}>
              <div
                className="card-hover rounded-2xl p-8 h-full flex flex-col"
                style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}
              >
                <div className="mb-6" style={{ color: "var(--muted-light)" }}>{s.icon}</div>
                <div className="tag inline-flex mb-4" style={{ alignSelf: "flex-start" }}>{s.tag}</div>
                <h3 className="text-xl font-semibold mb-3">{s.title}</h3>
                <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--muted)" }}>{s.desc}</p>
                <ul className="mt-auto space-y-2">
                  {s.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm" style={{ color: "var(--muted-light)" }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1"/>
                        <path d="M4.5 7l2 2 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
