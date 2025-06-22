import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET_KEY as string;

export function JWTverify(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // Token missing or malformed
    return NextResponse.json(
      { message: "Unauthorized. Token not provided." },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    console.log('jwt_secret',SECRET_KEY)
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded as { username_id: string; [key: string]: any };
  } catch (err) {
    // Token is invalid or expired
    console.error("JWT verification failed:", err);
    return NextResponse.json(
      { message: "Unauthorized. Token is invalid or expired." },
      { status: 401 }
    );

    // OR redirect to login if you prefer that
    // return NextResponse.redirect(new URL('/login', request.url));
  }
}
