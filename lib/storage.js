import path from "path";
import { writeFile, mkdir } from "fs/promises";

/**
 * Uploads a file buffer to cloud storage (Vercel Blob, Cloudinary) or falls back to local uploads.
 *
 * @param {Buffer} buffer - File buffer
 * @param {string} originalName - Original file name
 * @param {string} mimeType - File MIME type
 * @returns {Promise<string>} Public URL of the uploaded file
 */
export async function uploadFile(buffer, originalName, mimeType) {
  const extension = path.extname(originalName || "").toLowerCase() || ".jpg";
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const filename = `${timestamp}-${randomSuffix}${extension}`;

  // 1. Try Vercel Blob (if token is provided in environment variables)
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { put } = await import("@vercel/blob");
      const blob = await put(filename, buffer, {
        access: "public",
        contentType: mimeType || undefined,
      });
      return blob.url;
    } catch (blobErr) {
      console.error("Vercel Blob upload failed, falling back:", blobErr);
    }
  }

  // 2. Try Cloudinary (if credentials are provided in environment variables)
  if (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  ) {
    try {
      const cloudinary = (await import("cloudinary")).v2;
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true,
      });

      const isAudio = mimeType?.startsWith("audio/") || [".mp3", ".wav", ".m4a"].includes(extension);

      return await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "our-little-universe",
            public_id: path.parse(filename).name,
            resource_type: isAudio ? "video" : "auto", // Cloudinary treats audio as "video" or "auto"
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        uploadStream.end(buffer);
      });
    } catch (cloudErr) {
      console.error("Cloudinary upload failed, falling back:", cloudErr);
    }
  }

  // 3. Fallback: Local filesystem (for local development)
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  const filePath = path.join(uploadDir, filename);
  await writeFile(filePath, buffer);

  return `/uploads/${filename}`;
}
