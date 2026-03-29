import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Tenant from '@/models/Tenant';
import Appointment from '@/models/Appointment';
import Service from '@/models/Service';
import Category from '@/models/Category';
import Customer from '@/models/Customer';
import Staff from '@/models/Staff';
import { verifyToken } from '@/lib/jwt';

/**
 * POST /api/user/delete/confirm
 * Verify OTP and final account deletion
 * Body: { code }
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
        const body = await req.json();
        const { code } = body;

        await connectDB();

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ success: false, message: 'Kullanıcı bulunamadı' }, { status: 404 });
        }

        // Verify OTP
        if (!user.deleteAccountOTP || user.deleteAccountOTP !== code) {
            return NextResponse.json({ success: false, message: 'Geçersiz doğrulama kodu' }, { status: 400 });
        }

        // Check if OTP is expired
        if (!user.deleteAccountOTPExpire || new Date() > user.deleteAccountOTPExpire) {
            return NextResponse.json({ success: false, message: 'Doğrulama kodunun süresi dolmuş' }, { status: 400 });
        }

        const tenantId = user.tenantId;
        const isAdmin = user.role === 'admin';

        // Perform cascading deletion if user is admin
        if (isAdmin && tenantId) {
            await Promise.all([
                Appointment.deleteMany({ tenantId }),
                Service.deleteMany({ tenantId }),
                Category.deleteMany({ tenantId }),
                Customer.deleteMany({ tenantId }),
                Staff.deleteMany({ tenantId }),
                User.deleteMany({ tenantId }), // Delete all users (staff, admins) associated with this tenant
                Tenant.findByIdAndDelete(tenantId),
            ]);
        } else {
            // Delete just the single user
            await User.findByIdAndDelete(userId);
        }

        const response = NextResponse.json({ 
            success: true, 
            message: 'Hesabınız ve tüm verileriniz kalıcı olarak silindi.' 
        }, { status: 200 });

        // Clear the session cookie
        response.cookies.delete('token');

        return response;

    } catch (error: any) {
        console.error('Delete Account Confirm API Error:', error);
        return NextResponse.json({ success: false, message: 'Hesap silinirken bir hata oluştu' }, { status: 500 });
    }
}
