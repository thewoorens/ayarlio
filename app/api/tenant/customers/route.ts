import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Customer from '@/models/Customer';
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

        // Get all customers for this tenant and sort by most recent
        const customers = await Customer.find({ tenantId }).sort({ createdAt: -1 });

        return NextResponse.json({ success: true, data: customers }, { status: 200 });

    } catch (error: any) {
        console.error('Customers GET API Error:', error);
        return NextResponse.json({ success: false, message: 'Müşteriler getirilirken hata oluştu' }, { status: 500 });
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

        // Destructure and validate required fields with trimming
        const name = body.name?.trim();
        const email = body.email?.trim()?.toLowerCase();
        const phone = body.phone?.trim();
        const notes = body.notes?.trim();
        const isActive = body.isActive;

        if (!name || !email) {
            return NextResponse.json({ success: false, message: 'Ad Soyad ve E-posta zorunludur' }, { status: 400 });
        }

        await connectDB();

        // Check if customer with same email exists for this tenant
        const existingCustomer = await Customer.findOne({ tenantId, email });
        if (existingCustomer) {
            return NextResponse.json({ success: false, message: 'Bu e-posta adresiyle kayıtlı bir müşteri zaten mevcut' }, { status: 409 });
        }

        const customer = new Customer({
            tenantId,
            name,
            email,
            phone,
            notes,
            isActive: isActive !== undefined ? isActive : true,
        });

        await customer.save();

        return NextResponse.json({ success: true, message: 'Müşteri başarıyla oluşturuldu', data: customer }, { status: 201 });

    } catch (error: any) {
        console.error('Customers POST API Error:', error);
        return NextResponse.json({ success: false, message: 'Müşteri oluşturulurken hata oluştu', error: error.message }, { status: 500 });
    }
}
