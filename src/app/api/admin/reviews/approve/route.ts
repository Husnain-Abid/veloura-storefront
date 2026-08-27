import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Review } from "@/models";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();
    await Review.findByIdAndUpdate(id, { isApproved: true });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to approve review" }, { status: 500 });
  }
}
