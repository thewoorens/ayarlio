import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';

/**
 * POST /api/user/logout-all
 * Force logout from all devices by incrementing tokenVersion
 */
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
        await connectDB();

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ success: false, message: 'Kullanıcı bulunamadı' }, { status: 404 });
        }

        // Increment tokenVersion to invalidate all existing tokens
        user.tokenVersion = (user.tokenVersion || 0) + 1;
        await user.save();

        const response = NextResponse.json({ 
            success: true, 
            message: 'Tüm oturumlardan başarıyla çıkış yapıldı. Lütfen tekrar giriş yapın.' 
        }, { status: 200 });

        // Clear the current session cookie as well
        response.cookies.delete('token');

        return response;

    } catch (error: any) {
        console.error('Logout All API Error:', error);
        return NextResponse.json({ success: false, message: 'Oturumlar kapatılırken bir hata oluştu' }, { status: 500 });
    }
}
