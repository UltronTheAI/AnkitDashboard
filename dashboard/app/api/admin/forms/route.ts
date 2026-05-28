import { NextRequest, NextResponse } from "next/server";
import { getCollections } from "@/lib/collections";
import { assertAdmin } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  if (!assertAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const limit = Math.min(Number(searchParams.get("limit") ?? "200") || 200, 500);

  const { form } = await getCollections();
  const docs = await form
    .find({}, { projection: { firstName: 1, lastName: 1, phone: 1, email: 1, contentName: 1, createdAt: 1 } })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();

  return NextResponse.json({
    items: docs.map((d) => ({
      id: d._id.toString(),
      firstName: d.firstName,
      lastName: d.lastName,
      phone: d.phone,
      email: d.email,
      contentName: d.contentName,
      createdAt: d.createdAt?.toISOString?.() ?? new Date().toISOString(),
    })),
  });
}

