import { NextRequest, NextResponse } from "next/server";
import { JWTverify } from "@/app/middleware/JWTverify";
import connectDB from "@/lib/db";
import codeflamepad from "@/models/codeflamepad";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  await connectDB();
  const user = JWTverify(req);
  if (user instanceof NextResponse) return user;

  const body = await req.json();
  console.log(body)
  const {id} = body
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid file ID" }, { status: 400 });
  }

  const userDoc = await codeflamepad.findOne({ _id: user.id });

  if (!userDoc) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const file = userDoc.files.find((f: any) => f._id.toString() === id);

  if (!file) {
    return NextResponse.json({ message: "File not found" }, { status: 404 });
  }

  return NextResponse.json({ name: file.name, data: file.data }, { status: 200 });
}
