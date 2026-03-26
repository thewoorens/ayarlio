import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Category from '@/models/Category';
import Service from '@/models/Service';
import { verifyToken } from '@/lib/jwt';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const { id } = resolvedParams;
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

        await connectDB();

        // 1. First get the category to find its name
        const category = await Category.findOne({ _id: id, tenantId: decoded.tenantId });

        if (!category) {
            return NextResponse.json({ success: false, message: 'Kategori bulunamadı veya zaten silinmiş' }, { status: 404 });
        }

        // 2. Update all services that had this category string to say "Kategori Yok" or remove the category string.
        // Doing this before deleting to maintain data integrity.
        await Service.updateMany(
            { tenantId: decoded.tenantId, category: category.name },
            { $set: { category: '' } }
        );

        // 3. Delete the category
        await Category.findOneAndDelete({ _id: id, tenantId: decoded.tenantId });

        return NextResponse.json({ success: true, message: 'Kategori başarıyla silindi' }, { status: 200 });

    } catch (error: any) {
        console.error('Category DELETE API Error:', error);
        return NextResponse.json({ success: false, message: 'Kategori silinirken hata oluştu' }, { status: 500 });
    }
}
