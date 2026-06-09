"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";

const navItems = [
  {
    href: "/dashboard",
    label: "Vue d'ensemble",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="1.5" y="1.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="10.5" y="1.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="1.5" y="10.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="10.5" y="10.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
      </svg>
    ),
  },
  {
    href: "/dashboard/transactions",
    label: "Transactions",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M3 5h12M3 9h8M3 13h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <circle cx="14" cy="13" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
      </svg>
    ),
  },
  {
    href: "/dashboard/lien",
    label: "Liens de paiement",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M7.5 10.5a3.5 3.5 0 0 0 5 0l2-2a3.536 3.536 0 0 0-5-5L8 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M10.5 7.5a3.5 3.5 0 0 0-5 0l-2 2a3.536 3.536 0 0 0 5 5L10 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: "/dashboard/apercu",
    label: "Aperçu de paiement",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="1.5" y="3.5" width="15" height="11" rx="2" stroke="currentColor" strokeWidth="1.4"/>
        <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M1.5 7h15" stroke="currentColor" strokeWidth="1.4"/>
      </svg>
    ),
  },
  {
    href: "/dashboard/parametres",
    label: "Paramètres",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M9 1.5v2M9 14.5v2M1.5 9h2M14.5 9h2M3.697 3.697l1.414 1.414M12.889 12.889l1.414 1.414M3.697 14.303l1.414-1.414M12.889 5.111l1.414-1.414" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createSupabaseBrowser();
    supabase.auth.getUser().then(({ data }) => setUserEmail(data.user?.email ?? null));
  }, []);

  async function handleLogout() {
    const supabase = createSupabaseBrowser();
    await supabase.auth.signOut();
    router.push("/auth");
    router.refresh();
  }

  const activeItem = navItems.find((i) => i.href === pathname);

  return (
    <div className="min-h-screen flex" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      {/* Sidebar */}
      <aside
        className="flex-shrink-0 flex flex-col border-r transition-all duration-300"
        style={{
          width: collapsed ? "64px" : "220px",
          background: "var(--card)",
          borderColor: "var(--card-border)",
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center border-b px-4"
          style={{ borderColor: "var(--card-border)", height: "56px" }}
        >
          <Link href="/" className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ background: "var(--foreground)", color: "var(--background)" }}
            >
              CP
            </div>
            {!collapsed && (
              <span className="font-semibold text-sm tracking-tight truncate">CryptoPay</span>
            )}
          </Link>
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="ml-auto p-1.5 rounded-md transition-colors flex-shrink-0"
              style={{ color: "var(--muted)" }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
          {collapsed && (
            <button
              onClick={() => setCollapsed(false)}
              className="mx-auto p-1.5 rounded-md transition-colors"
              style={{ color: "var(--muted)" }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
        </div>

        {/* User */}
        {!collapsed && (
          <div className="px-3 py-3 border-b" style={{ borderColor: "var(--card-border)" }}>
            <div
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg"
              style={{ background: "var(--background)" }}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                style={{ background: "var(--accent)", color: "white" }}
              >
                {userEmail ? userEmail[0].toUpperCase() : "M"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium truncate">{userEmail ?? "Mon compte"}</p>
                <p className="text-[11px] truncate" style={{ color: "var(--muted)" }}>Marchand</p>
              </div>
              <button onClick={handleLogout} title="Déconnexion" className="flex-shrink-0 p-1 rounded" style={{ color: "var(--muted)" }}>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M5 2H2.5A1.5 1.5 0 0 0 1 3.5v6A1.5 1.5 0 0 0 2.5 11H5M9 9l3-3-3-3M12 6.5H5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : ""}
                className="flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: isActive ? "rgba(108,99,255,0.12)" : "transparent",
                  color: isActive ? "var(--accent)" : "var(--muted)",
                  justifyContent: collapsed ? "center" : "flex-start",
                  borderLeft: isActive ? "2px solid var(--accent)" : "2px solid transparent",
                }}
              >
                {item.icon}
                {!collapsed && <span className="text-[13px]">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom status */}
        <div
          className="px-3 py-3 border-t"
          style={{ borderColor: "var(--card-border)" }}
        >
          {!collapsed ? (
            <div
              className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs"
              style={{ color: "var(--muted)", background: "var(--background)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0 animate-pulse" />
              <span>Polygon Mainnet</span>
            </div>
          ) : (
            <div className="flex justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" title="Polygon Mainnet" />
            </div>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header
          className="flex items-center justify-between px-6 border-b flex-shrink-0"
          style={{
            borderColor: "var(--card-border)",
            background: "var(--card)",
            height: "56px",
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{activeItem?.label ?? "Dashboard"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/lien"
              className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
              style={{
                background: "var(--accent)",
                color: "white",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Nouveau lien
            </Link>
            <Link
              href="/"
              className="text-xs px-3 py-1.5 rounded-lg transition-all"
              style={{ color: "var(--muted)", border: "1px solid var(--card-border)" }}
            >
              ← Site
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
