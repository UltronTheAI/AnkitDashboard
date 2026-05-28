import { NextRequest, NextResponse } from "next/server";
import { getCollections } from "@/lib/collections";
import { assertAdmin } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  if (!assertAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const pageSize = Math.min(Math.max(Number(searchParams.get("pageSize") ?? "5") || 5, 1), 50);
  const page = Math.max(Number(searchParams.get("page") ?? "1") || 1, 1);
  const skip = (page - 1) * pageSize;

  let form;
  try {
    ({ form } = await getCollections());
  } catch {
    return NextResponse.json({ error: "Database unavailable." }, { status: 503 });
  }

  const [total, docs] = await Promise.all([
    form.countDocuments({}),
    form
      .find(
        {},
        {
          projection: {
            firstName: 1,
            lastName: 1,
            phone: 1,
            email: 1,
            contentName: 1,
            createdAt: 1,
          },
        },
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .toArray(),
  ]);

  return NextResponse.json({
    page,
    pageSize,
    total,
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
