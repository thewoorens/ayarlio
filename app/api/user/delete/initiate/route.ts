import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';
import { sendEmail } from '@/lib/resend';
import { deleteAccountOTPTemplate } from '@/lib/email-templates';

/**
 * POST /api/user/delete/initiate
 * Generate and send OTP for account deletion verification
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

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Save OTP and expiry (10 minutes)
        user.deleteAccountOTP = otp;
        user.deleteAccountOTPExpire = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        // Send Email
        await sendEmail({
            to: user.email,
            subject: 'Hesap Silme Doğrulama Kodu',
            html: deleteAccountOTPTemplate(otp)
        });

        return NextResponse.json({ 
            success: true, 
            message: 'Doğrulama kodu e-posta adresinize gönderildi.' 
        }, { status: 200 });

    } catch (error: any) {
        console.error('Delete Account Initiate API Error:', error);
        return NextResponse.json({ success: false, message: 'Doğrulama kodu gönderilirken bir hata oluştu' }, { status: 500 });
    }
}
