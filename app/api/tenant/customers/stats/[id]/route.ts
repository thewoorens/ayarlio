import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Customer from '@/models/Customer';
import { verifyToken } from '@/lib/jwt';
import Appointment from "@/models/Appointment";
import Service from "@/models/Service";

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const customerId = params.id;
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

    const appointments = await Appointment.find({ tenantId, customerId, status: "confirmed" })
      .sort({ startTime: -1 })
      .lean();

    if (!appointments || appointments.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          visitCount: 0,
          spending: 0,
          lastVisit: null,
          favoriteServices: [],
          visitHistory: [],
          serviceDistribution: []
        }
      }, { status: 200 });
    }

    const serviceIds = [...new Set(appointments.map(app => app.serviceId.toString()))];
    const services = await Service.find({ _id: { $in: serviceIds }, tenantId }).lean();

    const serviceMap = services.reduce((acc, service) => {
      acc[service._id.toString()] = service;
      return acc;
    }, {} as Record<string, any>);

    let totalSpending = 0;
    const serviceCounts: Record<string, number> = {};
    const visitHistory = [];

    for (const appt of appointments) {
      const sId = appt.serviceId.toString();
      const serviceDetails = serviceMap[sId]?.updatedAt || null;

      visitHistory.push({
        serviceDetails
      });

      if (serviceDetails && serviceDetails.price) {
        totalSpending += serviceDetails.price;
      }

      serviceCounts[sId] = (serviceCounts[sId] || 0) + 1;
    }

    const maxCount = Math.max(...Object.values(serviceCounts));

    const favoriteServices = Object.keys(serviceCounts)
      .filter(id => serviceCounts[id] === maxCount)
      .map(id => serviceMap[id]?.name || 'Bilinmeyen Hizmet');

    const serviceDistribution = Object.keys(serviceCounts).map(id => ({
      name: serviceMap[id]?.name || 'Bilinmeyen Hizmet', // Dağılımı da sadece isimle sadeleştirebiliriz
      value: serviceCounts[id]
    }));

    const statics = {
      visitCount: appointments.length,
      spending: totalSpending,
      lastVisit: visitHistory[0],
      favoriteServices: favoriteServices, // Artık ["Saç Kesimi", "Sakal Tıraşı"] gibi bir dizi dönecek
      visitHistory: visitHistory,
      serviceDistribution: serviceDistribution
    };

    return NextResponse.json({ success: true, data: statics }, { status: 200 });

  } catch (error: any) {
    console.error('Customer Stats GET API Error:', error);
    return NextResponse.json({ success: false, message: 'İstatistikler getirilirken hata oluştu' }, { status: 500 });
  }
}
