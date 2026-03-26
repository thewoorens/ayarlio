import {NextRequest, NextResponse} from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        {success: false},
        {status: 404}
      );
    }

    await connectDB();

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      verifyEmailToken: hashedToken,
      verifyEmailExpire: {$gt: Date.now()},
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false
        },
        {status: 400}
      );
    }

    user.emailVerify = true;
    user.verifyEmailToken = undefined;
    user.verifyEmailExpire = undefined;
    await user.save();

    const response = NextResponse.redirect(
      new URL("/giris-yap", req.url)
    );

    response.cookies.set("email_verified", "1", {
      httpOnly: true,
      maxAge: 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Verify Email API Error:", error);
    return NextResponse.json(
      {
        success: false
      },
      {status: 500}
    );
  }
}
