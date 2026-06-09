"use client";

import { useState, useEffect } from "react";
import { type Transaction } from "@/lib/supabase";
import { createSupabaseBrowser } from "@/lib/supabase-browser";

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  completed: { bg: "rgba(34,197,94,0.1)",  color: "#22c55e", label: "Confirmé" },
  pending:   { bg: "rgba(251,191,36,0.1)", color: "#fbbf24", label: "En attente" },
  failed:    { bg: "rgba(239,68,68,0.1)",  color: "#ef4444", label: "Échoué" },
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createSupabaseBrowser();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      const { data: merchant } = await supabase.from("merchants").select("username").eq("user_id", user.id).single();
      if (!merchant) { setLoading(false); return; }
      const { data } = await supabase
        .from("transactions")
        .select("*")
        .eq("merchant_username", merchant.username)
        .order("created_at", { ascending: false });
      if (data) setTransactions(data);
      setLoading(false);
    }
    load();
  }, []);

  const totalReceived = transactions
    .filter((t) => t.status === "completed")
    .reduce((acc, t) => acc + Number(t.amount_usdt), 0);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total reçu",     value: `${totalReceived.toFixed(2)} USDT` },
          { label: "Transactions",   value: transactions.length.toString() },
          { label: "Frais reversés", value: `${(totalReceived * 0.01).toFixed(2)} USDT` },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl p-5" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
            <p className="text-xs mb-2" style={{ color: "var(--muted)" }}>{stat.label}</p>
            <p className="text-2xl font-bold">{loading ? "…" : stat.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: "var(--card-border)" }}>
          <h2 className="font-semibold">Toutes les transactions</h2>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-16" style={{ color: "var(--muted)" }}>
            Chargement…
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center" style={{ color: "var(--muted)" }}>
            <span className="text-3xl mb-3">📭</span>
            <p className="text-sm">Aucune transaction pour l&apos;instant.</p>
            <p className="text-xs mt-1">Les paiements reçus apparaîtront ici.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--card-border)" }}>
                  {["Date", "Montant EUR", "Reçu USDT", "Frais", "Statut", "Tx Hash"].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-medium" style={{ color: "var(--muted)" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, i) => {
                  const s = STATUS_STYLES[tx.status] ?? STATUS_STYLES.pending;
                  return (
                    <tr key={tx.id} style={{ borderBottom: i < transactions.length - 1 ? "1px solid var(--card-border)" : "none" }}>
                      <td className="px-6 py-4 font-mono text-xs" style={{ color: "var(--muted)" }}>
                        {tx.created_at ? new Date(tx.created_at).toLocaleString("fr-FR") : "—"}
                      </td>
                      <td className="px-6 py-4 font-semibold">€ {Number(tx.amount_eur).toFixed(2)}</td>
                      <td className="px-6 py-4 font-semibold" style={{ color: "#22c55e" }}>
                        {Number(tx.amount_usdt).toFixed(2)} USDT
                      </td>
                      <td className="px-6 py-4 text-xs" style={{ color: "var(--muted)" }}>{Number(tx.fee_usdt).toFixed(2)} USDT</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ background: s.bg, color: s.color }}>
                          {s.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs" style={{ color: "var(--muted)" }}>{tx.tx_hash ?? "—"}</td>
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
