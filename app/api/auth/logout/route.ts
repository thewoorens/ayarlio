import {NextResponse} from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json(
      {success: true},
      {status: 200}
    );

    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Logout API Error:', error);
    return NextResponse.json(
      {success: false},
      {status: 500}
    );
  }
}
