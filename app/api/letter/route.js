import { NextResponse } from "next/server";
import { getLetter, updateLetter } from "@/lib/db-store";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const letter = await getLetter();
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

    const updated = await updateLetter({
      recipient,
      title,
      content,
      signature,
      date,
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
