import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import { getAdminSession } from "@/lib/auth";

export async function PUT(req, { params }) {
  const session = getAdminSession();
  if (!session) return NextResponse.json({ error: "Not authorized." }, { status: 401 });

  const body = await req.json();
  await connectDB();
  const project = await Project.findByIdAndUpdate(params.id, body, { new: true });
  if (!project) return NextResponse.json({ error: "Project not found." }, { status: 404 });
  return NextResponse.json(project);
}

export async function DELETE(req, { params }) {
  const session = getAdminSession();
  if (!session) return NextResponse.json({ error: "Not authorized." }, { status: 401 });

  await connectDB();
  await Project.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
