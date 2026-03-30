import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Tenant from '@/models/Tenant';
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

        const tenant = await Tenant.findById(tenantId);

        if (!tenant) {
            return NextResponse.json({ success: false, message: 'İşletme hesabı bulunamadı' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: tenant }, { status: 200 });

    } catch (error: any) {
        console.error('Settings GET API Error:', error);
        return NextResponse.json({ success: false, message: 'Ayarlar getirilirken hata oluştu' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
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
        const { _id, slug, ...updateFields } = body; // Destructure forbidden properties

        if (updateFields.settings) {
            delete updateFields.settings.brandName;
            delete updateFields.settings.brandSlogan;
            delete updateFields.settings.brandColor;
        }

        await connectDB();

        // Update workingHours and settings safely utilizing Dot Notation under the hood for nested Objects or plain merge
        const tenant = await Tenant.findByIdAndUpdate(
            tenantId,
            {
                $set: updateFields,
            },
            { new: true, runValidators: true }
        );

        if (!tenant) {
            return NextResponse.json({ success: false, message: 'İşletme hesabı bulunamadı veya güncellenemedi' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Ayarlar başarıyla güncellendi', data: tenant }, { status: 200 });

    } catch (error: any) {
        console.error('Settings PUT API Error:', error);
        return NextResponse.json({ success: false, message: 'Ayarlar güncellenirken hata oluştu' }, { status: 500 });
    }
}
