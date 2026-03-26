import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Visitor from "@/models/Visitor";
import { verifyToken } from "@/lib/jwt";

// Bu endpoint dashboard tarafında 5 saniyede bir poll edilerek "notified: false" olan ziyaretçileri sayar.
// Eğer varsa, bu ziyaretçilerin "notified" değerini true yapar ve kaç tane bulunduğunu döner.
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

        // Henüz bildirilmemiş ziyaretçileri bul
        const unnotifiedVisitors = await Visitor.find({ tenantId, notified: false });

        if (unnotifiedVisitors.length > 0) {
            const ids = unnotifiedVisitors.map(v => v._id);
            // Onları bildirildi olarak işaretle
            await Visitor.updateMany(
                { _id: { $in: ids } },
                { $set: { notified: true } }
            );
        }

        return NextResponse.json({
            success: true,
            newVisitorsCount: unnotifiedVisitors.length,
            newVisitors: unnotifiedVisitors
        });

    } catch (error: any) {
        console.error('API /tenant/visitors/poll error:', error);
        return NextResponse.json({ success: false, newVisitorsCount: 0, newVisitors: [] }, { status: 500 });
    }
}
