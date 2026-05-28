import { NextRequest, NextResponse } from "next/server";
import { assertAdmin } from "@/lib/adminAuth";
import { getCloudinary } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  if (!assertAdmin(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid form data." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "Missing file." }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  let cloud;
  try {
    cloud = getCloudinary();
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Cloudinary misconfigured." },
      { status: 500 },
    );
  }

  try {
    const result = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        const stream = cloud.uploader.upload_stream(
          { folder: "ankit-resources" },
          (error, res) => {
            if (error || !res) return reject(error ?? new Error("Upload failed"));
            resolve({ secure_url: res.secure_url, public_id: res.public_id });
          },
        );
        stream.end(buffer);
      },
    );

    return NextResponse.json({
      ok: true,
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Upload failed." }, { status: 500 });
  }
}

