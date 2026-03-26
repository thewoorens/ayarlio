import {NextRequest, NextResponse} from "next/server";
import * as argon2 from "argon2";
import crypto from "crypto";
import User from "@/models/User";
import connectDB from "@/lib/db";
import {registerSchema} from "@/lib/validations/auth";
import {sendEmail} from "@/lib/resend";
import {verifyEmailTemplate} from "@/lib/email-templates";

const ALLOWED_EMAIL_DOMAINS = [
  "gmail.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "proton.me",
  "protonmail.com",
  "icloud.com",
  "yahoo.com",
];

function isAllowedEmailDomain(email: string) {
  const domain = email.split("@")[1]?.toLowerCase();
  return !!domain && ALLOWED_EMAIL_DOMAINS.includes(domain);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = registerSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        {success: false, errors: validatedData.error.flatten().fieldErrors},
        {status: 400}
      );
    }

    const {name, email, phone, password} = validatedData.data;

    if (!isAllowedEmailDomain(email)) {
      return NextResponse.json(
        {success: false, message: "Bu e-posta sağlayıcısı desteklenmiyor"},
        {status: 400}
      );
    }

    await connectDB();

    const existingUser = await User.findOne({email});
    if (existingUser) {
      return NextResponse.json(
        {success: false, message: "Bu e-posta zaten kullanılıyor"},
        {status: 409}
      );
    }

    const passwordHash = await argon2.hash(password);

    const verifyTokenRaw = crypto.randomBytes(32).toString("hex");
    const verifyEmailToken = crypto.createHash("sha256").update(verifyTokenRaw).digest("hex");
    const verifyEmailExpire = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await User.create({
      name,
      email,
      phone,
      passwordHash,
      role: "admin",
      emailVerify: false,
      verifyEmailToken,
      verifyEmailExpire,
    });

    const host = req.headers.get("host") || "localhost:3000";
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const verifyUrl = `${protocol}://${host}/api/auth/verify-email?token=${verifyTokenRaw}`;

    try {
      await sendEmail({
        to: email,
        subject: "Ayarlio - E-Posta Adresinizi Doğrulayın",
        html: verifyEmailTemplate(verifyUrl),
      });
    } catch (emailError) {
      console.error("Email Error:", emailError);
    }

    return NextResponse.json({success: true}, {status: 201});
  } catch (error) {
    console.error("Register API Error:", error);
    return NextResponse.json(
      {success: false, message: "Sunucu hatası"},
      {status: 500}
    );
  }
}
