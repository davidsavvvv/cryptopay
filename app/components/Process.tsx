import ScrollReveal from "./ScrollReveal";

const steps = [
  {
    num: "01",
    duration: "< 1 min",
    title: "Créez votre compte",
    desc: "Inscrivez-vous et connectez votre wallet Polygon. Aucune vérification bancaire requise.",
  },
  {
    num: "02",
    duration: "< 1 min",
    title: "Générez votre lien",
    desc: "Donnez un nom à votre lien, définissez le montant ou laissez-le libre. Copiez le lien.",
  },
  {
    num: "03",
    duration: "Instantané",
    title: "Partagez & encaissez",
    desc: "Envoyez le lien à votre client. Il paie par carte, vous recevez l'USDT en quelques minutes.",
  },
  {
    num: "04",
    duration: "En continu",
    title: "Suivez vos revenus",
    desc: "Consultez votre dashboard en temps réel. Exportez, analysez, optimisez vos ventes.",
  },
];

export default function Process() {
  return (
    <section id="process" className="py-24 px-6" style={{ background: "var(--card)", borderTop: "1px solid var(--card-border)", borderBottom: "1px solid var(--card-border)" }}>
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <div className="tag inline-flex mb-6">Comment ça marche</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              De zéro à encaissement
            </h2>
            <p className="text-lg" style={{ color: "var(--muted)" }}>
              4 étapes pour commencer à accepter des paiements crypto.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <ScrollReveal key={step.num} delay={i * 100}>
              <div className="relative">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div
                    className="hidden md:block absolute top-5 left-[calc(50%+28px)] right-[-50%]"
                    style={{ height: "1px", background: "linear-gradient(90deg, var(--card-border) 0%, transparent 100%)" }}
                  />
                )}

                {/* Step number */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold mb-6"
                  style={{ background: "var(--background)", border: "1px solid var(--card-border)", color: "var(--muted-light)" }}
                >
                  {step.num}
                </div>

                <div className="tag inline-flex mb-3">{step.duration}</div>
                <h3 className="font-semibold text-base mb-2">{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{step.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
