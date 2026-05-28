import { NextRequest, NextResponse } from "next/server";
import { getCollections } from "@/lib/collections";
import { assertAdmin } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  if (!assertAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let content;
  try {
    ({ content } = await getCollections());
  } catch {
    return NextResponse.json({ error: "Database unavailable." }, { status: 503 });
  }
  const items = await content
    .find(
      {},
      {
        projection: {
          name: 1,
          description: 1,
          link: 1,
          imageUrl: 1,
          imagePublicId: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    )
    .sort({ createdAt: -1 })
    .toArray();

  return NextResponse.json({
    items: items.map((d) => ({
      id: d._id.toString(),
      name: d.name,
      description: d.description,
      link: d.link,
      imageUrl: d.imageUrl,
      imagePublicId: d.imagePublicId,
      createdAt: d.createdAt?.toISOString?.() ?? new Date().toISOString(),
      updatedAt: d.updatedAt?.toISOString?.() ?? new Date().toISOString(),
    })),
  });
}

export async function POST(req: NextRequest) {
  if (!assertAdmin(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as {
    name?: string;
    description?: string;
    link?: string;
    imageUrl?: string;
    imagePublicId?: string;
  };

  const name = (body.name ?? "").trim();
  const description = (body.description ?? "").trim();
  const link = (body.link ?? "").trim();
  const imageUrl = (body.imageUrl ?? "").trim();
  const imagePublicId = (body.imagePublicId ?? "").trim();

  if (!name || !description || !link) {
    return NextResponse.json(
      { ok: false, error: "Missing required fields." },
      { status: 400 },
    );
  }

  const now = new Date();
  let content;
  try {
    ({ content } = await getCollections());
  } catch {
    return NextResponse.json({ ok: false, error: "Database unavailable." }, { status: 503 });
  }
  await content.insertOne({
    name,
    description,
    link,
    imageUrl: imageUrl || undefined,
    imagePublicId: imagePublicId || undefined,
    createdAt: now,
    updatedAt: now,
  });

  return NextResponse.json({ ok: true });
}
