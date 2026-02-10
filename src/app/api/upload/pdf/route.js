import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { uploadFile } from "@/lib/cloudinary";

export async function POST(request) {
  try {
    const session = await getSession();
    if (!session?.id || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const folder = formData.get("folder") || "libzone/books";

    if (!file || typeof file.arrayBuffer !== "function") {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 });
    }

    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json({ error: "PDF must be under 20MB" }, { status: 400 });
    }

    const result = await uploadFile(file, folder, { resource_type: "raw", type: "private" });
    if (!result?.publicId) {
      return NextResponse.json({ error: "Upload failed (missing public id)" }, { status: 500 });
    }
    return NextResponse.json({ url: result.url, publicId: result.publicId });
  } catch (err) {
    console.error("PDF upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

