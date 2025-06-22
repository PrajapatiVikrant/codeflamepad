import { JWTverify } from "@/app/middleware/JWTverify";
import connectDB from "@/lib/db";
import codeflamepad from "@/models/codeflamepad";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function PATCH(req: NextRequest) {
  await connectDB();

  const user = JWTverify(req);
  if (user instanceof NextResponse) {
    return user; // Unauthorized, redirect
  }

  const { fileId, newData } = await req.json();

  if (!fileId || !newData) {
    return NextResponse.json({ message: "fileId and newData are required" }, { status: 400 });
  }

  if (!mongoose.Types.ObjectId.isValid(fileId)) {
    return NextResponse.json({ message: "Invalid file ID" }, { status: 400 });
  }
  console.log(user,fileId)
  // ✅ Update file inside user's document
  const result = await codeflamepad.findOneAndUpdate(
    { _id: user.id, "files._id": fileId },
    { $set: { "files.$.data": newData } },
    { new: true }
  );

  if (!result) {
    return NextResponse.json({ message: "File not found or unauthorized" }, { status: 404 });
  }

  return NextResponse.json({ message: "File saved successfully" }, { status: 200 });
}
