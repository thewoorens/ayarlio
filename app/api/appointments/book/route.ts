import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Appointment from "@/models/Appointment";
import Customer from "@/models/Customer";
import Tenant from "@/models/Tenant";
import Notification from "@/models/Notification";
import { sendEmail } from "@/lib/resend";
import { appointmentConfirmationTemplate } from "@/lib/email-templates";
import Staff from "@/models/Staff";
import Service from "@/models/Service";

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

    const [firstName, ...lastNameParts] = customerName.trim().split(" ");
    const lastName = lastNameParts.join(" ") || "-";

    let customer = await Customer.findOne({ tenantId, email: customerEmail });

    if (!customer) {
      customer = new Customer({
        tenantId,
        firstName,
        lastName,
        email: customerEmail,
        phone: customerPhone,
        notes: customerNote || "",
      });

      await customer.save();
    } else {
      let updated = false;

      if (firstName && customer.firstName !== firstName) {
        customer.firstName = firstName;
        updated = true;
      }

      if (lastName && customer.lastName !== lastName) {
        customer.lastName = lastName;
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
    const start = new Date(startTime);
    const end = new Date(endTime);

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
        {
          success: false,
          message: "Seçilen saatte başka bir randevu bulunmaktadır.",
        },
        { status: 409 },
      );
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

    const notif = new Notification({
      tenantId,
      type: "in-app",
      status: "pending",
      subject: "Yeni Randevu Talebi",
      content: `${customer.firstName} ${customer.lastName} tarafından ${start.toLocaleDateString("tr-TR")} ${start.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })} tarihi için yeni bir randevu oluşturuldu.`,
      metadata: {
        appointmentId: appointment._id,
      },
    });
    await notif.save();

    const staffName = Staff.findById(staffId).then((staff) =>
      staff ? staff.name : "Seçilen Personel",
    );

    const serviceName = Service.findById(serviceId)?.then((service) =>
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
          await serviceName,
          await staffName,
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
