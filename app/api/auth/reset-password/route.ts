import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { resetPasswordSchema } from '@/lib/validations/auth';
import User from '@/models/User';
import * as argon2 from 'argon2';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // 1. Zod ile payload validation
        const validatedData = resetPasswordSchema.safeParse(body);
        if (!validatedData.success) {
            return NextResponse.json(
                { success: false, errors: validatedData.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        await connectDB();

        const { token, password } = validatedData.data;

        // Gerçek senaryoda bu token'in veritabanında "kullanılmamış" (isValid) ve "süresi geçmemiş" (expiresIn) kontrolünün yapılması gerekir.
        // Hashing örneği:
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: new Date() }
        });

        if (!user) {
            return NextResponse.json(
                { success: false, message: 'Geçersiz veya süresi dolmuş token' },
                { status: 400 }
            );
        }

        // 3. Yeni şifreyi argon2 ile hash'le
        const passwordHash = await argon2.hash(password);

        await User.updateOne(
            { _id: user._id },
            {
                passwordHash,
                $unset: { resetPasswordToken: 1, resetPasswordExpire: 1 }
            }
        );

        return NextResponse.json(
            { success: true, message: 'Şifreniz başarıyla sıfırlandı. Giriş yapabilirsiniz.' },
            { status: 200 }
        );

    } catch (error: any) {
        console.error('Reset Password API Error:', error);
        return NextResponse.json(
            { success: false, message: 'Şifre sıfırlanırken bir hata oluştu' },
            { status: 500 }
        );
    }
}
