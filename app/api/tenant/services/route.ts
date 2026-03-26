import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Service from '@/models/Service';
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

        // Get search params for pagination, filtering, etc.
        const { searchParams } = new URL(req.url);
        const isActiveParam = searchParams.get('isActive');

        const query: any = { tenantId };

        if (isActiveParam !== null) {
            query.isActive = isActiveParam === 'true';
        }

        const services = await Service.find(query).sort({ createdAt: -1 });

        return NextResponse.json({ success: true, data: services }, { status: 200 });

    } catch (error: any) {
        console.error('Service GET API Error:', error);
        return NextResponse.json({ success: false, message: 'Hizmetler getirilirken hata oluştu' }, { status: 500 });
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

        // Basic validation can be replaced with Zod schema if available
        const { name, category, duration, price, currency, isActive, staffIds, description } = body;

        if (!name || !category || !duration?.value || price === undefined) {
            return NextResponse.json({ success: false, message: 'Eksik alanlar var (name, category, duration, price)' }, { status: 400 });
        }

        await connectDB();

        const service = await Service.create({
            tenantId,
            name,
            category,
            description,
            duration: {
                value: duration.value,
                unit: duration.unit || 'minutes'
            },
            price,
            currency: currency || 'TRY',
            isActive: isActive !== undefined ? isActive : true,
            staffIds: staffIds || []
        });

        return NextResponse.json({ success: true, message: 'Hizmet başarıyla eklendi', data: service }, { status: 201 });

    } catch (error: any) {
        console.error('Service POST API Error:', error);
        return NextResponse.json({ success: false, message: 'Hizmet eklenirken hata oluştu' }, { status: 500 });
    }
}
