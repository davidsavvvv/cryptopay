"use client";

import { useState, useEffect, useRef } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface PreviewConfig {
  bg: string;
  cardBg: string;
  accent: string;
  textColor: string;
  borderRadius: string;
  businessName: string;
  tagline: string;
  amount: string;
  font: "inter" | "serif";
  logoUrl: string | null;
  bgImageUrl: string | null;
  buttonLabel: string;
  showBadge: boolean;
  style: "flat" | "glass" | "gradient";
}

export interface PaymentPreview {
  id: string;
  name: string;
  description: string;
  config: PreviewConfig;
  createdAt: string;
}

type EditorTab = "templates" | "ia" | "image" | "manuel";

// ── Templates ─────────────────────────────────────────────────────────────────

const TEMPLATES: { id: string; name: string; desc: string; config: PreviewConfig }[] = [
  {
    id: "dark-minimal",
    name: "Dark Minimal",
    desc: "Sobre, professionnel",
    config: { bg: "#09090b", cardBg: "#111113", accent: "#6c63ff", textColor: "#fafafa", borderRadius: "16", businessName: "Mon Business", tagline: "Paiement sécurisé", amount: "€ 99.00", font: "inter", logoUrl: null, bgImageUrl: null, buttonLabel: "Payer par carte →", showBadge: true, style: "flat" },
  },
  {
    id: "light-clean",
    name: "Light Clean",
    desc: "Clair, épuré",
    config: { bg: "#f4f4f5", cardBg: "#ffffff", accent: "#6c63ff", textColor: "#09090b", borderRadius: "20", businessName: "Mon Business", tagline: "Paiement sécurisé", amount: "€ 99.00", font: "inter", logoUrl: null, bgImageUrl: null, buttonLabel: "Payer par carte →", showBadge: true, style: "flat" },
  },
  {
    id: "glass",
    name: "Glass",
    desc: "Glassmorphism",
    config: { bg: "#0f0c29", cardBg: "rgba(255,255,255,0.09)", accent: "#a78bfa", textColor: "#ffffff", borderRadius: "24", businessName: "Mon Business", tagline: "Paiement sécurisé", amount: "€ 99.00", font: "inter", logoUrl: null, bgImageUrl: null, buttonLabel: "Payer par carte →", showBadge: true, style: "glass" },
  },
  {
    id: "ocean",
    name: "Ocean Blue",
    desc: "Finance, corporate",
    config: { bg: "#0a1628", cardBg: "#0f2040", accent: "#38bdf8", textColor: "#e2e8f0", borderRadius: "14", businessName: "Mon Business", tagline: "Paiement sécurisé", amount: "€ 99.00", font: "inter", logoUrl: null, bgImageUrl: null, buttonLabel: "Payer par carte →", showBadge: true, style: "flat" },
  },
  {
    id: "rose",
    name: "Rose Luxe",
    desc: "Mode, lifestyle",
    config: { bg: "#1a0a0f", cardBg: "#2d1520", accent: "#f43f5e", textColor: "#fdf2f4", borderRadius: "24", businessName: "Mon Business", tagline: "Paiement sécurisé", amount: "€ 99.00", font: "inter", logoUrl: null, bgImageUrl: null, buttonLabel: "Payer par carte →", showBadge: true, style: "flat" },
  },
  {
    id: "bold",
    name: "Bold Gradient",
    desc: "Impactant, premium",
    config: { bg: "#1a0533", cardBg: "#2d1b4e", accent: "#f59e0b", textColor: "#ffffff", borderRadius: "20", businessName: "Mon Business", tagline: "Paiement sécurisé", amount: "€ 99.00", font: "inter", logoUrl: null, bgImageUrl: null, buttonLabel: "Payer par carte →", showBadge: true, style: "gradient" },
  },
];

const DEFAULT_CONFIG: PreviewConfig = TEMPLATES[0].config;

// ── Live Preview component ─────────────────────────────────────────────────────

export function LivePreview({ cfg, compact = false }: { cfg: PreviewConfig; compact?: boolean }) {
  const isLight = cfg.textColor.toLowerCase() === "#09090b" || cfg.textColor.toLowerCase() === "#111111";
  const muted = isLight ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.5)";
  const p = compact ? 18 : 28;
  const fontSize = compact ? { title: 12, amount: 26, btn: 12 } : { title: 13, amount: 34, btn: 13 };

  const cardBg =
    cfg.style === "glass"
      ? cfg.cardBg
      : cfg.style === "gradient"
      ? `linear-gradient(135deg, ${cfg.cardBg} 0%, ${cfg.accent}22 100%)`
      : cfg.cardBg;

  return (
    <div
      style={{
        background:
          cfg.style === "gradient"
            ? `radial-gradient(ellipse at top, ${cfg.accent}33 0%, ${cfg.bg} 65%)`
            : cfg.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: compact ? 220 : 400,
        padding: compact ? "20px 16px" : "36px 24px",
        borderRadius: 12,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {cfg.bgImageUrl && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${cfg.bgImageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.35,
          }}
        />
      )}
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: compact ? 240 : 320 }}>
        <div
          style={{
            background: cardBg,
            backdropFilter: cfg.style === "glass" ? "blur(20px)" : undefined,
            WebkitBackdropFilter: cfg.style === "glass" ? "blur(20px)" : undefined,
            border:
              cfg.style === "glass"
                ? "1px solid rgba(255,255,255,0.15)"
                : `1px solid ${isLight ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.07)"}`,
            borderRadius: `${cfg.borderRadius}px`,
            padding: `${p}px`,
            color: cfg.textColor,
            fontFamily: cfg.font === "serif" ? "Georgia, serif" : "system-ui, sans-serif",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: compact ? 12 : 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: compact ? 28 : 34,
                  height: compact ? 28 : 34,
                  borderRadius: 8,
                  background: cfg.accent,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: fontSize.title - 1,
                  fontWeight: 700,
                  color: "#fff",
                  flexShrink: 0,
                }}
              >
                {cfg.businessName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p style={{ fontSize: fontSize.title, fontWeight: 600, lineHeight: 1.2 }}>{cfg.businessName}</p>
                {!compact && <p style={{ fontSize: 11, color: muted }}>{cfg.tagline}</p>}
              </div>
            </div>
            {cfg.showBadge && !compact && (
              <span
                style={{
                  fontSize: 10,
                  padding: "3px 8px",
                  borderRadius: 100,
                  background: "rgba(34,197,94,0.12)",
                  color: "#22c55e",
                  border: "1px solid rgba(34,197,94,0.2)",
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                }}
              >
                ✓ Sécurisé
              </span>
            )}
          </div>

          <div style={{ height: 1, background: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)", marginBottom: compact ? 10 : 16 }} />

          {!compact && <p style={{ fontSize: 11, color: muted, marginBottom: 4 }}>Montant à payer</p>}
          <p style={{ fontSize: fontSize.amount, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: compact ? 10 : 20, lineHeight: 1 }}>
            {cfg.amount}
          </p>

          <button
            style={{
              width: "100%",
              padding: compact ? "9px" : "13px",
              borderRadius: `${Math.max(6, parseInt(cfg.borderRadius) - 6)}px`,
              background: cfg.accent,
              color: "#fff",
              fontWeight: 600,
              fontSize: fontSize.btn,
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {cfg.buttonLabel}
          </button>

          {!compact && (
            <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 12 }}>
              {["Visa", "Mastercard", "3DS"].map((b) => (
                <span key={b} style={{ fontSize: 10, color: muted }}>{b}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Templates tab ─────────────────────────────────────────────────────────────

function TemplatesTab({ cfg, onChange }: { cfg: PreviewConfig; onChange: (c: PreviewConfig) => void }) {
  return (
    <div className="space-y-3">
      <p className="text-xs" style={{ color: "var(--muted)" }}>Choisissez un style de départ.</p>
      <div className="grid grid-cols-2 gap-2.5">
        {TEMPLATES.map((t) => {
          const active = cfg.bg === t.config.bg && cfg.accent === t.config.accent;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(t.config)}
              className="text-left p-3 rounded-xl transition-all"
              style={{
                background: active ? "rgba(108,99,255,0.07)" : "var(--background)",
                border: `1px solid ${active ? "var(--accent)" : "var(--card-border)"}`,
              }}
            >
              <div
                className="w-full h-10 rounded-lg mb-2 relative overflow-hidden"
                style={{
                  background:
                    t.config.style === "gradient"
                      ? `linear-gradient(135deg, ${t.config.bg}, ${t.config.accent}55)`
                      : t.config.bg,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    bottom: 5,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: t.config.accent,
                    height: 7,
                    width: 54,
                    borderRadius: 3,
                  }}
                />
              </div>
              <p className="text-xs font-semibold">{t.name}</p>
              <p className="text-[10px] mt-0.5" style={{ color: "var(--muted)" }}>{t.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── IA tab ────────────────────────────────────────────────────────────────────

const SUGGESTIONS = [
  "Luxueux pour une boutique de mode",
  "Minimaliste blanc pour un studio",
  "Sombre et tech pour un SaaS",
  "Chaud et artisanal pour un créateur",
];

function IATab({ onChange }: { onChange: (c: PreviewConfig) => void }) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  function generate() {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      const l = prompt.toLowerCase();
      let t = TEMPLATES[0];
      if (l.includes("blanc") || l.includes("clair") || l.includes("light") || l.includes("studio") || l.includes("minimaliste")) t = TEMPLATES[1];
      else if (l.includes("verre") || l.includes("glass")) t = TEMPLATES[2];
      else if (l.includes("bleu") || l.includes("finance") || l.includes("corporate")) t = TEMPLATES[3];
      else if (l.includes("luxe") || l.includes("rose") || l.includes("mode") || l.includes("mode")) t = TEMPLATES[4];
      else if (l.includes("gradient") || l.includes("bold") || l.includes("coloré") || l.includes("premium")) t = TEMPLATES[5];
      else if (l.includes("saas") || l.includes("tech") || l.includes("sombre")) t = TEMPLATES[0];
      onChange(t.config);
      setResult(t.name);
      setLoading(false);
    }, 1500);
  }

  return (
    <div className="space-y-3">
      <p className="text-xs" style={{ color: "var(--muted)" }}>
        Décrivez l&apos;ambiance souhaitée — l&apos;IA choisit le meilleur style.
      </p>

      <div className="space-y-1.5">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setPrompt(s)}
            className="w-full text-left text-xs px-3 py-2 rounded-lg transition-colors"
            style={{ border: "1px solid var(--card-border)", color: "var(--muted-light)", background: "var(--background)" }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#52525b")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--card-border)")}
          >
            &ldquo;{s}&rdquo;
          </button>
        ))}
      </div>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); generate(); } }}
        placeholder="Ex : moderne, tons violets, pour un coach en ligne…"
        rows={3}
        className="w-full text-xs px-3 py-2.5 rounded-xl resize-none outline-none"
        style={{
          background: "var(--background)",
          border: "1px solid var(--card-border)",
          color: "var(--foreground)",
          lineHeight: 1.6,
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--card-border)")}
      />

      <button
        onClick={generate}
        type="button"
        disabled={!prompt.trim() || loading}
        className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
        style={{
          background: !prompt.trim() || loading ? "var(--card-border)" : "var(--accent)",
          color: !prompt.trim() || loading ? "var(--muted)" : "white",
          cursor: !prompt.trim() || loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? (
          <>
            <svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="22 8" />
            </svg>
            Génération en cours…
          </>
        ) : (
          "✦ Générer avec l'IA"
        )}
      </button>

      {result && (
        <div
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs"
          style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)", color: "#22c55e" }}
        >
          ✓ Style appliqué : <strong>{result}</strong> — vous pouvez affiner dans &quot;Manuel&quot;
        </div>
      )}
    </div>
  );
}

// ── Image tab ─────────────────────────────────────────────────────────────────

function ImageTab({ cfg, onChange }: { cfg: PreviewConfig; onChange: (c: PreviewConfig) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    onChange({ ...cfg, bgImageUrl: url });
  }

  return (
    <div className="space-y-3">
      <p className="text-xs" style={{ color: "var(--muted)" }}>
        Choisissez une image de fond pour votre page de paiement.
      </p>

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragEnter={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files[0];
          if (file) handleFile(file);
        }}
        className="rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all"
        style={{
          border: `2px dashed ${dragging ? "var(--accent)" : "var(--card-border)"}`,
          background: dragging ? "rgba(108,99,255,0.04)" : "var(--background)",
          padding: cfg.bgImageUrl ? "12px" : "36px 16px",
          minHeight: 100,
        }}
      >
        {cfg.bgImageUrl ? (
          <div className="w-full relative">
            <img
              src={cfg.bgImageUrl}
              alt="Fond"
              className="w-full rounded-lg object-cover"
              style={{ maxHeight: 120 }}
            />
            <div
              className="absolute inset-0 flex items-center justify-center rounded-lg opacity-0 hover:opacity-100 transition-opacity"
              style={{ background: "rgba(0,0,0,0.5)", color: "white", fontSize: 12, fontWeight: 600 }}
            >
              Changer l&apos;image
            </div>
          </div>
        ) : (
          <>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ color: "var(--muted)" }}>
              <rect x="2" y="6" width="24" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.3" />
              <circle cx="9.5" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.3" />
              <path d="M2 19l6-5 4 4 4-3 10 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-xs text-center" style={{ color: "var(--muted)" }}>
              Glissez une image ici<br />
              <span style={{ opacity: 0.6 }}>ou cliquez — PNG, JPG, WebP</span>
            </p>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />

      {cfg.bgImageUrl && (
        <button
          onClick={() => onChange({ ...cfg, bgImageUrl: null })}
          className="w-full py-2 rounded-xl text-xs font-medium transition-colors"
          style={{ border: "1px solid var(--card-border)", color: "var(--muted)" }}
        >
          Supprimer l&apos;image
        </button>
      )}
    </div>
  );
}

// ── Manuel tab ────────────────────────────────────────────────────────────────

function ManuelTab({ cfg, onChange }: { cfg: PreviewConfig; onChange: (c: PreviewConfig) => void }) {
  const inputStyle: React.CSSProperties = {
    background: "var(--background)",
    border: "1px solid var(--card-border)",
    color: "var(--foreground)",
    width: "100%",
    padding: "8px 12px",
    borderRadius: "8px",
    fontSize: "13px",
    outline: "none",
  };

  function onFocus(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
    e.currentTarget.style.borderColor = "var(--accent)";
  }
  function onBlur(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
    e.currentTarget.style.borderColor = "var(--card-border)";
  }

  const textFields: { label: string; key: keyof PreviewConfig; placeholder: string }[] = [
    { label: "Nom affiché", key: "businessName", placeholder: "Mon Business" },
    { label: "Tagline", key: "tagline", placeholder: "Paiement sécurisé" },
    { label: "Montant affiché", key: "amount", placeholder: "€ 99.00" },
    { label: "Texte du bouton", key: "buttonLabel", placeholder: "Payer par carte →" },
  ];

  const colorFields: { label: string; key: "bg" | "accent" | "textColor" }[] = [
    { label: "Fond", key: "bg" },
    { label: "Accent", key: "accent" },
    { label: "Texte", key: "textColor" },
  ];

  function safeHex(val: string): string {
    if (/^#[0-9a-fA-F]{6}$/.test(val)) return val;
    return "#111111";
  }

  return (
    <div className="space-y-4">
      {/* Text fields */}
      {textFields.map((f) => (
        <div key={f.key}>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--muted)" }}>{f.label}</label>
          <input
            type="text"
            value={cfg[f.key] as string}
            placeholder={f.placeholder}
            onChange={(e) => onChange({ ...cfg, [f.key]: e.target.value })}
            style={inputStyle}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </div>
      ))}

      {/* Colors */}
      <div>
        <label className="block text-xs font-medium mb-2" style={{ color: "var(--muted)" }}>Couleurs</label>
        <div className="grid grid-cols-3 gap-2">
          {colorFields.map((f) => (
            <div key={f.key} className="flex flex-col items-center gap-1.5">
              <input
                type="color"
                value={safeHex(cfg[f.key])}
                onChange={(e) => onChange({ ...cfg, [f.key]: e.target.value })}
                style={{
                  width: "100%",
                  height: 40,
                  border: "1px solid var(--card-border)",
                  borderRadius: 8,
                  cursor: "pointer",
                  padding: 3,
                  background: "var(--background)",
                }}
              />
              <span className="text-[10px]" style={{ color: "var(--muted)" }}>{f.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Card bg */}
      <div>
        <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--muted)" }}>Fond de la carte</label>
        <input
          type="color"
          value={safeHex(cfg.cardBg)}
          onChange={(e) => onChange({ ...cfg, cardBg: e.target.value })}
          style={{
            width: "100%",
            height: 40,
            border: "1px solid var(--card-border)",
            borderRadius: 8,
            cursor: "pointer",
            padding: 3,
            background: "var(--background)",
          }}
        />
      </div>

      {/* Border radius */}
      <div>
        <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--muted)" }}>
          Arrondi — {cfg.borderRadius}px
        </label>
        <input
          type="range"
          min="0"
          max="32"
          value={cfg.borderRadius}
          onChange={(e) => onChange({ ...cfg, borderRadius: e.target.value })}
          style={{ width: "100%", accentColor: "var(--accent)" }}
        />
      </div>

      {/* Style */}
      <div>
        <label className="block text-xs font-medium mb-2" style={{ color: "var(--muted)" }}>Style de carte</label>
        <div className="grid grid-cols-3 gap-2">
          {(["flat", "glass", "gradient"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onChange({ ...cfg, style: s })}
              className="py-2 rounded-lg text-xs font-medium capitalize transition-all"
              style={{
                background: cfg.style === s ? "rgba(108,99,255,0.12)" : "var(--background)",
                border: `1px solid ${cfg.style === s ? "var(--accent)" : "var(--card-border)"}`,
                color: cfg.style === s ? "var(--accent)" : "var(--muted)",
              }}
            >
              {s === "flat" ? "Plat" : s === "glass" ? "Verre" : "Dégradé"}
            </button>
          ))}
        </div>
      </div>

      {/* Font */}
      <div>
        <label className="block text-xs font-medium mb-2" style={{ color: "var(--muted)" }}>Police</label>
        <div className="grid grid-cols-2 gap-2">
          {([["inter", "Moderne"], ["serif", "Classique"]] as const).map(([val, label]) => (
            <button
              key={val}
              type="button"
              onClick={() => onChange({ ...cfg, font: val })}
              className="py-2 rounded-lg text-xs font-medium transition-all"
              style={{
                background: cfg.font === val ? "rgba(108,99,255,0.12)" : "var(--background)",
                border: `1px solid ${cfg.font === val ? "var(--accent)" : "var(--card-border)"}`,
                color: cfg.font === val ? "var(--accent)" : "var(--muted)",
                fontFamily: val === "serif" ? "Georgia, serif" : "inherit",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Badge */}
      <div>
        <label className="block text-xs font-medium mb-2" style={{ color: "var(--muted)" }}>Options</label>
        <button
          type="button"
          onClick={() => onChange({ ...cfg, showBadge: !cfg.showBadge })}
          className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-xs transition-all"
          style={{
            border: `1px solid ${cfg.showBadge ? "var(--accent)" : "var(--card-border)"}`,
            background: cfg.showBadge ? "rgba(108,99,255,0.06)" : "var(--background)",
            color: cfg.showBadge ? "var(--accent)" : "var(--muted)",
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              border: `1.5px solid ${cfg.showBadge ? "var(--accent)" : "var(--muted)"}`,
              background: cfg.showBadge ? "var(--accent)" : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {cfg.showBadge && (
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <path d="M1.5 4l2 2 3-3" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          Afficher le badge &ldquo;✓ Sécurisé&rdquo;
        </button>
      </div>
    </div>
  );
}

// ── Editor shell (tabs) ───────────────────────────────────────────────────────

const EDITOR_TABS: { id: EditorTab; label: string }[] = [
  { id: "templates", label: "Templates" },
  { id: "ia",        label: "✦ IA" },
  { id: "image",     label: "Image" },
  { id: "manuel",    label: "Manuel" },
];

function EditorPanel({ cfg, onChange }: { cfg: PreviewConfig; onChange: (c: PreviewConfig) => void }) {
  const [tab, setTab] = useState<EditorTab>("templates");

  return (
    <div className="flex flex-col h-full overflow-hidden rounded-xl" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
      {/* Tabs */}
      <div className="flex flex-shrink-0 border-b" style={{ borderColor: "var(--card-border)" }}>
        {EDITOR_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className="flex-1 py-3 text-xs font-medium transition-colors"
            style={{
              color: tab === t.id ? "var(--accent)" : "var(--muted)",
              borderBottom: tab === t.id ? "2px solid var(--accent)" : "2px solid transparent",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {tab === "templates" && <TemplatesTab cfg={cfg} onChange={onChange} />}
        {tab === "ia"        && <IATab onChange={onChange} />}
        {tab === "image"     && <ImageTab cfg={cfg} onChange={onChange} />}
        {tab === "manuel"    && <ManuelTab cfg={cfg} onChange={onChange} />}
      </div>
    </div>
  );
}

// ── Form création / édition ───────────────────────────────────────────────────

function PreviewForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: PaymentPreview;
  onSave: (p: PaymentPreview) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [cfg, setCfg] = useState<PreviewConfig>(initial?.config ?? DEFAULT_CONFIG);

  // Sync businessName dans cfg quand l'utilisateur tape dans le champ dédié
  function handleDisplayName(val: string) {
    setCfg((c) => ({ ...c, businessName: val }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      id: initial?.id ?? Date.now().toString(),
      name: name.trim(),
      description: description.trim(),
      config: cfg,
      createdAt: initial?.createdAt ?? new Date().toISOString(),
    });
  }

  const fieldStyle: React.CSSProperties = {
    background: "var(--background)",
    border: "1px solid var(--card-border)",
    color: "var(--foreground)",
    width: "100%",
    padding: "10px 12px",
    borderRadius: "10px",
    fontSize: "13px",
    outline: "none",
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

      {/* ① Preview EN HAUT — toujours visible */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}
      >
        <div
          className="flex items-center justify-between px-4 py-2.5 border-b"
          style={{ borderColor: "var(--card-border)" }}
        >
          <div className="flex items-center gap-1.5">
            {["bg-red-500", "bg-yellow-500", "bg-green-500"].map((c) => (
              <div key={c} className={`w-2 h-2 rounded-full ${c} opacity-50`} />
            ))}
            <span className="ml-2 text-xs font-mono" style={{ color: "var(--muted)" }}>cryptopay.app/…</span>
          </div>
          <span
            className="text-[11px] px-2 py-0.5 rounded-full"
            style={{ background: "rgba(34,197,94,0.08)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.15)" }}
          >
            ● En direct
          </span>
        </div>
        <div className="p-5">
          <LivePreview cfg={cfg} />
        </div>
      </div>

      {/* ② 3 champs : nom interne / nom affiché / description */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--muted)" }}>
            Nom interne *
            <span className="ml-1 font-normal" style={{ color: "var(--muted)", opacity: 0.6 }}>(pour vous souvenir)</span>
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Ex : Boutique Mode, Coaching…"
            style={fieldStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--card-border)")}
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--muted)" }}>
            Nom sur l&apos;aperçu
            <span className="ml-1 font-normal" style={{ color: "var(--muted)", opacity: 0.6 }}>(vu par le client)</span>
          </label>
          <input
            value={cfg.businessName}
            onChange={(e) => handleDisplayName(e.target.value)}
            placeholder="Mon Business"
            style={fieldStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--card-border)")}
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--muted)" }}>Description</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex : Page pour mes formations"
            style={fieldStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--card-border)")}
          />
        </div>
      </div>

      {/* ③ Éditeur de style */}
      <div style={{ minHeight: 400 }}>
        <EditorPanel cfg={cfg} onChange={setCfg} />
      </div>

      {/* ④ Actions */}
      <div className="flex gap-3">
        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
          style={{ background: "var(--accent)" }}
        >
          {initial ? "Enregistrer les modifications" : "Créer l'aperçu"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 rounded-xl text-sm font-medium transition-colors"
          style={{ background: "var(--background)", border: "1px solid var(--card-border)", color: "var(--muted)" }}
        >
          Annuler
        </button>
      </div>
    </form>
  );
}

// ── List view ─────────────────────────────────────────────────────────────────

const STYLE_LABEL: Record<string, string> = { flat: "Plat", glass: "Verre", gradient: "Dégradé" };

function ListView({
  previews,
  onNew,
  onEdit,
  onDelete,
}: {
  previews: PaymentPreview[];
  onNew: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [selected, setSelected] = useState<string | null>(previews[0]?.id ?? null);
  const selectedPreview = previews.find((p) => p.id === selected);

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Mes aperçus de paiement</h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--muted)" }}>
            Créez plusieurs visuels et associez-les à vos liens de paiement.
          </p>
        </div>
        <button
          onClick={onNew}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
          style={{ background: "var(--accent)" }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Nouvel aperçu
        </button>
      </div>

      {previews.length === 0 ? (
        <div
          onClick={onNew}
          className="flex flex-col items-center justify-center py-20 rounded-2xl text-center cursor-pointer transition-colors"
          style={{ background: "var(--card)", border: "2px dashed var(--card-border)" }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--card-border)")}
        >
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="mb-4" style={{ color: "var(--muted)" }}>
            <rect x="4" y="10" width="32" height="20" rx="4" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="20" cy="20" r="5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M4 17h32" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <p className="text-sm font-medium">Aucun aperçu créé</p>
          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>Cliquez pour créer votre premier aperçu</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_360px] gap-5 items-start">
          {/* Cards list */}
          <div className="space-y-3">
            {previews.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelected(p.id)}
                className="rounded-xl overflow-hidden cursor-pointer transition-all"
                style={{
                  background: "var(--card)",
                  border: `1px solid ${selected === p.id ? "var(--accent)" : "var(--card-border)"}`,
                  boxShadow: selected === p.id ? "0 0 0 1px var(--accent)20" : "none",
                }}
              >
                {/* Header */}
                <div
                  className="px-5 py-4 border-b flex items-center justify-between"
                  style={{ borderColor: "var(--card-border)" }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Color swatch */}
                    <div
                      className="w-9 h-9 rounded-lg flex-shrink-0"
                      style={{
                        background:
                          p.config.style === "gradient"
                            ? `linear-gradient(135deg, ${p.config.bg}, ${p.config.accent})`
                            : p.config.bg,
                        border: `2px solid ${p.config.accent}55`,
                      }}
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">{p.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: "rgba(108,99,255,0.1)", color: "var(--accent)" }}
                        >
                          {STYLE_LABEL[p.config.style]}
                        </span>
                        {p.description && (
                          <span className="text-xs truncate" style={{ color: "var(--muted)" }}>
                            {p.description}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); onEdit(p.id); }}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                      style={{ background: "var(--background)", border: "1px solid var(--card-border)", color: "var(--muted)" }}
                    >
                      ✏️ Modifier
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDelete(p.id); }}
                      className="p-1.5 rounded-lg transition-all"
                      style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", color: "#ef4444" }}
                    >
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                        <path d="M2 3h9M5 3V2h3v1M4 3v8h5V3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Mini preview inside card */}
                <div className="px-5 py-4">
                  <LivePreview cfg={p.config} compact />
                  <p className="text-[11px] mt-3 text-right" style={{ color: "var(--muted)" }}>
                    Créé le {new Date(p.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Live preview panel */}
          {selectedPreview && (
            <div
              className="rounded-xl overflow-hidden sticky top-6"
              style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}
            >
              <div
                className="flex items-center justify-between px-4 py-3 border-b"
                style={{ borderColor: "var(--card-border)" }}
              >
                <div className="flex items-center gap-1.5">
                  {["bg-red-500", "bg-yellow-500", "bg-green-500"].map((c) => (
                    <div key={c} className={`w-2 h-2 rounded-full ${c} opacity-50`} />
                  ))}
                  <span className="ml-1.5 text-[11px] font-mono truncate" style={{ color: "var(--muted)", maxWidth: 160 }}>
                    cryptopay.app/…
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "rgba(34,197,94,0.08)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.15)" }}>
                  Aperçu
                </span>
              </div>
              <div className="p-4">
                <LivePreview cfg={selectedPreview.config} />
              </div>
              <div className="px-4 py-3 border-t" style={{ borderColor: "var(--card-border)" }}>
                <p className="text-xs font-semibold truncate">{selectedPreview.name}</p>
                {selectedPreview.description && (
                  <p className="text-xs mt-0.5 truncate" style={{ color: "var(--muted)" }}>{selectedPreview.description}</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

type View = "list" | "create" | "edit";

export default function ApercuPage() {
  const [previews, setPreviews] = useState<PaymentPreview[]>([]);
  const [view, setView] = useState<View>("list");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const username = localStorage.getItem("cryptopay_username") ?? "demo";
    const stored = localStorage.getItem(`cryptopay_apercus_${username}`);
    if (stored) setPreviews(JSON.parse(stored));
  }, []);

  function persist(list: PaymentPreview[]) {
    const username = localStorage.getItem("cryptopay_username") ?? "demo";
    setPreviews(list);
    localStorage.setItem(`cryptopay_apercus_${username}`, JSON.stringify(list));
  }

  function handleCreate(p: PaymentPreview) {
    persist([...previews, p]);
    setView("list");
  }

  function handleEdit(p: PaymentPreview) {
    persist(previews.map((x) => (x.id === p.id ? p : x)));
    setView("list");
    setEditingId(null);
  }

  function handleDelete(id: string) {
    persist(previews.filter((x) => x.id !== id));
  }

  const editing = previews.find((p) => p.id === editingId);

  // Create / Edit view
  if (view === "create" || (view === "edit" && editing)) {
    return (
      <div className="space-y-5 max-w-6xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={() => { setView("list"); setEditingId(null); }}
            className="transition-colors"
            style={{ color: "var(--muted)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--foreground)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
          >
            ← Mes aperçus
          </button>
          <span style={{ color: "var(--card-border)" }}>/</span>
          <span className="font-semibold">{view === "edit" ? editing?.name : "Nouvel aperçu"}</span>
        </div>

        <PreviewForm
          initial={view === "edit" ? editing : undefined}
          onSave={view === "edit" ? handleEdit : handleCreate}
          onCancel={() => { setView("list"); setEditingId(null); }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      <ListView
        previews={previews}
        onNew={() => setView("create")}
        onEdit={(id) => { setEditingId(id); setView("edit"); }}
        onDelete={handleDelete}
      />
    </div>
  );
}
