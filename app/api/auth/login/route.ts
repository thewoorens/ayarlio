import {NextRequest, NextResponse} from 'next/server';
import User from '@/models/User';
import * as argon2 from 'argon2';
import connectDB from '@/lib/db';
import {loginSchema} from '@/lib/validations/auth';
import {signToken} from '@/lib/jwt';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validatedData = loginSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        {success: false, errors: validatedData.error.flatten().fieldErrors},
        {status: 400}
      );
    }

    await connectDB();

    const {email, password} = validatedData.data;

    const user = await User.findOne({email}).select('+passwordHash');
    if (!user) {
      return NextResponse.json(
        {success: false},
        {status: 401}
      );
    }

    const isPasswordValid = await argon2.verify(user.passwordHash, password);
    if (!isPasswordValid) {
      return NextResponse.json(
        {success: false},
        {status: 401}
      );
    }

    const emailVerified = await User.findOne({email}).select('emailVerify');
    if (!emailVerified?.emailVerify) {
      return NextResponse.json(
        {success: false},
        {status: 409}
      );
    }

    const token = signToken({
      userId: user._id.toString(),
      role: user.role,
      tenantId: user.tenantId ? user.tenantId.toString() : '',
      isSetup: user.isSetup,
    });


    const response = NextResponse.json(
      {
        success: true
      },
      {status: 200}
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });
    return response;

  } catch (error) {
    console.error('Login API Error:', error);
    return NextResponse.json(
      {success: false, message: 'Server Error'},
      {status: 500}
    );
  }
}
