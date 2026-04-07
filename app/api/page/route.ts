import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Tenant from "@/models/Tenant";
import Service from "@/models/Service";
import Staff from "@/models/Staff";
import Appointment from "@/models/Appointment";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const slug = searchParams.get("slug");

        if (!slug) {
            return NextResponse.json(
                { success: false, error: "Slug is required" },
                { status: 400 }
            );
        }

        const cleanSlug = slug.toLowerCase().trim();

        await connectDB();

        const tenant = await Tenant.findOne({ slug: cleanSlug, isActive: true }).select('-settings.paymentGateway -createdAt -updatedAt -plan');

        if (!tenant) {
            return NextResponse.json(
                { success: false, error: "Tenant not found or inactive" },
                { status: 404 }
            );
        }

        const [services, staff, appointments] = await Promise.all([
            Service.find({ tenantId: tenant._id, isActive: true }).select('name category description duration price currency staffIds'),
            Staff.find({ tenantId: tenant._id, status: 'active' }).select('name role color services workDays startTime endTime'),
            Appointment.find({
                tenantId: tenant._id,
                status: { $in: ['confirmed', 'completed', 'pending'] },
                startTime: { $gte: new Date() }
            }).select('serviceId staffId startTime endTime status')
        ]);

        return NextResponse.json({
            success: true,
            data: {
                tenant,
                services,
                staff,
                appointments
            }
        });

    } catch (error: any) {
        console.error("API /page error:", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
