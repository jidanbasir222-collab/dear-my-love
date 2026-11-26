import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser, verifyPassword, hashPassword } from "@/lib/auth";

export async function POST(request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Sesi tidak sah. Silakan login kembali." }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: "Kata sandi baru minimal harus 6 karakter." },
        { status: 400 }
      );
    }

    const admin = await prisma.admin.findUnique({
      where: { id: session.id },
    });

    if (!admin) {
      return NextResponse.json({ error: "Akun admin tidak ditemukan." }, { status: 404 });
    }

    const isValid = await verifyPassword(currentPassword, admin.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Kata sandi saat ini salah." },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(newPassword);
    await prisma.admin.update({
      where: { id: admin.id },
      data: { passwordHash },
    });

    return NextResponse.json({
      success: true,
      message: "Kata sandi berhasil diperbarui.",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui kata sandi." },
      { status: 500 }
    );
  }
}
