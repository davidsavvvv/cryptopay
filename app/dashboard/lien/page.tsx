"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase, type MerchantSettings } from "@/lib/supabase";
import type { PaymentPreview, PreviewConfig } from "@/app/dashboard/apercu/page";

// ── Types ─────────────────────────────────────────────────────────────────────

interface PaymentLink {
  id: string;
  label: string;
  slug: string;
  amount?: number;
  type: "libre" | "fixe";
  apercuId?: string;
}

// ── Config par défaut ─────────────────────────────────────────────────────────

const DEFAULT_CFG: PreviewConfig = {
  bg: "#09090b", cardBg: "#111113", accent: "#6c63ff", textColor: "#fafafa",
  borderRadius: "16", businessName: "Mon Business", tagline: "Paiement sécurisé",
  amount: "€ 99.00", font: "inter", logoUrl: null, bgImageUrl: null,
  buttonLabel: "Payer par carte →", showBadge: true, style: "flat",
};

// ── Mini preview du lien (à droite) ──────────────────────────────────────────

function LinkPreview({
  cfg,
  label,
  amount,
  amountType,
}: {
  cfg: PreviewConfig;
  label: string;
  amount: string;
  amountType: "libre" | "fixe";
}) {
  const isLight = cfg.textColor.toLowerCase() === "#09090b" || cfg.textColor.toLowerCase() === "#111111";
  const muted = isLight ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.5)";
  const displayAmount = amountType === "fixe" && amount ? `€ ${parseFloat(amount).toFixed(2)}` : "€ —";

  const cardBg =
    cfg.style === "glass" ? cfg.cardBg
    : cfg.style === "gradient" ? `linear-gradient(135deg, ${cfg.cardBg} 0%, ${cfg.accent}22 100%)`
    : cfg.cardBg;

  return (
    <div
      style={{
        background: cfg.style === "gradient"
          ? `radial-gradient(ellipse at top, ${cfg.accent}33 0%, ${cfg.bg} 60%)`
          : cfg.bg,
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 24px",
        gap: 16,
        position: "relative",
        overflow: "hidden",
        fontFamily: cfg.font === "serif" ? "Georgia, serif" : "system-ui, sans-serif",
      }}
    >
      {cfg.bgImageUrl && (
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${cfg.bgImageUrl})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.3 }} />
      )}

      {/* Fake browser bar */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 36, background: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.04)", borderBottom: `1px solid ${isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)"}`, display: "flex", alignItems: "center", gap: 6, padding: "0 12px", zIndex: 2 }}>
        {["#ff5f57","#ffbd2e","#28c840"].map(c => <div key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c, opacity: 0.7 }} />)}
        <div style={{ flex: 1, marginLeft: 8, height: 18, borderRadius: 4, background: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", paddingLeft: 8 }}>
          <span style={{ fontSize: 10, color: muted, fontFamily: "monospace" }}>cryptopay.app/…</span>
        </div>
      </div>

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 280, marginTop: 36 }}>
        {/* Merchant card */}
        <div style={{ background: cardBg, backdropFilter: cfg.style === "glass" ? "blur(20px)" : undefined, border: cfg.style === "glass" ? "1px solid rgba(255,255,255,0.15)" : `1px solid ${isLight ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.07)"}`, borderRadius: `${cfg.borderRadius}px`, padding: "20px", color: cfg.textColor, textAlign: "center", marginBottom: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: cfg.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#fff", margin: "0 auto 10px" }}>
            {cfg.businessName.charAt(0).toUpperCase()}
          </div>
          <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>{cfg.businessName || "Mon Business"}</p>
          {cfg.showBadge && (
            <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 100, background: "rgba(34,197,94,0.1)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)" }}>✓ Sécurisé</span>
          )}
        </div>

        {/* Payment card */}
        <div style={{ background: cardBg, backdropFilter: cfg.style === "glass" ? "blur(20px)" : undefined, border: cfg.style === "glass" ? "1px solid rgba(255,255,255,0.15)" : `1px solid ${isLight ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.07)"}`, borderRadius: `${cfg.borderRadius}px`, padding: "20px", color: cfg.textColor }}>
          {label && (
            <span style={{ fontSize: 11, padding: "2px 10px", borderRadius: 100, background: `${cfg.accent}22`, color: cfg.accent, display: "inline-block", marginBottom: 10 }}>{label || "Mon lien"}</span>
          )}
          <p style={{ fontSize: 11, color: muted, marginBottom: 4 }}>Montant à payer</p>
          <p style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 4 }}>
            {amountType === "fixe" && amount ? `€ ${parseFloat(amount).toFixed(2)}` : <span style={{ color: muted, fontWeight: 400, fontSize: 18 }}>Montant libre</span>}
          </p>
          {amountType === "fixe" && amount && (
            <p style={{ fontSize: 11, color: muted, marginBottom: 14 }}>≈ {(parseFloat(amount) * 0.99).toFixed(2)} USDT</p>
          )}
          <button style={{ width: "100%", padding: "11px", borderRadius: `${Math.max(6, parseInt(cfg.borderRadius) - 6)}px`, background: cfg.accent, color: "#fff", fontWeight: 600, fontSize: 13, border: "none", cursor: "pointer", marginTop: amountType !== "fixe" || !amount ? 14 : 0 }}>
            {cfg.buttonLabel}
          </button>
          <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 10 }}>
            {["Visa", "MC", "3DS"].map(b => <span key={b} style={{ fontSize: 10, color: muted }}>{b}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Éditeur de style rapide ───────────────────────────────────────────────────

function QuickStyleEditor({ cfg, onChange }: { cfg: PreviewConfig; onChange: (c: PreviewConfig) => void }) {
  const QUICK_THEMES = [
    { name: "Dark", bg: "#09090b", cardBg: "#111113", accent: "#6c63ff", textColor: "#fafafa", style: "flat" as const },
    { name: "Light", bg: "#f4f4f5", cardBg: "#ffffff", accent: "#6c63ff", textColor: "#09090b", style: "flat" as const },
    { name: "Glass", bg: "#0f0c29", cardBg: "rgba(255,255,255,0.09)", accent: "#a78bfa", textColor: "#ffffff", style: "glass" as const },
    { name: "Ocean", bg: "#0a1628", cardBg: "#0f2040", accent: "#38bdf8", textColor: "#e2e8f0", style: "flat" as const },
    { name: "Rose", bg: "#1a0a0f", cardBg: "#2d1520", accent: "#f43f5e", textColor: "#fdf2f4", style: "flat" as const },
    { name: "Gold", bg: "#1a0533", cardBg: "#2d1b4e", accent: "#f59e0b", textColor: "#ffffff", style: "gradient" as const },
  ];

  function safeHex(v: string) { return /^#[0-9a-fA-F]{6}$/.test(v) ? v : "#111111"; }

  return (
    <div className="space-y-4">
      {/* Thèmes rapides */}
      <div>
        <p className="text-xs font-medium mb-2" style={{ color: "var(--muted)" }}>Thème</p>
        <div className="grid grid-cols-6 gap-1.5">
          {QUICK_THEMES.map(t => (
            <button
              key={t.name}
              type="button"
              title={t.name}
              onClick={() => onChange({ ...cfg, bg: t.bg, cardBg: t.cardBg, accent: t.accent, textColor: t.textColor, style: t.style })}
              className="rounded-lg overflow-hidden transition-all"
              style={{
                height: 32,
                background: t.style === "gradient" ? `linear-gradient(135deg, ${t.bg}, ${t.accent}55)` : t.bg,
                border: cfg.bg === t.bg ? `2px solid ${t.accent}` : "2px solid transparent",
                position: "relative",
              }}
            >
              <div style={{ position: "absolute", bottom: 4, left: "50%", transform: "translateX(-50%)", width: 20, height: 4, borderRadius: 2, background: t.accent }} />
            </button>
          ))}
        </div>
      </div>

      {/* Couleur accent */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <p className="text-xs font-medium mb-1.5" style={{ color: "var(--muted)" }}>Couleur accent</p>
          <div className="flex items-center gap-2">
            <input type="color" value={safeHex(cfg.accent)} onChange={e => onChange({ ...cfg, accent: e.target.value })}
              style={{ width: 40, height: 34, border: "1px solid var(--card-border)", borderRadius: 8, padding: 3, background: "var(--background)", cursor: "pointer" }} />
            <span className="text-xs font-mono" style={{ color: "var(--muted)" }}>{cfg.accent}</span>
          </div>
        </div>
        <div className="flex-1">
          <p className="text-xs font-medium mb-1.5" style={{ color: "var(--muted)" }}>Style carte</p>
          <div className="flex gap-1">
            {(["flat", "glass", "gradient"] as const).map(s => (
              <button key={s} type="button" onClick={() => onChange({ ...cfg, style: s })}
                className="flex-1 py-1.5 rounded-lg text-[10px] font-medium"
                style={{ background: cfg.style === s ? "rgba(108,99,255,0.15)" : "var(--background)", border: `1px solid ${cfg.style === s ? "var(--accent)" : "var(--card-border)"}`, color: cfg.style === s ? "var(--accent)" : "var(--muted)" }}>
                {s === "flat" ? "Plat" : s === "glass" ? "Verre" : "Dégradé"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Nom affiché + bouton */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs font-medium mb-1.5" style={{ color: "var(--muted)" }}>Nom affiché</p>
          <input value={cfg.businessName} onChange={e => onChange({ ...cfg, businessName: e.target.value })}
            placeholder="Mon Business"
            className="w-full text-xs px-3 py-2 rounded-lg outline-none"
            style={{ background: "var(--background)", border: "1px solid var(--card-border)", color: "var(--foreground)" }}
            onFocus={e => (e.currentTarget.style.borderColor = "var(--accent)")}
            onBlur={e => (e.currentTarget.style.borderColor = "var(--card-border)")} />
        </div>
        <div>
          <p className="text-xs font-medium mb-1.5" style={{ color: "var(--muted)" }}>Texte du bouton</p>
          <input value={cfg.buttonLabel} onChange={e => onChange({ ...cfg, buttonLabel: e.target.value })}
            placeholder="Payer par carte →"
            className="w-full text-xs px-3 py-2 rounded-lg outline-none"
            style={{ background: "var(--background)", border: "1px solid var(--card-border)", color: "var(--foreground)" }}
            onFocus={e => (e.currentTarget.style.borderColor = "var(--accent)")}
            onBlur={e => (e.currentTarget.style.borderColor = "var(--card-border)")} />
        </div>
      </div>

      {/* Arrondi + badge */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <p className="text-xs font-medium mb-1.5" style={{ color: "var(--muted)" }}>Arrondi — {cfg.borderRadius}px</p>
          <input type="range" min="0" max="32" value={cfg.borderRadius}
            onChange={e => onChange({ ...cfg, borderRadius: e.target.value })}
            style={{ width: "100%", accentColor: "var(--accent)" }} />
        </div>
        <div>
          <p className="text-xs font-medium mb-1.5" style={{ color: "var(--muted)" }}>Badge</p>
          <button type="button" onClick={() => onChange({ ...cfg, showBadge: !cfg.showBadge })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all"
            style={{ border: `1px solid ${cfg.showBadge ? "var(--accent)" : "var(--card-border)"}`, background: cfg.showBadge ? "rgba(108,99,255,0.1)" : "var(--background)", color: cfg.showBadge ? "var(--accent)" : "var(--muted)" }}>
            {cfg.showBadge ? "✓ Actif" : "Désactivé"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Éditeur de lien (vue split) ───────────────────────────────────────────────

function LinkEditor({
  initial,
  merchantUsername,
  previews,
  onSave,
  onCancel,
}: {
  initial?: PaymentLink;
  merchantUsername: string;
  previews: PaymentPreview[];
  onSave: (link: PaymentLink, cfg: PreviewConfig) => void;
  onCancel: () => void;
}) {
  const [label, setLabel] = useState(initial?.label ?? "");
  const [type, setType] = useState<"libre" | "fixe">(initial?.type ?? "libre");
  const [amount, setAmount] = useState(initial?.amount?.toString() ?? "");
  const [apercuId, setApercuId] = useState<string | undefined>(initial?.apercuId);
  const [cfg, setCfg] = useState<PreviewConfig>(() => {
    if (initial?.apercuId) {
      const found = previews.find(p => p.id === initial.apercuId);
      if (found) return found.config;
    }
    if (previews.length > 0) return previews[0].config;
    return DEFAULT_CFG;
  });

  const inputStyle: React.CSSProperties = {
    background: "var(--background)",
    border: "1px solid var(--card-border)",
    color: "var(--foreground)",
    width: "100%",
    padding: "10px 12px",
    borderRadius: "10px",
    fontSize: "13px",
    outline: "none",
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!label.trim()) return;
    const slug = initial?.slug ?? `${merchantUsername}-${label.toLowerCase().replace(/\s+/g, "-")}-${Date.now().toString(36)}`;
    onSave({ id: initial?.id ?? Date.now().toString(), label: label.trim(), slug, type, amount: type === "fixe" ? parseFloat(amount) : undefined, apercuId }, cfg);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="grid lg:grid-cols-2 gap-0 flex-1 min-h-0" style={{ border: "1px solid var(--card-border)", borderRadius: 16, overflow: "hidden" }}>

        {/* Gauche — formulaire */}
        <div className="flex flex-col p-6 gap-5 overflow-y-auto border-r" style={{ background: "var(--card)", borderColor: "var(--card-border)" }}>

          <div>
            <h3 className="font-semibold text-base mb-0.5">{initial ? "Modifier le lien" : "Nouveau lien de paiement"}</h3>
            <p className="text-xs" style={{ color: "var(--muted)" }}>Configurez votre lien, puis personnalisez l&apos;aperçu à droite.</p>
          </div>

          {/* Nom */}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--muted)" }}>Nom du lien</label>
            <input value={label} onChange={e => setLabel(e.target.value)} required placeholder="ex: Consultation, Coaching Premium…"
              style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = "var(--accent)")}
              onBlur={e => (e.currentTarget.style.borderColor = "var(--card-border)")} />
          </div>

          {/* Type */}
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: "var(--muted)" }}>Type de paiement</label>
            <div className="grid grid-cols-2 gap-2">
              {([
                { value: "libre", title: "Montant libre", desc: "Le client choisit" },
                { value: "fixe",  title: "Montant fixe",  desc: "Vous définissez" },
              ] as const).map(opt => (
                <button key={opt.value} type="button" onClick={() => setType(opt.value)}
                  className="px-4 py-3 rounded-xl text-left transition-all"
                  style={{ background: type === opt.value ? "rgba(108,99,255,0.12)" : "var(--background)", border: `1px solid ${type === opt.value ? "var(--accent)" : "var(--card-border)"}` }}>
                  <p className="text-sm font-semibold">{opt.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Montant fixe */}
          {type === "fixe" && (
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--muted)" }}>Montant (€)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold" style={{ color: "var(--muted)" }}>€</span>
                <input type="number" min="1" step="0.01" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} required
                  style={{ ...inputStyle, paddingLeft: "28px" }}
                  onFocus={e => (e.currentTarget.style.borderColor = "var(--accent)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "var(--card-border)")} />
              </div>
            </div>
          )}

          {/* Aperçu associé */}
          {previews.length > 0 && (
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: "var(--muted)" }}>Aperçu de paiement associé</label>
              <div className="space-y-1.5">
                {previews.map(p => (
                  <button key={p.id} type="button"
                    onClick={() => { setApercuId(p.id); setCfg(p.config); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all"
                    style={{ background: apercuId === p.id ? "rgba(108,99,255,0.08)" : "var(--background)", border: `1px solid ${apercuId === p.id ? "var(--accent)" : "var(--card-border)"}` }}>
                    <div className="w-7 h-7 rounded-lg flex-shrink-0" style={{ background: p.config.style === "gradient" ? `linear-gradient(135deg, ${p.config.bg}, ${p.config.accent})` : p.config.bg, border: `2px solid ${p.config.accent}55` }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate">{p.name}</p>
                      {p.description && <p className="text-[10px] truncate" style={{ color: "var(--muted)" }}>{p.description}</p>}
                    </div>
                    {apercuId === p.id && (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2.5 7l3 3 6-6" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Séparateur + éditeur rapide */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px" style={{ background: "var(--card-border)" }} />
              <span className="text-xs" style={{ color: "var(--muted)" }}>Personnaliser l&apos;aperçu</span>
              <div className="flex-1 h-px" style={{ background: "var(--card-border)" }} />
            </div>
            <QuickStyleEditor cfg={cfg} onChange={setCfg} />
          </div>

          {/* Boutons */}
          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 py-3 rounded-xl text-sm font-semibold text-white" style={{ background: "var(--accent)" }}>
              {initial ? "Enregistrer" : "Créer le lien"}
            </button>
            <button type="button" onClick={onCancel} className="px-5 py-3 rounded-xl text-sm font-medium" style={{ background: "var(--background)", border: "1px solid var(--card-border)", color: "var(--muted)" }}>
              Annuler
            </button>
          </div>
        </div>

        {/* Droite — preview live */}
        <div style={{ background: "var(--background)", minHeight: 500 }}>
          <LinkPreview cfg={cfg} label={label} amount={amount} amountType={type} />
        </div>
      </div>
    </form>
  );
}

// ── Card lien (liste) ─────────────────────────────────────────────────────────

function LinkCard({
  link,
  cfg,
  previews,
  onEdit,
  onDelete,
  onCopy,
  copied,
}: {
  link: PaymentLink;
  cfg: PreviewConfig;
  previews: PaymentPreview[];
  onEdit: () => void;
  onDelete: () => void;
  onCopy: () => void;
  copied: boolean;
}) {
  const apercu = previews.find(p => p.id === link.apercuId);

  return (
    <div className="rounded-xl overflow-hidden transition-all" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
      <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: "var(--card-border)" }}>
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg flex-shrink-0" style={{ background: cfg.style === "gradient" ? `linear-gradient(135deg, ${cfg.bg}, ${cfg.accent})` : cfg.bg, border: `2px solid ${cfg.accent}55` }} />
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate">{link.label}</p>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: link.type === "fixe" ? "rgba(108,99,255,0.12)" : "rgba(34,197,94,0.1)", color: link.type === "fixe" ? "var(--accent)" : "#22c55e" }}>
                {link.type === "fixe" ? `€ ${link.amount?.toFixed(2)} fixe` : "Montant libre"}
              </span>
              {apercu && (
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--card-border)", color: "var(--muted)" }}>
                  {apercu.name}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={onEdit} className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all" style={{ background: "var(--background)", border: "1px solid var(--card-border)", color: "var(--muted)" }}>
            ✏️ Modifier
          </button>
          <button onClick={onDelete} className="p-1.5 rounded-lg transition-all" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", color: "#ef4444" }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 3h9M5 3V2h3v1M4 3v8h5V3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>
      <div className="px-5 py-4 space-y-3">
        <div className="px-3 py-2.5 rounded-lg font-mono text-xs break-all" style={{ background: "var(--background)", border: "1px solid var(--card-border)", color: "var(--accent)" }}>
          {typeof window !== "undefined" ? `${window.location.origin}/${link.slug}` : `…/${link.slug}`}
        </div>
        <div className="flex gap-2">
          <button onClick={onCopy} className="flex-1 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5"
            style={{ background: copied ? "rgba(34,197,94,0.08)" : "var(--background)", border: "1px solid var(--card-border)", color: copied ? "#22c55e" : "var(--foreground)" }}>
            {copied ? "✓ Copié !" : "📋 Copier le lien"}
          </button>
          <a href={`/${link.slug}`} target="_blank" rel="noreferrer"
            className="flex-1 py-2 rounded-lg text-xs font-medium text-center transition-all"
            style={{ background: "var(--background)", border: "1px solid var(--card-border)", color: "var(--foreground)" }}>
            Ouvrir →
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Page principale ───────────────────────────────────────────────────────────

type View = "list" | "create" | "edit";

export default function LienPage() {
  const router = useRouter();
  const [merchant, setMerchant] = useState<MerchantSettings | null>(null);
  const [links, setLinks] = useState<PaymentLink[]>([]);
  const [previews, setPreviews] = useState<PaymentPreview[]>([]);
  const [linkCfgs, setLinkCfgs] = useState<Record<string, PreviewConfig>>({});
  const [view, setView] = useState<View>("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const username = localStorage.getItem("cryptopay_username");
      if (!username) return;
      const { data } = await supabase.from("merchants").select("*").eq("username", username).single();
      if (data) {
        setMerchant(data);
        const storedLinks = localStorage.getItem(`cryptopay_links_${username}`);
        if (storedLinks) setLinks(JSON.parse(storedLinks));
        const storedPreviews = localStorage.getItem(`cryptopay_apercus_${username}`);
        if (storedPreviews) setPreviews(JSON.parse(storedPreviews));
        const storedCfgs = localStorage.getItem(`cryptopay_link_cfgs_${username}`);
        if (storedCfgs) setLinkCfgs(JSON.parse(storedCfgs));
      }
    }
    load();
  }, []);

  function saveLinks(updated: PaymentLink[]) {
    const username = localStorage.getItem("cryptopay_username");
    setLinks(updated);
    if (username) localStorage.setItem(`cryptopay_links_${username}`, JSON.stringify(updated));
  }

  function saveCfg(linkId: string, cfg: PreviewConfig) {
    const username = localStorage.getItem("cryptopay_username");
    const updated = { ...linkCfgs, [linkId]: cfg };
    setLinkCfgs(updated);
    if (username) localStorage.setItem(`cryptopay_link_cfgs_${username}`, JSON.stringify(updated));
  }

  function handleSave(link: PaymentLink, cfg: PreviewConfig) {
    if (editingId) {
      saveLinks(links.map(l => l.id === link.id ? link : l));
    } else {
      saveLinks([...links, link]);
    }
    saveCfg(link.id, cfg);
    setView("list");
    setEditingId(null);
  }

  function handleDelete(id: string) {
    saveLinks(links.filter(l => l.id !== id));
  }

  function handleCopy(slug: string, id: string) {
    navigator.clipboard.writeText(`${window.location.origin}/${slug}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function getCfg(link: PaymentLink): PreviewConfig {
    if (linkCfgs[link.id]) return linkCfgs[link.id];
    if (link.apercuId) {
      const apercu = previews.find(p => p.id === link.apercuId);
      if (apercu) return apercu.config;
    }
    if (previews.length > 0) return previews[0].config;
    return DEFAULT_CFG;
  }

  const editing = links.find(l => l.id === editingId);

  // ── Vue éditeur ─────────────────────────────────────────────────────────────
  if (view === "create" || (view === "edit" && editing)) {
    return (
      <div className="flex flex-col gap-4" style={{ height: "calc(100vh - 120px)" }}>
        <div className="flex items-center gap-2 text-sm">
          <button onClick={() => { setView("list"); setEditingId(null); }} className="transition-colors" style={{ color: "var(--muted)" }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--foreground)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}>
            ← Mes liens
          </button>
          <span style={{ color: "var(--card-border)" }}>/</span>
          <span className="font-semibold">{view === "edit" ? editing?.label : "Nouveau lien"}</span>
        </div>
        {merchant && (
          <div className="flex-1 min-h-0">
            <LinkEditor
              initial={view === "edit" ? editing : undefined}
              merchantUsername={merchant.username}
              previews={previews}
              onSave={handleSave}
              onCancel={() => { setView("list"); setEditingId(null); }}
            />
          </div>
        )}
      </div>
    );
  }

  // ── Vue liste ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Mes liens de paiement</h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--muted)" }}>
            Créez plusieurs liens pour différents produits ou services.
          </p>
        </div>
        <button
          onClick={() => { setEditingId(null); setView("create"); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
          style={{ background: "var(--accent)" }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          Nouveau lien
        </button>
      </div>

      {previews.length === 0 && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.15)", color: "#fbbf24" }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.3"/><path d="M8 5v4M8 11v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          <span>Aucun aperçu configuré — <button type="button" onClick={() => router.push("/dashboard/apercu")} className="underline font-medium">Créer un aperçu de paiement</button> pour personnaliser le visuel de vos liens.</span>
        </div>
      )}

      {links.length === 0 ? (
        <div
          onClick={() => setView("create")}
          className="flex flex-col items-center justify-center py-20 rounded-2xl text-center cursor-pointer transition-colors"
          style={{ background: "var(--card)", border: "2px dashed var(--card-border)" }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--accent)")}
          onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--card-border)")}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="mb-4" style={{ color: "var(--muted)" }}>
            <path d="M18 22a6 6 0 0 0 8.5 0l4-4a6.07 6.07 0 0 0-8.5-8.6l-2.3 2.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M22 18a6 6 0 0 0-8.5 0l-4 4a6.07 6.07 0 0 0 8.5 8.6l2.3-2.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <p className="text-sm font-medium">Aucun lien créé</p>
          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>Cliquez pour créer votre premier lien</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {links.map(link => (
            <LinkCard
              key={link.id}
              link={link}
              cfg={getCfg(link)}
              previews={previews}
              onEdit={() => { setEditingId(link.id); setView("edit"); }}
              onDelete={() => handleDelete(link.id)}
              onCopy={() => handleCopy(link.slug, link.id)}
              copied={copiedId === link.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
