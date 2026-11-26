import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const items = await prisma.bucketItem.findMany({
      orderBy: [{ order: "asc" }, { id: "asc" }],
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error("Get bucket list error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil daftar impian masa depan." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Akses tidak sah." }, { status: 401 });
    }

    const { title, category, note, order } = await request.json();

    if (!title) {
      return NextResponse.json(
        { error: "Judul impian wajib diisi." },
        { status: 400 }
      );
    }

    const item = await prisma.bucketItem.create({
      data: {
        title,
        category: category || "Travel",
        note: note || "",
        order: order !== undefined ? parseInt(order, 10) : 0,
        completed: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Impian baru berhasil ditambahkan.",
      item,
    });
  } catch (error) {
    console.error("Create bucket item error:", error);
    return NextResponse.json(
      { error: "Gagal menambahkan impian baru." },
      { status: 500 }
    );
  }
}
