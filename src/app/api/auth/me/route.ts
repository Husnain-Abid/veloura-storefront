import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";

export async function GET() {
  try {
    await dbConnect();
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ user: null }, { status: 401 });
    }
    return NextResponse.json({ user: session });
  } catch (err) {
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
