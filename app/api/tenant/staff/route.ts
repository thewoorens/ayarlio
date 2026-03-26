import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Staff from '@/models/Staff';
import { verifyToken } from '@/lib/jwt';

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

        const { tenantId } = decoded;

        if (!tenantId) {
            return NextResponse.json({ success: false, message: 'Tenant bulunamadı' }, { status: 400 });
        }

        await connectDB();

        const staffList = await Staff.find({ tenantId }).sort({ createdAt: -1 });

        return NextResponse.json({ success: true, data: staffList }, { status: 200 });

    } catch (error: any) {
        console.error('Staff GET API Error:', error);
        return NextResponse.json({ success: false, message: 'Personeller getirilirken hata oluştu' }, { status: 500 });
    }
}

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

        const { tenantId } = decoded;

        if (!tenantId) {
            return NextResponse.json({ success: false, message: 'Tenant bulunamadı' }, { status: 400 });
        }

        const body = await req.json();

        if (!body.name) {
            return NextResponse.json({ success: false, message: 'Personel adı zorunludur' }, { status: 400 });
        }

        await connectDB();

        const staffObj = await Staff.create({ ...body, tenantId });

        return NextResponse.json({ success: true, message: 'Personel başarıyla eklendi', data: staffObj }, { status: 201 });

    } catch (error: any) {
        console.error('Staff POST API Error:', error);
        return NextResponse.json({ success: false, message: 'Personel eklenirken hata oluştu' }, { status: 500 });
    }
}
