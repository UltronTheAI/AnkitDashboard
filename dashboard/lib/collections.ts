import { ObjectId } from "mongodb";
import { getDb } from "./mongodb";

export type ContentDoc = {
  _id?: ObjectId;
  name: string;
  description: string;
  link: string;
  imageUrl?: string;
  imagePublicId?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type FormDoc = {
  _id?: ObjectId;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  contentId: ObjectId;
  contentName: string;
  createdAt: Date;
};

let ensured = false;

export async function getCollections() {
  const db = await getDb();
  const content = db.collection<ContentDoc>("content");
  const form = db.collection<FormDoc>("form");

  if (!ensured) {
    ensured = true;
    await Promise.allSettled([
      content.createIndex(
        { name: "text", description: "text" },
        { name: "content_text" },
      ),
      form.createIndex({ createdAt: -1 }, { name: "form_createdAt" }),
      content.createIndex({ createdAt: -1 }, { name: "content_createdAt" }),
    ]);
  }

  return { content, form };
}
