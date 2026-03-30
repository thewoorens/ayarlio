import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Category from "@/models/Category";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  try {
    const tokenVal = req.cookies.get("token")?.value;
    if (!tokenVal) {
      return NextResponse.json(
        { success: false, message: "Yetkisiz erişim" },
        { status: 401 },
      );
    }

    let decoded;
    try {
      decoded = verifyToken(tokenVal);
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Geçersiz veya süresi dolmuş token" },
        { status: 401 },
      );
    }

    const { tenantId } = decoded;

    if (!tenantId) {
      return NextResponse.json(
        { success: false, message: "Tenant bulunamadı" },
        { status: 400 },
      );
    }

    await connectDB();

    const categories = await Category.find({ tenantId }).sort({
      createdAt: -1,
    });

    return NextResponse.json(
      { success: true, data: categories },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Category GET API Error:", error);
    return NextResponse.json(
      { success: false, message: "Kategoriler getirilirken hata oluştu" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const tokenVal = req.cookies.get("token")?.value;
    if (!tokenVal) {
      return NextResponse.json(
        { success: false, message: "Yetkisiz erişim" },
        { status: 401 },
      );
    }

    let decoded;
    try {
      decoded = verifyToken(tokenVal);
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Geçersiz veya süresi dolmuş token" },
        { status: 401 },
      );
    }

    const { tenantId } = decoded;

    if (!tenantId) {
      return NextResponse.json(
        { success: false, message: "Tenant bulunamadı" },
        { status: 400 },
      );
    }

    const body = await req.json();

    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, message: "Kategori adı zorunludur" },
        { status: 400 },
      );
    }

    if (name.trim().length < 2) {
      return NextResponse.json(
        { success: false, message: "Kategori adı en az 2 karakter olmalıdır" },
        { status: 400 },
      );
    }

    await connectDB();

    const categoryObj = await Category.create({
      tenantId,
      name: name.trim()
    });

    return NextResponse.json(
      {
        success: true,
        message: "Kategori başarıyla eklendi",
        data: categoryObj,
      },
      { status: 201 },
    );
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Bu kategori adı zaten mevcut" },
        { status: 400 },
      );
    }
    console.error("Category POST API Error:", error);
    return NextResponse.json(
      { success: false, message: "Kategori eklenirken hata oluştu" },
      { status: 500 },
    );
  }
}
