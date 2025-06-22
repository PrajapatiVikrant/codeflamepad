import { NextRequest, NextResponse } from "next/server";
import  connectDB  from "@/lib/db";
import codeflamepad from "@/models/codeflamepad";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  await connectDB();
  const { username, password } = await req.json();
  console.log(username,password)
  const existingUser = await codeflamepad.findOne({ username });
  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new codeflamepad({ username, password: hashedPassword,files:[] });
  await user.save();

  return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
}
