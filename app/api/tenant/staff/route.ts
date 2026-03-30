import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Staff from "@/models/Staff";
import { verifyToken } from "@/lib/jwt";

function getTenantId(req: NextRequest) {
  const tokenVal = req.cookies.get("token")?.value;
  if (!tokenVal) return null;
  try {
    const decoded = verifyToken(tokenVal);
    return decoded.tenantId || null;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const tenantId = getTenantId(req);
    if (!tenantId) {
      return NextResponse.json(
        { success: false, message: "Yetkisiz erişim veya geçersiz token" },
        { status: 401 },
      );
    }

    await connectDB();
    const staffList = await Staff.find({ tenantId }).sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, data: staffList },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Staff GET API Error:", error);
    return NextResponse.json(
      { success: false, message: "Personeller getirilirken hata oluştu" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const tenantId = getTenantId(req);
    if (!tenantId) {
      return NextResponse.json(
        { success: false, message: "Yetkisiz erişim veya geçersiz token" },
        { status: 401 },
      );
    }

    const body = await req.json();

    if (!body.name) {
      return NextResponse.json(
        { success: false, message: "Personel adı zorunludur" },
        { status: 400 },
      );
    }

    await connectDB();

    const staffData = {
      ...body,
      tenantId,
      workDays: body.workDays || [],
      startTime: body.startTime || "09:00",
      endTime: body.endTime || "18:00",
    };

    const staffObj = await Staff.create(staffData);

    return NextResponse.json(
      { success: true, message: "Personel başarıyla eklendi", data: staffObj },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Staff POST API Error:", error);
    return NextResponse.json(
      { success: false, message: "Personel eklenirken hata oluştu" },
      { status: 500 },
    );
  }
}
