import { NextRequest, NextResponse } from "next/server";
import  connectDB  from "@/lib/db";
import codeflamepad from "@/models/codeflamepad";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET_KEY!;

export async function POST(req: NextRequest) {
  await connectDB();
  const { username, password } = await req.json();
  console.log(username,password)
  const user = await codeflamepad.findOne({ username });
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });
  return NextResponse.json({ message: "Login successful", token });
}
