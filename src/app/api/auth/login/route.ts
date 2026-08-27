import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { login } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import { User } from "@/models";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    await login({ id: user._id, email: user.email, role: user.role, name: user.name });

    return NextResponse.json({
      user: { id: user._id, email: user.email, role: user.role, name: user.name },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
