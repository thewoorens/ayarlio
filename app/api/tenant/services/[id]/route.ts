import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Service from '@/models/Service';
import { verifyToken } from '@/lib/jwt';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

        const service = await Service.findOne({ _id: id, tenantId: decoded.tenantId });

        if (!service) {
            return NextResponse.json({ success: false, message: 'Hizmet bulunamadı' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: service }, { status: 200 });

    } catch (error: any) {
        console.error('Service GET (single) API Error:', error);
        return NextResponse.json({ success: false, message: 'Hizmet getirilirken hata oluştu' }, { status: 500 });
    }
}

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

        // Map frontend fields (e.g. form payload to schema payload correctly if required)
        const updateData = { ...body };
        if (body.duration) {
            updateData.duration = {
                value: body.duration.value,
                unit: body.duration.unit || 'minutes'
            };
        }

        await connectDB();

        // Ensure the service belongs to this tenant and update it
        const service = await Service.findOneAndUpdate(
            { _id: id, tenantId: decoded.tenantId },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!service) {
            return NextResponse.json({ success: false, message: 'Hizmet bulunamadı veya güncellenemedi' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Hizmet başarıyla güncellendi', data: service }, { status: 200 });

    } catch (error: any) {
        console.error('Service PUT API Error:', error);
        return NextResponse.json({ success: false, message: 'Hizmet güncellenirken hata oluştu' }, { status: 500 });
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

        const service = await Service.findOneAndDelete({ _id: id, tenantId: decoded.tenantId });

        if (!service) {
            return NextResponse.json({ success: false, message: 'Hizmet bulunamadı veya zaten silinmiş' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Hizmet başarıyla silindi' }, { status: 200 });

    } catch (error: any) {
        console.error('Service DELETE API Error:', error);
        return NextResponse.json({ success: false, message: 'Hizmet silinirken hata oluştu' }, { status: 500 });
    }
}
