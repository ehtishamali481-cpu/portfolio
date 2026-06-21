import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Skill from "@/models/Skill";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  await connectDB();
  const skills = await Skill.find().sort({ order: 1, createdAt: 1 });
  return NextResponse.json(skills);
}

export async function POST(req) {
  const session = getAdminSession();
  if (!session) return NextResponse.json({ error: "Not authorized." }, { status: 401 });

  const body = await req.json();
  await connectDB();
  const skill = await Skill.create(body);
  return NextResponse.json(skill, { status: 201 });
}
