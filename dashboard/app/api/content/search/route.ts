import { NextRequest, NextResponse } from "next/server";
import { getCollections } from "@/lib/collections";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim();

  let contentCollection: Awaited<ReturnType<typeof getCollections>>["content"];
  try {
    ({ content: contentCollection } = await getCollections());
  } catch {
    return NextResponse.json(
      { items: [], error: "Database unavailable." },
      { status: 503 },
    );
  }

  const limit = 20;
  const query =
    q.length > 0
      ? { $text: { $search: q } }
      : {};

  const cursor = contentCollection
    .find(query, {
      projection:
        q.length > 0
          ? { score: { $meta: "textScore" }, name: 1, description: 1, imageUrl: 1 }
          : { name: 1, description: 1, imageUrl: 1 },
    })
    .sort(q.length > 0 ? { score: { $meta: "textScore" } } : { createdAt: -1 })
    .limit(limit);

  const items = await cursor.toArray();

  return NextResponse.json({
    items: items.map((d) => ({
      id: d._id.toString(),
      name: d.name,
      description: d.description,
      imageUrl: d.imageUrl,
    })),
  });
}
