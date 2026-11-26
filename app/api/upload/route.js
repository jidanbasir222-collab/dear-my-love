import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { uploadFile } from "@/lib/storage";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json(
        { error: "Akses ditolak. Anda harus login sebagai admin." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { error: "Tidak ada berkas yang diunggah." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const originalName = file.name || "upload";
    const mimeType = file.type || "application/octet-stream";

    const fileUrl = await uploadFile(buffer, originalName, mimeType);

    return NextResponse.json({
      success: true,
      url: fileUrl,
      filename: originalName,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Terjadi kegagalan saat mengunggah berkas." },
      { status: 500 }
    );
  }
}
