import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    let surprise = await prisma.surprise.findFirst({
      where: { id: 1 },
    });

    if (!surprise) {
      surprise = await prisma.surprise.create({
        data: {
          id: 1,
          boxTitle: "Ada Satu Kejutan Kecil Untukmu...",
          boxSubtitle: "Sentuh pita kado ini untuk membukanya",
          message: "Selamat Hari Jadi, Sayangku! Terima kasih sudah menjadi keajaiban terindah dalam hidupku.",
          photoUrl: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1000&q=80",
          badge: "Kado Cinta Abadi",
          couponText: "Kupon Spesial: Berlaku selamanya untuk pelukan tanpa batas & hari kencan impianmu!",
        },
      });
    }

    return NextResponse.json(surprise);
  } catch (error) {
    console.error("Get surprise error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data kejutan." },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Akses tidak sah." }, { status: 401 });
    }

    const { boxTitle, boxSubtitle, message, photoUrl, badge, couponText } = await request.json();

    const updated = await prisma.surprise.upsert({
      where: { id: 1 },
      update: {
        boxTitle: boxTitle !== undefined ? boxTitle : undefined,
        boxSubtitle: boxSubtitle !== undefined ? boxSubtitle : undefined,
        message: message !== undefined ? message : undefined,
        photoUrl: photoUrl !== undefined ? photoUrl : undefined,
        badge: badge !== undefined ? badge : undefined,
        couponText: couponText !== undefined ? couponText : undefined,
      },
      create: {
        id: 1,
        boxTitle: boxTitle || "Ada Satu Kejutan Kecil Untukmu...",
        boxSubtitle: boxSubtitle || "Sentuh pita kado ini untuk membukanya",
        message: message || "Selamat Hari Jadi!",
        photoUrl: photoUrl || "/images/surprise.jpg",
        badge: badge || "Kado Cinta",
        couponText: couponText || "",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Kejutan berhasil diperbarui.",
      surprise: updated,
    });
  } catch (error) {
    console.error("Update surprise error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui kejutan." },
      { status: 500 }
    );
  }
}
