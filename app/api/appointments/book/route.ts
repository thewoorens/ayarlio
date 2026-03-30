import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Appointment from "@/models/Appointment";
import Customer from "@/models/Customer";
import Tenant from "@/models/Tenant";
import Staff from "@/models/Staff";
import Service from "@/models/Service";
import { sendEmail } from "@/lib/resend";
import { appointmentConfirmationTemplate } from "@/lib/email-templates";

const DAYS_MAP = ["Paz", "Pzt", "Sal", "Çrş", "Prş", "Cum", "Cmt"];

const parseTime = (timeStr: string) => {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      tenantId,
      serviceId,
      staffId,
      startTime,
      endTime,
      customerName,
      customerPhone,
      customerEmail,
      customerNote,
    } = body;

    if (
      !tenantId ||
      !serviceId ||
      !staffId ||
      !startTime ||
      !endTime ||
      !customerName ||
      !customerPhone ||
      !customerEmail
    ) {
      return NextResponse.json(
        { success: false, message: "Eksik bilgi girdiniz." },
        { status: 400 },
      );
    }

    await connectDB();

    const tenant = await Tenant.findById(tenantId);
    if (!tenant || !tenant.isActive) {
      return NextResponse.json(
        { success: false, message: "Geçersiz işletme." },
        { status: 400 },
      );
    }

    const staff = await Staff.findById(staffId);
    if (!staff) {
      return NextResponse.json(
        { success: false, message: "Kayıtlı personel bulunamadı." },
        { status: 404 },
      );
    }
    if (staff.status !== "active") {
      return NextResponse.json(
        { success: false, message: "Bu personel şu anda aktif değil." },
        { status: 400 },
      );
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    // Validate working days
    const dayName = DAYS_MAP[start.getDay()];
    if (!staff.workDays.includes(dayName)) {
      return NextResponse.json(
        { success: false, message: "Personel seçilen günde çalışmamaktadır." },
        { status: 400 },
      );
    }

    // Validate working hours
    const apptStartMins = start.getHours() * 60 + start.getMinutes();
    const apptEndMins = end.getHours() * 60 + end.getMinutes();
    const staffStartMins = parseTime(staff.startTime);
    const staffEndMins = parseTime(staff.endTime);

    if (apptStartMins < staffStartMins || apptEndMins > staffEndMins) {
      return NextResponse.json(
        { success: false, message: "Seçilen saatler personelin çalışma saatleri dışındadır." },
        { status: 400 },
      );
    }

    const conflict = await Appointment.findOne({
      tenantId,
      staffId,
      status: { $in: ["confirmed", "completed", "pending"] },
      $or: [
        { startTime: { $lt: end, $gte: start } },
        { endTime: { $gt: start, $lte: end } },
        { startTime: { $lte: start }, endTime: { $gte: end } },
      ],
    });

    if (conflict) {
      return NextResponse.json(
        { success: false, message: "Seçilen saatte başka bir randevu bulunmaktadır." },
        { status: 409 },
      );
    }

    let customer = await Customer.findOne({ tenantId, email: customerEmail });

    if (!customer) {
      customer = new Customer({
        tenantId,
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        notes: customerNote || "",
      });
      await customer.save();
    } else {
      let updated = false;

      if (customerName && customer.name !== customerName) {
        customer.name = customerName;
        updated = true;
      }
      if (customerPhone && customer.phone !== customerPhone) {
        customer.phone = customerPhone;
        updated = true;
      }
      if (customerNote && customer.notes !== customerNote) {
        customer.notes = customerNote;
        updated = true;
      }
      if (updated) {
        await customer.save();
      }
    }

    const appointmentCode = `#${Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000}`;

    const appointment = new Appointment({
      tenantId,
      customerId: customer._id,
      serviceId,
      code: appointmentCode,
      staffId,
      startTime: start,
      endTime: end,
      status: "pending",
      notes: customerNote || "",
    });

    await appointment.save();

    const serviceNamePromise = Service.findById(serviceId).then((service) =>
      service ? service.name : "Seçilen Hizmet",
    );

    console.log(
      "Randevu oluşturuldu, email gönderiliyor...",
      JSON.parse(JSON.stringify(appointment)),
    );

    try {
      await sendEmail({
        to: customerEmail,
        subject: "Ayarlio - Randevu Talebiniz Alındı",
        html: appointmentConfirmationTemplate(
          await serviceNamePromise,
          staff.name,
          start,
          end,
          appointmentCode,
        ),
      });
    } catch (emailError) {
      console.error("Email gönderimi başarısız:", emailError);
    }

    return NextResponse.json({
      success: true,
      message: "Randevunuz başarıyla oluşturuldu.",
    });
  } catch (error: any) {
    console.error("API /appointments/book error:", error);
    return NextResponse.json(
      { success: false, message: "Randevu oluşturulurken bir hata oluştu." },
      { status: 500 },
    );
  }
}
