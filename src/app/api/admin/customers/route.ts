import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { User } from "@/models";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    await dbConnect();
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const allCustomers = await User.find({ role: "customer" }).sort({ createdAt: -1 });

    const transformed = allCustomers.map(c => {
      const obj = c.toObject();
      obj.id = obj._id.toString();
      return obj;
    });

    return NextResponse.json(transformed);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
