import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Skill from "@/models/Skill";
import { getAdminSession } from "@/lib/auth";

export async function PUT(req, { params }) {
  const session = getAdminSession();
  if (!session) return NextResponse.json({ error: "Not authorized." }, { status: 401 });

  const body = await req.json();
  await connectDB();
  const skill = await Skill.findByIdAndUpdate(params.id, body, { new: true });
  if (!skill) return NextResponse.json({ error: "Skill not found." }, { status: 404 });
  return NextResponse.json(skill);
}

export async function DELETE(req, { params }) {
  const session = getAdminSession();
  if (!session) return NextResponse.json({ error: "Not authorized." }, { status: 401 });

  await connectDB();
  await Skill.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
