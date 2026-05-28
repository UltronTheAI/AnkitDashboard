import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getCollections } from "@/lib/collections";
import { assertAdmin } from "@/lib/adminAuth";

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
  };

  const patch: Record<string, unknown> = {};
  if (typeof body.name === "string") patch.name = body.name.trim();
  if (typeof body.description === "string") patch.description = body.description.trim();
  if (typeof body.link === "string") patch.link = body.link.trim();
  if (typeof body.imageUrl === "string") patch.imageUrl = body.imageUrl.trim() || undefined;
  patch.updatedAt = new Date();

  const { content } = await getCollections();
  await content.updateOne({ _id: oid }, { $set: patch });
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

  const { content } = await getCollections();
  await content.deleteOne({ _id: oid });
  return NextResponse.json({ ok: true });
}
