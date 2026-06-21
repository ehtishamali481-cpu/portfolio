import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  await connectDB();
  const projects = await Project.find().sort({ order: 1, createdAt: -1 });
  return NextResponse.json(projects);
}

export async function POST(req) {
  const session = getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  const body = await req.json();
  await connectDB();
  const project = await Project.create(body);
  return NextResponse.json(project, { status: 201 });
}
