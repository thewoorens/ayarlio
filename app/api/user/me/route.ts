import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';

/**
 * GET /api/user/me
 * Returns the current user's profile
 */
export async function GET(req: NextRequest) {
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

        const { userId, tokenVersion } = decoded;
        await connectDB();

        const user = await User.findById(userId).select('-passwordHash');
        if (!user) {
            return NextResponse.json({ success: false, message: 'Kullanıcı bulunamadı' }, { status: 404 });
        }

        // Check if token version matches user's current version
        if (tokenVersion !== user.tokenVersion) {
            return NextResponse.json({ success: false, message: 'Oturum süresi dolmuş, lütfen tekrar giriş yapın' }, { status: 401 });
        }

        return NextResponse.json({ success: true, data: user }, { status: 200 });

    } catch (error: any) {
        console.error('User GET API Error:', error);
        return NextResponse.json({ success: false, message: 'Sunucu hatası' }, { status: 500 });
    }
}

/**
 * PATCH /api/user/me
 * Updates the current user's profile info
 */
export async function PATCH(req: NextRequest) {
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

        const { userId, tokenVersion } = decoded;
        const body = await req.json();
        const { name, email, phone } = body;

        await connectDB();

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ success: false, message: 'Kullanıcı bulunamadı' }, { status: 404 });
        }

        // Check if token version matches user's current version
        if (tokenVersion !== user.tokenVersion) {
            return NextResponse.json({ success: false, message: 'Oturum süresi dolmuş, lütfen tekrar giriş yapın' }, { status: 401 });
        }

        // Check if email is already taken by another user
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email, _id: { $ne: userId } });
            if (existingUser) {
                return NextResponse.json({ success: false, message: 'Bu e-posta adresi zaten kullanılıyor' }, { status: 400 });
            }
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.phone = phone || user.phone;
        await user.save();

        const updatedUser = user.toObject();
        delete updatedUser.passwordHash;

        return NextResponse.json({ success: true, message: 'Bilgiler başarıyla güncellendi', data: updatedUser }, { status: 200 });

    } catch (error: any) {
        console.error('User PATCH API Error:', error);
        return NextResponse.json({ success: false, message: 'Bilgiler güncellenirken bir hata oluştu' }, { status: 500 });
    }
}
