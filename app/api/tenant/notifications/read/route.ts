import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Notification from "@/models/Notification";
import { verifyToken } from "@/lib/jwt";

export async function PUT(req: NextRequest) {
    try {
        const tokenVal = req.cookies.get('token')?.value;
        if (!tokenVal) return NextResponse.json({ success: false, message: 'Yetkisiz erişim' }, { status: 401 });

        let decoded;
        try { decoded = verifyToken(tokenVal); }
        catch (err) { return NextResponse.json({ success: false, message: 'Geçersiz veya süresi dolmuş token' }, { status: 401 }); }

        const { tenantId } = decoded;
        if (!tenantId) return NextResponse.json({ success: false, message: 'Tenant bulunamadı' }, { status: 400 });

        await connectDB();

        const body = await req.json();
        const { notificationIds, markAll } = body;

        // If markAll is true, mark all unread for this tenant
        if (markAll) {
            await Notification.updateMany(
                { tenantId, type: 'in-app', readAt: { $exists: false } },
                { $set: { readAt: new Date(), status: 'sent' } }
            );
            return NextResponse.json({ success: true, message: 'Tüm bildirimler okundu olarak işaretlendi.' });
        }

        // If array of IDs provided
        if (notificationIds && Array.isArray(notificationIds)) {
            await Notification.updateMany(
                { _id: { $in: notificationIds }, tenantId, type: 'in-app' },
                { $set: { readAt: new Date(), status: 'sent' } }
            );
            return NextResponse.json({ success: true, message: 'Seçili bildirimler okundu olarak işaretlendi.' });
        }

        return NextResponse.json({ success: false, message: 'Geçersiz istek parametreleri.' }, { status: 400 });

    } catch (error: any) {
        console.error('API /tenant/notifications/read error:', error);
        return NextResponse.json({ success: false, message: 'İşlem sırasında hata oluştu.' }, { status: 500 });
    }
}
