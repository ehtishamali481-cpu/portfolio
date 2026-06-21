import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import SiteContent from "@/models/SiteContent";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  await connectDB();
  let content = await SiteContent.findOne();
  if (!content) {
    content = await SiteContent.create({});
  }
  return NextResponse.json(content);
}

export async function PUT(req) {
  const session = getAdminSession();
  if (!session) return NextResponse.json({ error: "Not authorized." }, { status: 401 });

  const body = await req.json();
  await connectDB();
  let content = await SiteContent.findOne();
  if (!content) {
    content = await SiteContent.create(body);
  } else {
    Object.assign(content, body);
    await content.save();
  }
  return NextResponse.json(content);
}
