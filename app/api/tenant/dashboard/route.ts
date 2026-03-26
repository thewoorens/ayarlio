import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Appointment from "@/models/Appointment";
import Customer from "@/models/Customer";
import Service from "@/models/Service";
import Staff from "@/models/Staff";
import { verifyToken } from "@/lib/jwt";
import Tenant from "@/models/Tenant";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    const tokenVal = req.cookies.get("token")?.value;
    if (!tokenVal)
      return NextResponse.json({ success: false }, { status: 401 });

    let decoded;
    try {
      decoded = verifyToken(tokenVal);
    } catch (err) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const { tenantId } = decoded;
    if (!tenantId)
      return NextResponse.json({ success: false }, { status: 400 });

    await connectDB();

    Customer.schema;
    Service.schema;
    Staff.schema;

    const tenant = await Tenant.findById(tenantId)
      .select("name slug industry -_id")
      .lean();

    const user = await User.findOne({ tenantId })
      .select("name role -_id")
      .lean();
    type PopulatedAppointment = any;
    const appts: PopulatedAppointment[] = await Appointment.find({ tenantId })
      .populate("serviceId")
      .populate("customerId")
      .populate("staffId");

    const totalAppointments = appts.length;
    const activeCustomersCount = await Customer.countDocuments({
      tenantId,
      isActive: true,
    });

    let totalRevenue = 0;
    let cancelledCount = 0;

    appts.forEach((a) => {
      if (a.status === "completed" && a.serviceId?.price) {
        totalRevenue += a.serviceId.price;
      }
      if (a.status === "cancelled") {
        cancelledCount++;
      }
    });

    const cancelRate =
      totalAppointments > 0
        ? ((cancelledCount / totalAppointments) * 100).toFixed(1)
        : "0";

    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(
      today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1),
    );
    startOfWeek.setHours(0, 0, 0, 0);

    const weeklyData = [
      { day: "Pazartesi", value: 0 },
      { day: "Salı", value: 0 },
      { day: "Çarşamba", value: 0 },
      { day: "Perşembe", value: 0 },
      { day: "Cuma", value: 0 },
      { day: "Cumartesi", value: 0 },
      { day: "Pazar", value: 0 },
    ];

    const currentYear = today.getFullYear();
    const monthlyData = [
      { day: "Oca", value: 0 },
      { day: "Şub", value: 0 },
      { day: "Mar", value: 0 },
      { day: "Nis", value: 0 },
      { day: "May", value: 0 },
      { day: "Haz", value: 0 },
      { day: "Tem", value: 0 },
      { day: "Ağu", value: 0 },
      { day: "Eyl", value: 0 },
      { day: "Eki", value: 0 },
      { day: "Kas", value: 0 },
      { day: "Ara", value: 0 },
    ];

    const serviceCounts: Record<string, number> = {};
    const serviceNames: Record<string, string> = {};

    const todaysAppointments: any[] = [];
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    appts.forEach((a) => {
      const d = new Date(a.startTime);

      if (
        d >= startOfWeek &&
        d < new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000)
      ) {
        const dayIndex = d.getDay() === 0 ? 6 : d.getDay() - 1; // 0 for Monday, 6 for Sunday
        if (dayIndex >= 0 && dayIndex < 7) {
          weeklyData[dayIndex].value++;
        }
      }

      if (d.getFullYear() === currentYear) {
        monthlyData[d.getMonth()].value++;
      }

      if (a.serviceId) {
        const sid = a.serviceId._id.toString();
        serviceCounts[sid] = (serviceCounts[sid] || 0) + 1;
        serviceNames[sid] = a.serviceId.name;
      }

      if (d >= startOfDay && d <= endOfDay) {
        todaysAppointments.push(a);
      }
    });

    const serviceRanking = Object.entries(serviceCounts)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 5) // Top 5
      .map(([id, count], idx) => {
        const colors = ["#3b82f6", "#8b5cf6", "#22c55e", "#f59e0b", "#ec4899"];
        return {
          id,
          name: serviceNames[id] || "Bilinmeyen Hizmet",
          count,
          pct:
            totalAppointments > 0
              ? Math.round((count / totalAppointments) * 100)
              : 0,
          color: colors[idx % colors.length],
        };
      });

    const todayRows = todaysAppointments.map((a) => {
      const customerName = a.customerId
        ? `${a.customerId.firstName} ${a.customerId.lastName}`
        : "İsimsiz";
      let hash = 0;
      for (let i = 0; i < customerName.length; i++) {
        hash = customerName.charCodeAt(i) + ((hash << 5) - hash);
      }

      return {
        id: a._id.toString(),
        name: customerName,
        service: a.serviceId ? a.serviceId.name : "Bilinmeyen",
        time: new Date(a.startTime).toLocaleTimeString("tr-TR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        staff: a.staffId ? `${a.staffId.name}` : "Atanmamış",
        status: a.status,
        code: a.code,
      };
    });

    const todayFormattedDate = today.toLocaleDateString("tr-TR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

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
          dateString: todayFormattedDate,
          appointments: todayRows,
        },
      },
    });
  } catch (error: any) {
    console.error("API /tenant/dashboard error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
