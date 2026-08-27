import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { login } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import { User } from "@/models";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, email, password } = await req.json();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    await login({ id: user._id, email: user.email, role: user.role, name: user.name });

    return NextResponse.json({
      user: { id: user._id, email: user.email, role: user.role, name: user.name },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
