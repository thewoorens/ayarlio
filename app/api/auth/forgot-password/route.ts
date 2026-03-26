import {NextRequest, NextResponse} from 'next/server';
import crypto from 'crypto';
import User from '@/models/User';
import {forgotPasswordSchema} from '@/lib/validations/auth';
import connectDB from '@/lib/db';
import {sendEmail} from '@/lib/resend';
import {resetPasswordTemplate} from '@/lib/email-templates';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validatedData = forgotPasswordSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        {success: false, errors: validatedData.error.flatten().fieldErrors},
        {status: 400}
      );
    }

    await connectDB();

    const {email} = validatedData.data;

    const user = await User.findOne({email});
    if (!user) {
      return NextResponse.json(
        {success: false},
        {status: 404}
      );
    }

    const resetTokenRaw = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(resetTokenRaw).digest('hex');

    await User.findOneAndUpdate(
      {email},
      {
        resetPasswordToken: tokenHash,
        resetPasswordExpire: new Date(Date.now() + 60 * 60 * 1000)
      }
    );

    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const resetUrl = `${protocol}://${host}/parola-sifirla?token=${resetTokenRaw}`;

    try {
      await sendEmail({
        to: email,
        subject: 'Ayarlio - Parolanızı Sıfırlayın',
        html: resetPasswordTemplate(resetUrl)
      });
    } catch (emailError) {
      console.error('Email Error:', emailError);
      await User.findOneAndUpdate(
        {email},
        {$unset: {resetPasswordToken: 1, resetPasswordExpire: 1}}
      );
      return NextResponse.json(
        {success: false},
        {status: 500}
      );
    }

    return NextResponse.json(
      {success: true},
      {status: 200}
    );

  } catch (error) {
    console.error('Forgot Password API Error:', error);
    return NextResponse.json(
      {success: false},
      {status: 500}
    );
  }
}
