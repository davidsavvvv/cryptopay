"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase, type Transaction } from "@/lib/supabase";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";

type Range = 7 | 14 | 30;

function getLast(days: number) {
  return Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    return d.toISOString().slice(0, 10);
  });
}

function StatCard({
  label, value, sub, trend, icon,
}: { label: string; value: string; sub?: string; trend?: "up" | "down" | "neutral"; icon: React.ReactNode }) {
  const trendColor = trend === "up" ? "#22c55e" : trend === "down" ? "#ef4444" : "var(--muted)";
  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-3 transition-all hover:-translate-y-0.5"
      style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium" style={{ color: "var(--muted)" }}>{label}</span>
        <span style={{ color: "var(--muted)", opacity: 0.6 }}>{icon}</span>
      </div>
      <div>
        <p className="text-2xl font-bold tracking-tight">{value}</p>
        {sub && <p className="text-xs mt-0.5" style={{ color: trendColor }}>{sub}</p>}
      </div>
    </div>
  );
}

const STATUS_MAP: Record<string, { bg: string; color: string; label: string; dot: string }> = {
  completed: { bg: "rgba(34,197,94,0.08)", color: "#22c55e", label: "Confirmé",   dot: "#22c55e" },
  pending:   { bg: "rgba(251,191,36,0.08)", color: "#fbbf24", label: "En attente", dot: "#fbbf24" },
  failed:    { bg: "rgba(239,68,68,0.08)",  color: "#ef4444", label: "Échoué",     dot: "#ef4444" },
};

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [businessName, setBusinessName] = useState("");
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<Range>(7);

  useEffect(() => {
    async function load() {
      const username = localStorage.getItem("cryptopay_username");
      if (!username) { setLoading(false); return; }

      const { data: merchant } = await supabase
        .from("merchants").select("*").eq("username", username).single();
      if (merchant) setBusinessName(merchant.business_name);

      const since = new Date();
      since.setDate(since.getDate() - 30);

      const { data: txs } = await supabase
        .from("transactions").select("*")
        .eq("merchant_username", username)
        .gte("created_at", since.toISOString())
        .order("created_at", { ascending: false });
      if (txs) setTransactions(txs);
      setLoading(false);
    }
    load();
  }, []);

  const days = getLast(range);
  const chartData = days.map((date) => {
    const dayTxs = transactions.filter(
      (t) => t.created_at?.slice(0, 10) === date && t.status === "completed"
    );
    return {
      date: new Date(date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }),
      volume: dayTxs.reduce((a, t) => a + Number(t.amount_eur), 0),
    };
  });

  const totalPeriod = chartData.reduce((a, d) => a + d.volume, 0);
  const completedTxs = transactions.filter((t) => t.status === "completed");
  const totalUsdt = completedTxs.reduce((a, t) => a + Number(t.amount_usdt), 0);
  const recentTxs = transactions.slice(0, 6);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir";

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">
            {greeting}{businessName ? `, ${businessName}` : ""} 👋
          </h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--muted)" }}>
            {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
          style={{ background: "rgba(34,197,94,0.08)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.15)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Polygon Mainnet actif
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Volume total reçu (USDT)"
          value={loading ? "—" : `${totalUsdt.toFixed(2)} USDT`}
          sub={loading ? "" : `${completedTxs.length} transaction${completedTxs.length > 1 ? "s" : ""} confirmée${completedTxs.length > 1 ? "s" : ""}`}
          trend="up"
          icon={
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 10l4-4 3 3 5-5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          }
        />
        <StatCard
          label="Volume période (EUR)"
          value={loading ? "—" : `€ ${totalPeriod.toFixed(2)}`}
          sub={`Sur ${range} jours`}
          trend="neutral"
          icon={
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M1.5 6.5h13" stroke="currentColor" strokeWidth="1.3"/>
            </svg>
          }
        />
        <StatCard
          label="Frais reversés"
          value={loading ? "—" : `${(totalUsdt * 0.01).toFixed(2)} USDT`}
          sub="1% par transaction"
          trend="neutral"
          icon={
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M8 5v6M6.5 6.5h2a1 1 0 0 1 0 2h-1a1 1 0 0 0 0 2H9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          }
        />
      </div>

      {/* Chart */}
      <div className="rounded-xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: "var(--card-border)" }}
        >
          <div>
            <p className="text-xs mb-1" style={{ color: "var(--muted)" }}>Volume brut — EUR</p>
            <p className="text-2xl font-bold tracking-tight">
              {loading ? "—" : `€ ${totalPeriod.toFixed(2)}`}
            </p>
          </div>
          <div
            className="flex items-center gap-1 p-1 rounded-lg"
            style={{ background: "var(--background)", border: "1px solid var(--card-border)" }}
          >
            {([7, 14, 30] as Range[]).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className="px-3 py-1.5 rounded-md text-xs font-medium transition-all"
                style={{
                  background: range === r ? "var(--accent)" : "transparent",
                  color: range === r ? "white" : "var(--muted)",
                }}
              >
                {r}j
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 pt-4 pb-6" style={{ height: 240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#6c63ff" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#6c63ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} tickFormatter={(v) => `€${v}`} />
              <Tooltip
                contentStyle={{ background: "var(--card)", border: "1px solid var(--card-border)", borderRadius: "10px", fontSize: "12px" }}
                formatter={(v: number) => [`€ ${v.toFixed(2)}`, "Volume"]}
                cursor={{ stroke: "rgba(108,99,255,0.3)", strokeWidth: 1 }}
              />
              <Area type="monotone" dataKey="volume" stroke="#6c63ff" strokeWidth={2} fill="url(#grad)" dot={false} activeDot={{ r: 4, fill: "#6c63ff", strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom grid: recent txs + quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent transactions */}
        <div
          className="lg:col-span-2 rounded-xl overflow-hidden"
          style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}
        >
          <div
            className="flex items-center justify-between px-5 py-4 border-b"
            style={{ borderColor: "var(--card-border)" }}
          >
            <h3 className="text-sm font-semibold">Transactions récentes</h3>
            <Link href="/dashboard/transactions" className="text-xs font-medium" style={{ color: "var(--accent)" }}>
              Voir tout →
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12" style={{ color: "var(--muted)" }}>
              <svg className="animate-spin mr-2" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" strokeDasharray="25 13"/>
              </svg>
              Chargement…
            </div>
          ) : recentTxs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center" style={{ color: "var(--muted)" }}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="mb-3 opacity-40">
                <rect x="4" y="8" width="24" height="16" rx="3" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M4 13h24" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              <p className="text-sm">Aucune transaction pour l&apos;instant.</p>
              <Link href="/dashboard/lien" className="mt-3 text-xs font-medium" style={{ color: "var(--accent)" }}>
                Créer un lien de paiement →
              </Link>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: "var(--card-border)" }}>
              {recentTxs.map((tx) => {
                const s = STATUS_MAP[tx.status] ?? STATUS_MAP.pending;
                return (
                  <div key={tx.id} className="flex items-center gap-4 px-5 py-3.5">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: s.bg }}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ background: s.dot }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">€ {Number(tx.amount_eur).toFixed(2)}</p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                        {tx.created_at ? new Date(tx.created_at).toLocaleString("fr-FR") : "—"}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-semibold" style={{ color: "#22c55e" }}>
                        +{Number(tx.amount_usdt).toFixed(2)} USDT
                      </p>
                      <span
                        className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                        style={{ background: s.bg, color: s.color }}
                      >
                        {s.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="flex flex-col gap-3">
          {[
            {
              href: "/dashboard/lien",
              label: "Mes liens",
              desc: "Gérer vos liens de paiement",
              icon: (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M7.5 10.5a3.5 3.5 0 0 0 5 0l2-2a3.536 3.536 0 0 0-5-5L8 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                  <path d="M10.5 7.5a3.5 3.5 0 0 0-5 0l-2 2a3.536 3.536 0 0 0 5 5L10 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
              ),
            },
            {
              href: "/dashboard/transactions",
              label: "Transactions",
              desc: "Historique complet",
              icon: (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3 5h12M3 9h8M3 13h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
              ),
            },
            {
              href: "/dashboard/parametres",
              label: "Paramètres",
              desc: "Wallet & compte",
              icon: (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
                  <path d="M9 1.5v2M9 14.5v2M1.5 9h2M14.5 9h2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
              ),
            },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3.5 px-4 py-4 rounded-xl transition-all hover:-translate-y-0.5 group"
              style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
                style={{ background: "var(--background)", color: "var(--muted)" }}
              >
                {item.icon}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs" style={{ color: "var(--muted)" }}>{item.desc}</p>
              </div>
              <svg
                width="14" height="14" viewBox="0 0 14 14" fill="none"
                className="ml-auto flex-shrink-0 transition-transform group-hover:translate-x-0.5"
                style={{ color: "var(--muted)" }}
              >
                <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          ))}

          {/* Wallet summary */}
          <div
            className="rounded-xl p-4 mt-1"
            style={{ background: "rgba(108,99,255,0.06)", border: "1px solid rgba(108,99,255,0.15)" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-medium" style={{ color: "var(--muted)" }}>Wallet connecté</span>
            </div>
            <p className="text-xs font-mono" style={{ color: "var(--muted)" }}>
              0x…<span style={{ color: "var(--foreground)" }}>Polygon</span>
            </p>
            <p className="text-lg font-bold mt-2 tracking-tight" style={{ color: "#818cf8" }}>
              {loading ? "—" : `${totalUsdt.toFixed(2)} USDT`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
