import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import codeflamepad from "@/models/codeflamepad";
import { JWTverify } from "@/app/middleware/JWTverify";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = JWTverify(req);
    if (user instanceof NextResponse) return user;

    const userDoc = await codeflamepad.findOne({ _id: user.id });

    if (!userDoc) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(userDoc.files, { status: 200 });
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const user = JWTverify(req);
    if (user instanceof NextResponse) return user;

    const body = await req.json();
    const { name, data } = body;

    if (!name || !data) {
      return NextResponse.json({ message: "File name and data required" }, { status: 400 });
    }

    const userDoc = await codeflamepad.findOne({ _id: user.id });

    if (!userDoc) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Check if file with same name already exists
    const existing = userDoc.files.find((f: any) => f.name.trim() === name.trim());
    if (existing) {
      return NextResponse.json({ message: "File name already exists" }, { status: 409 });
    }

    // Push new file
    userDoc.files.push({ name: name.trim(), data });
    await userDoc.save();

    return NextResponse.json({ message: "File added", files: userDoc.files }, { status: 201 });
  } catch (err) {
    console.error("POST error:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
