import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getCollections } from "@/lib/collections";
import { assertAdmin } from "@/lib/adminAuth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!assertAdmin(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let oid: ObjectId;
  try {
    const { id } = await params;
    oid = new ObjectId(id);
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid id." }, { status: 400 });
  }

  let form;
  try {
    ({ form } = await getCollections());
  } catch {
    return NextResponse.json({ ok: false, error: "Database unavailable." }, { status: 503 });
  }
  await form.deleteOne({ _id: oid });
  return NextResponse.json({ ok: true });
}
