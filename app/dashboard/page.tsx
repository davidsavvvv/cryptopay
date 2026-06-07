"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase, type Transaction } from "@/lib/supabase";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Range = 7 | 14 | 30;

function getLast(days: number) {
  return Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    return d.toISOString().slice(0, 10);
  });
}

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
        .from("merchants")
        .select("*")
        .eq("username", username)
        .single();
      if (merchant) setBusinessName(merchant.business_name);

      const since = new Date();
      since.setDate(since.getDate() - 30);

      const { data: txs } = await supabase
        .from("transactions")
        .select("*")
        .eq("merchant_username", username)
        .gte("created_at", since.toISOString())
        .order("created_at", { ascending: false });
      if (txs) setTransactions(txs);
      setLoading(false);
    }
    load();
  }, []);

  // Construire les données du graphique
  const days = getLast(range);
  const chartData = days.map((date) => {
    const dayTxs = transactions.filter(
      (t) => t.created_at?.slice(0, 10) === date && t.status === "completed"
    );
    const total = dayTxs.reduce((acc, t) => acc + Number(t.amount_eur), 0);
    return {
      date: new Date(date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }),
      volume: total,
    };
  });

  const totalPeriod = chartData.reduce((acc, d) => acc + d.volume, 0);
  const totalUsdt   = transactions.filter((t) => t.status === "completed").reduce((acc, t) => acc + Number(t.amount_usdt), 0);
  const recentTxs   = transactions.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Bonjour */}
      <div>
        <h2 className="text-xl font-bold mb-0.5">
          Bonjour{businessName ? `, ${businessName}` : ""} 👋
        </h2>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Voici un résumé de votre activité.
        </p>
      </div>

      {/* Graphique principal */}
      <div className="rounded-xl p-6" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
        {/* Header graphique */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-xs mb-1" style={{ color: "var(--muted)" }}>Volume brut sur la période</p>
            <p className="text-3xl font-bold">
              {loading ? "…" : `€ ${totalPeriod.toFixed(2)}`}
            </p>
          </div>
          {/* Sélecteur de période */}
          <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: "var(--background)", border: "1px solid var(--card-border)" }}>
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
                {r} jours
              </button>
            ))}
          </div>
        </div>

        {/* Courbe */}
        <div style={{ height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6c63ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6c63ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#8a94a8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#8a94a8" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `€${v}`}
              />
              <Tooltip
                contentStyle={{
                  background: "#0e1422",
                  border: "1px solid #1e2a42",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "#e8eaf0",
                }}
                formatter={(value: number) => [`€ ${value.toFixed(2)}`, "Volume"]}
              />
              <Area
                type="monotone"
                dataKey="volume"
                stroke="#6c63ff"
                strokeWidth={2}
                fill="url(#colorVolume)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total reçu (USDT)",  value: `${totalUsdt.toFixed(2)} USDT`, icon: "💰" },
          { label: "Transactions",        value: transactions.length.toString(),  icon: "📊" },
          { label: "Frais reversés",      value: `${(totalUsdt * 0.01).toFixed(2)} USDT`, icon: "⚡" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl p-5" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
            <div className="flex items-center gap-2 mb-2">
              <span>{stat.icon}</span>
              <p className="text-xs" style={{ color: "var(--muted)" }}>{stat.label}</p>
            </div>
            <p className="text-2xl font-bold">{loading ? "…" : stat.value}</p>
          </div>
        ))}
      </div>

      {/* Raccourcis */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { href: "/dashboard/transactions", icon: "📊", label: "Voir les transactions" },
          { href: "/dashboard/lien",         icon: "🔗", label: "Mes liens de paiement" },
          { href: "/dashboard/parametres",   icon: "⚙️", label: "Paramètres du compte" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-4 py-4 rounded-xl transition-all hover:-translate-y-0.5"
            style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-sm font-medium">{item.label}</span>
            <span className="ml-auto" style={{ color: "var(--muted)" }}>→</span>
          </Link>
        ))}
      </div>

      {/* Dernières transactions */}
      <div className="rounded-xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: "var(--card-border)" }}>
          <h2 className="font-semibold">Dernières transactions</h2>
          <Link href="/dashboard/transactions" className="text-xs" style={{ color: "var(--accent)" }}>
            Voir tout →
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12" style={{ color: "var(--muted)" }}>
            Chargement…
          </div>
        ) : recentTxs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center" style={{ color: "var(--muted)" }}>
            <span className="text-3xl mb-3">📭</span>
            <p className="text-sm">Aucune transaction pour l&apos;instant.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--card-border)" }}>
                  {["Date", "Montant EUR", "Reçu USDT", "Statut"].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-medium" style={{ color: "var(--muted)" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentTxs.map((tx, i) => {
                  const statusMap: Record<string, { bg: string; color: string; label: string }> = {
                    completed: { bg: "rgba(34,197,94,0.1)",  color: "#22c55e", label: "Confirmé" },
                    pending:   { bg: "rgba(251,191,36,0.1)", color: "#fbbf24", label: "En attente" },
                    failed:    { bg: "rgba(239,68,68,0.1)",  color: "#ef4444", label: "Échoué" },
                  };
                  const s = statusMap[tx.status] ?? statusMap.pending;
                  return (
                    <tr key={tx.id} style={{ borderBottom: i < recentTxs.length - 1 ? "1px solid var(--card-border)" : "none" }}>
                      <td className="px-6 py-4 font-mono text-xs" style={{ color: "var(--muted)" }}>
                        {tx.created_at ? new Date(tx.created_at).toLocaleString("fr-FR") : "—"}
                      </td>
                      <td className="px-6 py-4 font-semibold">€ {Number(tx.amount_eur).toFixed(2)}</td>
                      <td className="px-6 py-4 font-semibold" style={{ color: "#22c55e" }}>
                        {Number(tx.amount_usdt).toFixed(2)} USDT
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ background: s.bg, color: s.color }}>
                          {s.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
