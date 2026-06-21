// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/mongodb";
// import SiteContent from "@/models/SiteContent";
// import { getAdminSession } from "@/lib/auth";

// export const dynamic = "force-dynamic";
// export const runtime = "nodejs";

// export async function GET() {
//   await connectDB();
//   let content = await SiteContent.findOne();
//   if (!content) {
//     content = await SiteContent.create({});
//   }
//   return NextResponse.json(content);
// }

// export async function PUT(req) {
//   const session = getAdminSession();
//   if (!session) return NextResponse.json({ error: "Not authorized." }, { status: 401 });

//   const body = await req.json();
//   await connectDB();
//   let content = await SiteContent.findOne();
//   if (!content) {
//     content = await SiteContent.create(body);
//   } else {
//     Object.assign(content, body);
//     await content.save();
//   }
//   return NextResponse.json(content);
// }
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import SiteContent from "@/models/SiteContent";
import { getAdminSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();

    let content = await SiteContent.findOne();
    if (!content) {
      content = await SiteContent.create({});
    }

    return NextResponse.json(content);
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const session = getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Not authorized." }, { status: 401 });
    }

    await connectDB();

    const body = await req.json();

    let content = await SiteContent.findOne();

    if (!content) {
      content = await SiteContent.create(body);
    } else {
      Object.assign(content, body);
      await content.save();
    }

    return NextResponse.json(content);
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}