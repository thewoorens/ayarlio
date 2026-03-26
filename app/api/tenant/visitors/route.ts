import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Visitor from "@/models/Visitor";
import Tenant from "@/models/Tenant";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { tenantId } = body;

        if (!tenantId) {
            return NextResponse.json({ success: false, message: 'Geçersiz parametreler' }, { status: 400 });
        }

        await connectDB();

        const tenant = await Tenant.findById(tenantId);
        if (!tenant) {
            return NextResponse.json({ success: false, message: 'İşletme bulunamadı' }, { status: 404 });
        }

        const userAgent = req.headers.get('user-agent') || 'Bilinmiyor';
        const referer = req.headers.get('referer') || 'Doğrudan/Bilinmiyor';

        const visitor = new Visitor({
            tenantId,
            userAgent,
            referer,
            notified: false
        });
        await visitor.save();

        return NextResponse.json({ success: true, message: 'Visitor logged' });

    } catch (error: any) {
        console.error('API /tenant/visitors error:', error);
        return NextResponse.json({ success: false, message: 'İşlem sırasında hata oluştu.' }, { status: 500 });
    }
}
