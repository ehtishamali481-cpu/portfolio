import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Experience from "@/models/Experience";
import { getAdminSession } from "@/lib/auth";

export async function PUT(req, { params }) {
  const session = getAdminSession();
  if (!session) return NextResponse.json({ error: "Not authorized." }, { status: 401 });

  const body = await req.json();
  await connectDB();
  const exp = await Experience.findByIdAndUpdate(params.id, body, { new: true });
  if (!exp) return NextResponse.json({ error: "Experience entry not found." }, { status: 404 });
  return NextResponse.json(exp);
}

export async function DELETE(req, { params }) {
  const session = getAdminSession();
  if (!session) return NextResponse.json({ error: "Not authorized." }, { status: 401 });

  await connectDB();
  await Experience.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
