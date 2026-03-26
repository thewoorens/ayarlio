import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Notification from "@/models/Notification";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
    try {
        const tokenVal = req.cookies.get('token')?.value;
        if (!tokenVal) return NextResponse.json({ success: false, message: 'Yetkisiz erişim' }, { status: 401 });

        let decoded;
        try { decoded = verifyToken(tokenVal); }
        catch (err) { return NextResponse.json({ success: false, message: 'Geçersiz veya süresi dolmuş token' }, { status: 401 }); }

        const { tenantId } = decoded;
        if (!tenantId) return NextResponse.json({ success: false, message: 'Tenant bulunamadı' }, { status: 400 });

        await connectDB();

        // Son 50 in-app bildirimi getir (en yeniler en üstte)
        const notifications = await Notification.find({ tenantId, type: 'in-app' })
            .sort({ createdAt: -1 })
            .limit(50);

        return NextResponse.json({ success: true, data: notifications });

    } catch (error: any) {
        console.error('API /tenant/notifications error:', error);
        return NextResponse.json({ success: false, message: 'Bildirimler alınırken hata oluştu.' }, { status: 500 });
    }
}
