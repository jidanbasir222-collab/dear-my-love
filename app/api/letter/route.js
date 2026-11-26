import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    let letter = await prisma.letter.findFirst({
      where: { id: 1 },
    });

    if (!letter) {
      letter = await prisma.letter.create({
        data: {
          id: 1,
          recipient: "Untuk Salsa, Bidadari Semestaku",
          title: "Sebuah Surat Dari Lubuk Hatiku",
          content: "Sayangku, terima kasih telah menjadi bagian paling indah dalam semestaku...",
          signature: "Dengan segenap cintaku, Ahmad ❤️",
          date: "22 November",
        },
      });
    }

    return NextResponse.json(letter);
  } catch (error) {
    console.error("Get letter error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data surat cinta." },
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

    const { recipient, title, content, signature, date } = await request.json();

    const updated = await prisma.letter.upsert({
      where: { id: 1 },
      update: {
        recipient: recipient !== undefined ? recipient : undefined,
        title: title !== undefined ? title : undefined,
        content: content !== undefined ? content : undefined,
        signature: signature !== undefined ? signature : undefined,
        date: date !== undefined ? date : undefined,
      },
      create: {
        id: 1,
        recipient: recipient || "Sayangku",
        title: title || "Sebuah Surat Dari Lubuk Hatiku",
        content: content || "",
        signature: signature || "Ahmad",
        date: date || "22 November",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Surat cinta berhasil diperbarui.",
      letter: updated,
    });
  } catch (error) {
    console.error("Update letter error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui surat cinta." },
      { status: 500 }
    );
  }
}
