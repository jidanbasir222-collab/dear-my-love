"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Image as ImageIcon,
  Compass,
  Music,
  CheckSquare,
  Sparkles,
  Heart,
  Plus,
  ArrowRight,
  Settings,
  Mail,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsRes, settingsRes] = await Promise.all([
          fetch("/api/stats"),
          fetch("/api/settings"),
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }
        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          setSettings(settingsData);
        }
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-burgundy border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Kenangan Foto",
      value: stats?.memoriesCount || 0,
      icon: ImageIcon,
      href: "/admin/memories",
      desc: "Foto polaroid dalam galeri",
    },
    {
      label: "Linimasa Kisah",
      value: stats?.milestonesCount || 0,
      icon: Compass,
      href: "/admin/timeline",
      desc: "Momen perjalanan cinta",
    },
    {
      label: "Playlist Musik",
      value: stats?.songsCount || 0,
      icon: Music,
      href: "/admin/music",
      desc: "Lagu soundtrack romantis",
    },
    {
      label: "Impian Terwujud",
      value: `${stats?.completedBucket || 0} / ${stats?.totalBucket || 0}`,
      icon: CheckSquare,
      href: "/admin/bucket",
      desc: `${stats?.bucketPercentage || 0}% rencana tercapai`,
    },
  ];

  const quickActions = [
    { label: "Unggah Foto Baru", href: "/admin/memories", icon: ImageIcon },
    { label: "Tambah Momen Linimasa", href: "/admin/timeline", icon: Compass },
    { label: "Sunting Surat Cinta", href: "/admin/letter", icon: Mail },
    { label: "Kelola Soundtrack", href: "/admin/music", icon: Music },
    { label: "Pengaturan Website", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-polaroid border border-dustyRose/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-mutedGold font-semibold">
            SELAMAT DATANG DI RUANG PENGELOLA
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-burgundy mt-1">
            Semesta Cinta {settings?.coupleName1 || "ahmad zaidan"} &amp; {settings?.coupleName2 || "zaskia nisa syabani"}
          </h1>
          <p className="text-xs sm:text-sm text-burgundy/70 mt-1">
            Kelola dan perbarui seluruh konten hadiah anniversary tanpa perlu mengubah kode sumber.
          </p>
        </div>

        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-burgundy hover:bg-burgundy-dark text-ivory text-xs font-semibold tracking-wider transition-all shadow-md shrink-0"
        >
          <Sparkles className="w-4 h-4 text-mutedGold" />
          <span>Buka Website</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="bg-white rounded-2xl p-5 shadow-sm border border-dustyRose/20 hover:border-dustyRose hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-burgundy/70 uppercase tracking-wider">
                  {card.label}
                </span>
                <div className="w-8 h-8 rounded-lg bg-softPink/50 flex items-center justify-center text-burgundy group-hover:scale-110 transition-transform">
                  <Icon className="w-4 h-4 text-mutedGold" />
                </div>
              </div>
              <div className="font-serif text-3xl font-bold text-burgundy">
                {card.value}
              </div>
              <p className="text-[11px] text-burgundy/60 mt-1">{card.desc}</p>
            </Link>
          );
        })}
      </div>

      {/* Quick Action Buttons */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-dustyRose/20">
        <h2 className="font-serif text-lg font-bold text-burgundy mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-mutedGold" />
          Aksi Cepat
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                href={action.href}
                className="p-4 rounded-2xl bg-softPink/30 hover:bg-softPink/60 text-burgundy text-xs font-semibold flex flex-col items-center justify-center text-center gap-2.5 transition-all border border-dustyRose/20 hover:border-dustyRose/50"
              >
                <div className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center text-burgundy">
                  <Icon className="w-4 h-4 text-mutedGold" />
                </div>
                <span>{action.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bucket List Progress Bar Summary */}
      {stats && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-dustyRose/20">
          <div className="flex items-center justify-between mb-3">
            <span className="font-serif font-bold text-base text-burgundy flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-mutedGold" />
              Progres Impian Masa Depan
            </span>
            <span className="text-xs font-mono font-bold text-mutedGold-dark">
              {stats.completedBucket} dari {stats.totalBucket} Selesai ({stats.bucketPercentage}%)
            </span>
          </div>
          <div className="w-full h-3 bg-softPink/40 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-dustyRose to-mutedGold rounded-full transition-all duration-700"
              style={{ width: `${stats.bucketPercentage}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}
