import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getCollections } from "@/lib/collections";
import { getMailer } from "@/lib/nodemailer";

type Body = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  contentId?: string;
};

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const firstName = (body.firstName ?? "").trim();
  const lastName = (body.lastName ?? "").trim();
  const phone = (body.phone ?? "").trim();
  const email = (body.email ?? "").trim();
  const contentId = (body.contentId ?? "").trim();

  if (!firstName || !lastName || !phone || !email || !contentId) {
    return NextResponse.json(
      { ok: false, error: "Missing required fields." },
      { status: 400 },
    );
  }
  if (!isEmail(email)) {
    return NextResponse.json({ ok: false, error: "Invalid email." }, { status: 400 });
  }

  let oid: ObjectId;
  try {
    oid = new ObjectId(contentId);
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid resource." }, { status: 400 });
  }

  const { content, form } = await getCollections();

  const resource = await content.findOne(
    { _id: oid },
    { projection: { name: 1, description: 1, link: 1 } },
  );
  if (!resource) {
    return NextResponse.json({ ok: false, error: "Resource not found." }, { status: 404 });
  }

  await form.insertOne({
    firstName,
    lastName,
    phone,
    email,
    contentId: oid,
    contentName: resource.name,
    createdAt: new Date(),
  });

  try {
    const { transporter, from } = getMailer();
    const subject = `Your resource: ${resource.name}`;
    const text = `Hi ${firstName},

Here is your requested resource:
${resource.name}

${resource.description}

Link: ${resource.link}

Thanks.`;

    await transporter.sendMail({
      from,
      to: email,
      subject,
      text,
      html: `
      <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.5">
        <p>Hi ${firstName},</p>
        <p>Here is your requested resource:</p>
        <p><strong>${resource.name}</strong></p>
        <p>${resource.description}</p>
        <p><a href="${resource.link}">Open resource</a></p>
      </div>
    `,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Email failed to send. Please try again later." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
