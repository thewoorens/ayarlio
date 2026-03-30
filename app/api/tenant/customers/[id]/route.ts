import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Customer from '@/models/Customer';
import { verifyToken } from '@/lib/jwt';

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
    try {
        const params = await props.params;
        const customerId = params.id;

        if (!customerId) {
            return NextResponse.json({ success: false, message: 'Müşteri ID bulunamadı' }, { status: 400 });
        }

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
        
        // Trimming inputs
        const name = body.name?.trim();
        const email = body.email?.trim()?.toLowerCase();
        const phone = body.phone?.trim();
        const notes = body.notes?.trim();
        const isActive = body.isActive;

        await connectDB();

        // Check if updating email to one that already exists for this tenant
        if (email) {
            const existingCustomer = await Customer.findOne({ tenantId, email, _id: { $ne: customerId } });
            if (existingCustomer) {
                return NextResponse.json({ success: false, message: 'Bu e-posta adresiyle kayıtlı başka bir müşteri zaten mevcut' }, { status: 409 });
            }
        }

        const updateData: any = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (phone !== undefined) updateData.phone = phone;
        if (notes !== undefined) updateData.notes = notes;
        if (isActive !== undefined) updateData.isActive = isActive;

        const customer = await Customer.findOneAndUpdate(
            { _id: customerId, tenantId }, // Ensure tenant ownership for security
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!customer) {
            return NextResponse.json({ success: false, message: 'Müşteri bulunamadı veya güncellenemedi' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Müşteri başarıyla güncellendi', data: customer }, { status: 200 });

    } catch (error: any) {
        console.error('Customers PUT API Error:', error);
        return NextResponse.json({ success: false, message: 'Müşteri güncellenirken hata oluştu', error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
    try {
        const params = await props.params;
        const customerId = params.id;

        if (!customerId) {
            return NextResponse.json({ success: false, message: 'Müşteri ID bulunamadı' }, { status: 400 });
        }

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

        // Delete the customer, ensuring it belongs to the current tenant
        const customer = await Customer.findOneAndDelete({ _id: customerId, tenantId });

        if (!customer) {
            return NextResponse.json({ success: false, message: 'Müşteri bulunamadı veya silinemedi' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Müşteri başarıyla silindi' }, { status: 200 });

    } catch (error: any) {
        console.error('Customers DELETE API Error:', error);
        return NextResponse.json({ success: false, message: 'Müşteri silinirken hata oluştu' }, { status: 500 });
    }
}
