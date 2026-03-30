import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';
import * as argon2 from 'argon2';

export async function POST(req: NextRequest) {
    try {
        const tokenVal = req.cookies.get('token')?.value;
        if (!tokenVal) {
            return NextResponse.json({ success: false, message: 'Yetkisiz erişim' }, { status: 401 });
        }

        let decoded;
        try {
            decoded = verifyToken(tokenVal);
        } catch (err) {
            return NextResponse.json({ success: false, message: 'Geçersiz veya süresi dolmuş token' }, { status: 401 });
        }

        const { userId } = decoded;
        const body = await req.json();
        const { currentPassword, newPassword } = body;

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ success: false, message: 'Mevcut şifre ve yeni şifre gereklidir' }, { status: 400 });
        }

        await connectDB();

        const user = await User.findById(userId).select('+passwordHash');
        if (!user) {
            return NextResponse.json({ success: false, message: 'Kullanıcı bulunamadı' }, { status: 404 });
        }

        // Verify current password
        const isPasswordValid = await argon2.verify(user.passwordHash, currentPassword);
        if (!isPasswordValid) {
            return NextResponse.json({ success: false, message: 'Mevcut şifre hatalı' }, { status: 401 });
        }

        // Hash new password
        const newPasswordHash = await argon2.hash(newPassword);

        // Save new password hash
        user.passwordHash = newPasswordHash;
        await user.save();

        return NextResponse.json({ success: true, message: 'Şifreniz başarıyla değiştirildi' }, { status: 200 });

    } catch (error: any) {
        console.error('Password Change API Error:', error);
        return NextResponse.json({ success: false, message: 'Şifre değiştirilirken bir hata oluştu' }, { status: 500 });
    }
}
