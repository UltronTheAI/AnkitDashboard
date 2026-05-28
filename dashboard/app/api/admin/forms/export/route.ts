import { NextRequest, NextResponse } from "next/server";
import { getCollections } from "@/lib/collections";
import { assertAdmin } from "@/lib/adminAuth";

function csvEscape(value: unknown) {
  const s = String(value ?? "");
  if (/[",\n]/.test(s)) return `"${s.replaceAll('"', '""')}"`;
  return s;
}

export async function GET(req: NextRequest) {
  if (!assertAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let form;
  try {
    ({ form } = await getCollections());
  } catch {
    return NextResponse.json({ error: "Database unavailable." }, { status: 503 });
  }
  const docs = await form
    .find({}, { projection: { firstName: 1, lastName: 1, phone: 1, email: 1, contentName: 1, createdAt: 1 } })
    .sort({ createdAt: -1 })
    .limit(10000)
    .toArray();

  const header = ["createdAt", "firstName", "lastName", "phone", "email", "contentName"];
  const rows = [
    header.join(","),
    ...docs.map((d) =>
      [
        d.createdAt?.toISOString?.() ?? "",
        d.firstName,
        d.lastName,
        d.phone,
        d.email,
        d.contentName,
      ]
        .map(csvEscape)
        .join(","),
    ),
  ];

  const csv = rows.join("\n");
  return new NextResponse(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": 'attachment; filename="forms.csv"',
    },
  });
}
