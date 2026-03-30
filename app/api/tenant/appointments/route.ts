import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Appointment from '@/models/Appointment';
import { verifyToken } from '@/lib/jwt';

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

        const url = new URL(req.url);
        const customerId = url.searchParams.get('customerId');
        const staffId = url.searchParams.get('staffId');
        const code = url.searchParams.get('code');

        const query: any = { tenantId };
        if (customerId) query.customerId = customerId;
        if (staffId) query.staffId = staffId;
        if (code) query.code = code;

        const appointments = await Appointment.find(query)
            .populate('customerId', 'name phone email')
            .populate('serviceId', 'name duration price color')
            .populate('staffId', 'name')
            .sort({ startTime: -1 });

        return NextResponse.json({ success: true, data: appointments }, { status: 200 });

    } catch (error: any) {
        console.error('Appointments GET API Error:', error);
        return NextResponse.json({ success: false, message: 'Randevular getirilirken hata oluştu' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const tokenVal = req.cookies.get('token')?.value;
        if (!tokenVal) return NextResponse.json({ success: false, message: 'Yetkisiz erişim' }, { status: 401 });

        let decoded;
        try { decoded = verifyToken(tokenVal); }
        catch (err) { return NextResponse.json({ success: false, message: 'Geçersiz veya süresi dolmuş token' }, { status: 401 }); }

        const { tenantId } = decoded;
        if (!tenantId) return NextResponse.json({ success: false, message: 'Tenant bulunamadı' }, { status: 400 });

        const body = await req.json();
        const { customerId, serviceId, staffId, startTime, endTime, status, notes } = body;

        if (!customerId || !serviceId || !staffId || !startTime || !endTime) {
            return NextResponse.json({ success: false, message: 'Müşteri, hizmet, personel, başlangıç ve bitiş zamanı zorunludur' }, { status: 400 });
        }

        const start = new Date(startTime);
        const end = new Date(endTime);

        if (start >= end) {
            return NextResponse.json({ success: false, message: 'Bitiş zamanı başlangıç zamanından sonra olmalıdır' }, { status: 400 });
        }

        await connectDB();

        const appointment = new Appointment({
            tenantId,
            customerId,
            serviceId,
            staffId,
            startTime: start,
            endTime: end,
            status: status || 'pending',
            notes,
        });

        await appointment.save();

        const populated = await Appointment.findById(appointment._id)
            .populate('customerId', 'name phone email')
            .populate('serviceId', 'name duration price color')
            .populate('staffId', 'name email');

        return NextResponse.json({ success: true, message: 'Randevu başarıyla oluşturuldu', data: populated }, { status: 201 });

    } catch (error: any) {
        console.error('Appointments POST API Error:', error);
        return NextResponse.json({ success: false, message: 'Randevu oluşturulurken hata oluştu', error: error.message }, { status: 500 });
    }
}
