import ScrollReveal from "./ScrollReveal";

const stats = [
  { value: "80+", label: "Marchands actifs" },
  { value: "12+", label: "Pays couverts" },
  { value: "95%", label: "Taux de satisfaction" },
  { value: "1%", label: "Frais seulement" },
];

export default function Stats() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px" style={{ background: "var(--card-border)" }}>
          {stats.map((s, i) => (
            <ScrollReveal key={s.label} delay={i * 100}>
              <div
                className="flex flex-col items-center justify-center py-14 px-6 text-center"
                style={{ background: "var(--background)" }}
              >
                <span className="text-5xl md:text-6xl font-bold tracking-tight mb-2">{s.value}</span>
                <span className="text-sm" style={{ color: "var(--muted)" }}>{s.label}</span>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
