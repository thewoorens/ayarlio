import {NextRequest, NextResponse} from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {token} = body;

    if (!token) {
      return NextResponse.json(
        {success: false},
        {status: 404}
      );
    }

    await connectDB();

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: {$gt: new Date()}
    });

    if (!user) {
      return NextResponse.json(
        {success: false},
        {status: 400}
      );
    }

    return NextResponse.json({success: true}, {status: 200});

  } catch (error) {
    console.error('Validate Reset Token API Error:', error);
    return NextResponse.json(
      {success: false},
      {status: 500}
    );
  }
}
