import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Staff from '@/models/Staff';
import { verifyToken } from '@/lib/jwt';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const { id } = resolvedParams;
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

        const body = await req.json();

        await connectDB();

        const staff = await Staff.findOneAndUpdate(
            { _id: id, tenantId: decoded.tenantId },
            { $set: body },
            { new: true, runValidators: true }
        );

        if (!staff) {
            return NextResponse.json({ success: false, message: 'Personel bulunamadı veya güncellenemedi' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Personel başarıyla güncellendi', data: staff }, { status: 200 });

    } catch (error: any) {
        console.error('Staff PUT API Error:', error);
        return NextResponse.json({ success: false, message: 'Personel güncellenirken hata oluştu' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const { id } = resolvedParams;
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

        await connectDB();

        const staff = await Staff.findOneAndDelete({ _id: id, tenantId: decoded.tenantId });

        if (!staff) {
            return NextResponse.json({ success: false, message: 'Personel bulunamadı veya zaten silinmiş' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Personel başarıyla silindi' }, { status: 200 });

    } catch (error: any) {
        console.error('Staff DELETE API Error:', error);
        return NextResponse.json({ success: false, message: 'Personel silinirken hata oluştu' }, { status: 500 });
    }
}
