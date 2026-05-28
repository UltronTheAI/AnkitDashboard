import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getCollections } from "@/lib/collections";
import { assertAdmin } from "@/lib/adminAuth";
import { getCloudinary } from "@/lib/cloudinary";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!assertAdmin(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  let oid: ObjectId;
  try {
    oid = new ObjectId(id);
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid id." }, { status: 400 });
  }

  const body = (await req.json()) as {
    name?: string;
    description?: string;
    link?: string;
    imageUrl?: string;
    imagePublicId?: string;
  };

  const patch: Record<string, unknown> = {};
  if (typeof body.name === "string") patch.name = body.name.trim();
  if (typeof body.description === "string") patch.description = body.description.trim();
  if (typeof body.link === "string") patch.link = body.link.trim();
  if (typeof body.imageUrl === "string") patch.imageUrl = body.imageUrl.trim() || undefined;
  if (typeof body.imagePublicId === "string")
    patch.imagePublicId = body.imagePublicId.trim() || undefined;
  patch.updatedAt = new Date();

  let content;
  try {
    ({ content } = await getCollections());
  } catch {
    return NextResponse.json({ ok: false, error: "Database unavailable." }, { status: 503 });
  }

  const existing = await content.findOne(
    { _id: oid },
    { projection: { imagePublicId: 1 } },
  );

  await content.updateOne({ _id: oid }, { $set: patch });

  const oldPublicId = existing?.imagePublicId;
  const newPublicId =
    typeof patch.imagePublicId === "string"
      ? (patch.imagePublicId as string)
      : undefined;
  if (oldPublicId && oldPublicId !== newPublicId) {
    try {
      const cloud = getCloudinary();
      await cloud.uploader.destroy(oldPublicId);
    } catch {}
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!assertAdmin(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  let oid: ObjectId;
  try {
    oid = new ObjectId(id);
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid id." }, { status: 400 });
  }

  let content;
  try {
    ({ content } = await getCollections());
  } catch {
    return NextResponse.json({ ok: false, error: "Database unavailable." }, { status: 503 });
  }

  const existing = await content.findOne(
    { _id: oid },
    { projection: { imagePublicId: 1 } },
  );
  await content.deleteOne({ _id: oid });

  const publicId = existing?.imagePublicId;
  if (publicId) {
    try {
      const cloud = getCloudinary();
      await cloud.uploader.destroy(publicId);
    } catch {}
  }
  return NextResponse.json({ ok: true });
}
