import {NextRequest, NextResponse} from 'next/server';
import connectDB from '@/lib/db';
import {tenantSetupSchema} from '@/lib/validations/tenant';
import Tenant from '@/models/Tenant';
import User from '@/models/User';
import {verifyToken, signToken} from '@/lib/jwt';
import {PLAN_CONFIG} from "@/lib/plan/planConfig";

const plan = 'standard';

export async function POST(req: NextRequest) {
    try {
        const tokenVal = req.cookies.get('token')?.value;
        if (!tokenVal) {
            return NextResponse.json({success: false}, {status: 401});
        }

        let decoded;
        try {
            decoded = verifyToken(tokenVal);
        } catch (err) {
            console.log("Verify Token Error: ", err)
            return NextResponse.json({success: false}, {status: 401});
        }

        const body = await req.json();
        const validatedData = tenantSetupSchema.safeParse(body);

        if (!validatedData.success) {
            return NextResponse.json(
                {success: false, errors: validatedData.error.flatten().fieldErrors},
                {status: 400}
            );
        }

        await connectDB();

        const {tenantName, industry, phone} = validatedData.data;

        const user = await User.findById(decoded.userId);
        if (!user) {
            return NextResponse.json({success: false}, {status: 404});
        }
        if (!user.emailVerify) {
            return NextResponse.json({
                success: false,
            }, {status: 403});
        }
        if (user.isSetup) {
            return NextResponse.json({success: false}, {status: 400});
        }

        const slug = tenantName
            .toLowerCase()
            .replace(/ğ/g, 'g')
            .replace(/ü/g, 'u')
            .replace(/ş/g, 's')
            .replace(/ı/g, 'i')
            .replace(/ö/g, 'o')
            .replace(/ç/g, 'c')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');

        let finalSlug = slug;
        const slugExists = await Tenant.findOne({slug: finalSlug});
        if (slugExists) {
            finalSlug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
        }

        const tenant = await Tenant.create({
            name: tenantName,
            slug: finalSlug,
            industry,
            phone,
            plan,
            trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),

            limits: PLAN_CONFIG[plan],
            usage: {
                staff: 0,
                bookingsThisMonth: 0,
            },
        });

        user.tenantId = tenant._id;
        user.isSetup = true;
        await user.save();

        const newToken = signToken({
            userId: user._id.toString(),
            role: user.role,
            tenantId: tenant._id.toString(),
            tokenVersion: user.tokenVersion,
            isSetup: true,
        });

        const response = NextResponse.json(
            {success: true},
            {status: 201}
        );

        response.cookies.set('token', newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        });

        return response;

    } catch (error) {
        console.error('Tenant Setup API Error:', error);
        return NextResponse.json({success: false}, {status: 500});
    }
}
