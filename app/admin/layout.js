"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Image as ImageIcon,
  Compass,
  Mail,
  Music,
  Gift,
  CheckSquare,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Sparkles,
  Heart,
} from "lucide-react";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // If we are on the login page, render children without admin chrome
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          router.replace("/admin/login");
          return;
        }
        const data = await res.json();
        if (data.authenticated) {
          setUser(data.user);
          setLoading(false);
        } else {
          router.replace("/admin/login");
        }
      } catch (err) {
        router.replace("/admin/login");
      }
    }

    checkAuth();
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.replace("/admin/login");
    } catch (err) {
      router.replace("/admin/login");
    }
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-burgundy border-t-transparent rounded-full animate-spin"></div>
          <p className="font-serif text-sm font-semibold text-burgundy">
            Memuat Ruang Pengaturan...
          </p>
        </div>
      </div>
    );
  }

  const menuItems = [
    { name: "Ikhtisar", href: "/admin", icon: LayoutDashboard },
    { name: "Galeri Kenangan", href: "/admin/memories", icon: ImageIcon },
    { name: "Linimasa Kisah", href: "/admin/timeline", icon: Compass },
    { name: "Surat Cinta", href: "/admin/letter", icon: Mail },
    { name: "Playlist Musik", href: "/admin/music", icon: Music },
    { name: "Kejutan Kado", href: "/admin/surprise", icon: Gift },
    { name: "Impian Masa Depan", href: "/admin/bucket", icon: CheckSquare },
    { name: "Pengaturan Website", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-ivory flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-white border-b border-dustyRose/20 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-mutedGold" />
          <span className="font-serif font-bold text-sm text-burgundy">
            Admin Universe
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 text-burgundy hover:bg-softPink/30 rounded-lg"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-white border-r border-dustyRose/25 flex flex-col justify-between z-50 transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
          {/* Header */}
          <div className="p-6 border-b border-dustyRose/20 flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-burgundy text-white flex items-center justify-center shadow-sm">
                <Sparkles className="w-5 h-5 text-mutedGold" />
              </div>
              <div>
                <span className="font-serif text-sm font-bold text-burgundy block">
                  OUR LITTLE UNIVERSE
                </span>
                <span className="text-[10px] uppercase tracking-wider text-mutedGold font-semibold">
                  Dashboard Pengelola
                </span>
              </div>
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              className="md:hidden p-1 text-burgundy/60"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? "bg-burgundy text-ivory shadow-sm"
                      : "text-burgundy/75 hover:bg-softPink/40 hover:text-burgundy"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-mutedGold" : "text-dustyRose-dark"}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer info & Logout */}
        <div className="p-4 border-t border-dustyRose/20 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-burgundy bg-softPink/40 hover:bg-softPink transition-colors"
          >
            <span className="flex items-center gap-2">
              <Heart className="w-3.5 h-3.5 text-dustyRose fill-dustyRose" />
              Lihat Website
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-burgundy/60" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4 text-red-500" />
            <span>Keluar Akun</span>
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 min-h-screen overflow-y-auto p-4 sm:p-8 lg:p-10">
        <div className="max-w-5xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
