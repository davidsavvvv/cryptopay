"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/dashboard",              icon: "🏠", label: "Accueil" },
  { href: "/dashboard/transactions", icon: "📊", label: "Transactions" },
  { href: "/dashboard/lien",         icon: "🔗", label: "Créer un lien" },
  { href: "/dashboard/parametres",   icon: "⚙️", label: "Paramètres" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      {/* Sidebar */}
      <aside
        className="flex-shrink-0 flex flex-col border-r transition-all duration-300"
        style={{
          width: collapsed ? "64px" : "240px",
          background: "var(--card)",
          borderColor: "var(--card-border)",
        }}
      >
        {/* Logo + bouton réduire */}
        <div className="flex items-center justify-between px-4 py-5 border-b" style={{ borderColor: "var(--card-border)" }}>
          {!collapsed && (
            <Link href="/" className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                style={{ background: "var(--accent)" }}
              >
                CP
              </div>
              <span className="font-semibold">CryptoPay</span>
            </Link>
          )}
          {collapsed && (
            <Link href="/" className="mx-auto">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                style={{ background: "var(--accent)" }}
              >
                CP
              </div>
            </Link>
          )}
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="p-1.5 rounded-lg transition-all"
              style={{ color: "var(--muted)" }}
              title="Réduire"
            >
              ◀
            </button>
          )}
        </div>

        {/* Bouton agrandir quand réduit */}
        {collapsed && (
          <div className="flex justify-center py-3 border-b" style={{ borderColor: "var(--card-border)" }}>
            <button
              onClick={() => setCollapsed(false)}
              className="p-1.5 rounded-lg transition-all"
              style={{ color: "var(--muted)" }}
              title="Agrandir"
            >
              ▶
            </button>
          </div>
        )}

        {/* Merchant info */}
        {!collapsed && (
          <div className="px-4 py-4 border-b" style={{ borderColor: "var(--card-border)" }}>
            <div className="flex items-center gap-3 px-2 py-2 rounded-lg" style={{ background: "var(--background)" }}>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                style={{ background: "var(--accent)" }}
              >
                M
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">Mon compte</p>
                <p className="text-xs truncate" style={{ color: "var(--muted)" }}>Marchand</p>
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: isActive ? "var(--accent)" : "transparent",
                  color: isActive ? "white" : "var(--muted)",
                  justifyContent: collapsed ? "center" : "flex-start",
                }}
                title={collapsed ? item.label : ""}
              >
                <span className="text-base">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        {!collapsed && (
          <div className="px-3 py-4 border-t" style={{ borderColor: "var(--card-border)" }}>
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
              style={{ color: "var(--muted)" }}
            >
              <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
              <span>Polygon Mainnet</span>
            </div>
          </div>
        )}

        {collapsed && (
          <div className="flex justify-center py-4 border-t" style={{ borderColor: "var(--card-border)" }}>
            <span className="w-2 h-2 rounded-full bg-green-400" title="Polygon Mainnet" />
          </div>
        )}
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: "var(--card-border)", background: "var(--card)" }}
        >
          <h1 className="font-semibold text-base">
            {navItems.find((i) => i.href === pathname)?.label ?? "Dashboard"}
          </h1>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-sm px-3 py-1.5 rounded-lg transition-all"
              style={{ color: "var(--muted)", border: "1px solid var(--card-border)" }}
            >
              Voir le site
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
