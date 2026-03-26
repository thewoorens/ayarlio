import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Appointment from '@/models/Appointment';
import { verifyToken } from '@/lib/jwt';

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
    try {
        const params = await props.params;
        const appointmentId = params.id;

        if (!appointmentId) return NextResponse.json({ success: false, message: 'Randevu ID bulunamadı' }, { status: 400 });

        const tokenVal = req.cookies.get('token')?.value;
        if (!tokenVal) return NextResponse.json({ success: false, message: 'Yetkisiz erişim' }, { status: 401 });

        let decoded;
        try { decoded = verifyToken(tokenVal); }
        catch (err) { return NextResponse.json({ success: false, message: 'Geçersiz veya süresi dolmuş token' }, { status: 401 }); }

        const { tenantId } = decoded;
        if (!tenantId) return NextResponse.json({ success: false, message: 'Tenant bulunamadı' }, { status: 400 });

        await connectDB();

        const appointment = await Appointment.findOne({ _id: appointmentId, tenantId })
            .populate('customerId', 'firstName lastName phone email')
            .populate('serviceId', 'name duration price color')
            .populate('staffId', 'name email');

        if (!appointment) return NextResponse.json({ success: false, message: 'Randevu bulunamadı' }, { status: 404 });

        return NextResponse.json({ success: true, data: appointment }, { status: 200 });

    } catch (error: any) {
        console.error('Appointment GET API Error:', error);
        return NextResponse.json({ success: false, message: 'Randevu getirilirken hata oluştu' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
    try {
        const params = await props.params;
        const appointmentId = params.id;

        if (!appointmentId) return NextResponse.json({ success: false, message: 'Randevu ID bulunamadı' }, { status: 400 });

        const tokenVal = req.cookies.get('token')?.value;
        if (!tokenVal) return NextResponse.json({ success: false, message: 'Yetkisiz erişim' }, { status: 401 });

        let decoded;
        try { decoded = verifyToken(tokenVal); }
        catch (err) { return NextResponse.json({ success: false, message: 'Geçersiz veya süresi dolmuş token' }, { status: 401 }); }

        const { tenantId } = decoded;
        if (!tenantId) return NextResponse.json({ success: false, message: 'Tenant bulunamadı' }, { status: 400 });

        const body = await req.json();
        const { customerId, serviceId, staffId, startTime, endTime, status, notes, cancellationReason } = body;

        await connectDB();

        const updateData: any = {};
        if (customerId) updateData.customerId = customerId;
        if (serviceId) updateData.serviceId = serviceId;
        if (staffId) updateData.staffId = staffId;
        if (startTime) updateData.startTime = new Date(startTime);
        if (endTime) updateData.endTime = new Date(endTime);
        if (status) updateData.status = status;
        if (notes !== undefined) updateData.notes = notes;
        if (cancellationReason !== undefined) updateData.cancellationReason = cancellationReason;

        if (updateData.startTime && updateData.endTime) {
            if (updateData.startTime >= updateData.endTime) {
                return NextResponse.json({ success: false, message: 'Bitiş zamanı başlangıç zamanından sonra olmalıdır' }, { status: 400 });
            }
        }

        const appointment = await Appointment.findOneAndUpdate(
            { _id: appointmentId, tenantId },
            { $set: updateData },
            { new: true, runValidators: true }
        )
            .populate('customerId', 'firstName lastName phone email')
            .populate('serviceId', 'name duration price color')
            .populate('staffId', 'name email');

        if (!appointment) return NextResponse.json({ success: false, message: 'Randevu bulunamadı veya güncellenemedi' }, { status: 404 });

        return NextResponse.json({ success: true, message: 'Randevu başarıyla güncellendi', data: appointment }, { status: 200 });

    } catch (error: any) {
        console.error('Appointment PUT API Error:', error);
        return NextResponse.json({ success: false, message: 'Randevu güncellenirken hata oluştu', error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
    try {
        const params = await props.params;
        const appointmentId = params.id;

        if (!appointmentId) return NextResponse.json({ success: false, message: 'Randevu ID bulunamadı' }, { status: 400 });

        const tokenVal = req.cookies.get('token')?.value;
        if (!tokenVal) return NextResponse.json({ success: false, message: 'Yetkisiz erişim' }, { status: 401 });

        let decoded;
        try { decoded = verifyToken(tokenVal); }
        catch (err) { return NextResponse.json({ success: false, message: 'Geçersiz veya süresi dolmuş token' }, { status: 401 }); }

        const { tenantId } = decoded;
        if (!tenantId) return NextResponse.json({ success: false, message: 'Tenant bulunamadı' }, { status: 400 });

        await connectDB();

        const appointment = await Appointment.findOneAndDelete({ _id: appointmentId, tenantId });

        if (!appointment) return NextResponse.json({ success: false, message: 'Randevu bulunamadı veya silinemedi' }, { status: 404 });

        return NextResponse.json({ success: true, message: 'Randevu başarıyla silindi' }, { status: 200 });

    } catch (error: any) {
        console.error('Appointment DELETE API Error:', error);
        return NextResponse.json({ success: false, message: 'Randevu silinirken hata oluştu' }, { status: 500 });
    }
}
