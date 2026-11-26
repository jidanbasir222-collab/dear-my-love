import { NextResponse } from "next/server";
import { getAdminByUsername } from "@/lib/db-store";
import { verifyPassword, signToken, COOKIE_NAME } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username dan kata sandi wajib diisi." },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim();
    let admin = await getAdminByUsername(cleanUsername);

    let isValid = false;
    let adminId = 1;

    if (admin && admin.passwordHash) {
      isValid = await verifyPassword(password, admin.passwordHash);
      adminId = admin.id || 1;
    }

    // Fallback: Check environment variables or default admin credentials
    if (!isValid) {
      const envUser = (process.env.ADMIN_USERNAME || "admin").trim();
      const envPass = process.env.ADMIN_PASSWORD || "admin123";
      if (cleanUsername.toLowerCase() === envUser.toLowerCase() && password === envPass) {
        isValid = true;
        adminId = admin?.id || 1;
      }
    }

    if (!isValid) {
      return NextResponse.json(
        { error: "Username atau kata sandi tidak cocok." },
        { status: 401 }
      );
    }

    const token = signToken({ id: adminId, username: cleanUsername });

    const response = NextResponse.json({
      success: true,
      message: "Berhasil masuk ke ruang admin.",
      user: { id: adminId, username: cleanUsername },
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
