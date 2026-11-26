import { NextResponse } from "next/server";
import { getAdminByUsername, updateAdminPassword } from "@/lib/db-store";
import { getSessionUser, verifyPassword, hashPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

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

    const username = session.username || "admin";
    const admin = await getAdminByUsername(username);

    let isValid = false;
    if (admin && admin.passwordHash) {
      isValid = await verifyPassword(currentPassword, admin.passwordHash);
    }

    // Fallback: Check environment variable if hash didn't match
    if (!isValid) {
      const envPass = process.env.ADMIN_PASSWORD || "admin123";
      if (currentPassword === envPass) {
        isValid = true;
      }
    }

    if (!isValid) {
      return NextResponse.json(
        { error: "Kata sandi saat ini salah." },
        { status: 400 }
      );
    }

    const newHash = await hashPassword(newPassword);
    await updateAdminPassword(session.id || 1, newHash);

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
