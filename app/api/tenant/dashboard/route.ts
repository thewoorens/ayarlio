import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Appointment from "@/models/Appointment";
import Customer from "@/models/Customer";
import { verifyToken } from "@/lib/jwt";
import Tenant from "@/models/Tenant";
import User from "@/models/User";
import Service from "@/models/Service";

export async function GET(req: NextRequest) {
  try {
    const tokenVal = req.cookies.get("token")?.value;
    if (!tokenVal)
      return NextResponse.json({ success: false }, { status: 401 });

    let decoded;
    try {
      decoded = verifyToken(tokenVal);
    } catch {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const { tenantId } = decoded;
    if (!tenantId)
      return NextResponse.json({ success: false }, { status: 400 });

    await connectDB();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
    );

    const [tenant, user, activeCustomersCount, appts] = await Promise.all([
      Tenant.findById(tenantId).select("name slug industry -_id").lean(),
      User.findOne({ tenantId }).select("name role -_id").lean(),
      Customer.countDocuments({ tenantId, isActive: true }),

      Appointment.find({
        tenantId,
        startTime: { $gte: startOfMonth, $lte: endOfMonth },
      })
        .populate("serviceId")
        .populate("customerId")
        .populate("staffId")
        .lean(),
    ]);

    const totalAppointments = appts.length;

    let totalRevenue = 0;
    let cancelledCount = 0;

    for (const a of appts) {
      if (a.status === "completed" && a.serviceId?.price) {
        totalRevenue += a.serviceId.price;
      }
      if (a.status === "cancelled") {
        cancelledCount++;
      }
    }

    const cancelRate =
      totalAppointments > 0
        ? ((cancelledCount / totalAppointments) * 100).toFixed(1)
        : "0.0";

    const weeklyData = Array.from({ length: 7 }, (_, i) => ({
      day: ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"][i],
      value: 0,
    }));

    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      day: [
        "Oca",
        "Şub",
        "Mar",
        "Nis",
        "May",
        "Haz",
        "Tem",
        "Ağu",
        "Eyl",
        "Eki",
        "Kas",
        "Ara",
      ][i],
      value: 0,
    }));

    const serviceCounts: Record<string, number> = {};
    const serviceNames: Record<string, string> = {};

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todaysAppointments: any[] = [];

    for (const a of appts) {
      const d = new Date(a.startTime);

      const dayIndex = d.getDay() === 0 ? 6 : d.getDay() - 1;
      weeklyData[dayIndex].value++;

      monthlyData[d.getMonth()].value++;

      if (a.serviceId) {
        const id = a.serviceId._id.toString();
        serviceCounts[id] = (serviceCounts[id] || 0) + 1;
        serviceNames[id] = a.serviceId.name;
      }

      if (d >= startOfDay && d <= endOfDay) {
        todaysAppointments.push(a);
      }
    }

    const colors = ["#3b82f6", "#8b5cf6", "#22c55e", "#f59e0b", "#ec4899"];

    const serviceRanking = Object.entries(serviceCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id, count], idx) => ({
        id,
        name: serviceNames[id] || "Bilinmeyen",
        count,
        pct: totalAppointments
          ? Math.round((count / totalAppointments) * 100)
          : 0,
        color: colors[idx % colors.length],
      }));

    const todayRows = todaysAppointments.map((a) => ({
      id: a._id.toString(),
      name: a.customerId
        ? `${a.customerId.name}`
        : "İsimsiz",
      service: a.serviceId?.name || "Bilinmeyen",
      time: new Date(a.startTime).toLocaleTimeString("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      staff: a.staffId?.name || "Atanmamış",
      status: a.status,
      code: a.code,
    }));

    return NextResponse.json({
      success: true,
      data: {
        tenant,
        user,
        stats: {
          totalAppointments,
          activeCustomers: activeCustomersCount,
          totalRevenue,
          cancelRate,
        },
        charts: {
          weekly: weeklyData,
          monthly: monthlyData,
        },
        topServices: serviceRanking,
        today: {
          dateString: now.toLocaleDateString("tr-TR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          appointments: todayRows,
        },
      },
    });
  } catch (error) {
    console.error("API /tenant/dashboard error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
