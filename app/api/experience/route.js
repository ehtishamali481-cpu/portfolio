import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Experience from "@/models/Experience";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  await connectDB();
  const experience = await Experience.find().sort({ order: 1, createdAt: -1 });
  return NextResponse.json(experience);
}

export async function POST(req) {
  const session = getAdminSession();
  if (!session) return NextResponse.json({ error: "Not authorized." }, { status: 401 });

  const body = await req.json();
  await connectDB();
  const exp = await Experience.create(body);
  return NextResponse.json(exp, { status: 201 });
}
