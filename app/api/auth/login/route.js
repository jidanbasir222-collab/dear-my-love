import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyPassword, signToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username dan kata sandi wajib diisi." },
        { status: 400 }
      );
    }

    const admin = await prisma.admin.findUnique({
      where: { username: username.trim() },
    });

    if (!admin) {
      return NextResponse.json(
        { error: "Username atau kata sandi tidak cocok." },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, admin.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Username atau kata sandi tidak cocok." },
        { status: 401 }
      );
    }

    const token = signToken({ id: admin.id, username: admin.username });

    const response = NextResponse.json({
      success: true,
      message: "Berhasil masuk ke ruang admin.",
      user: { id: admin.id, username: admin.username },
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server saat proses login." },
      { status: 500 }
    );
  }
}
