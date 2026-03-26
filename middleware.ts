import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/pano", "/kurulum"];
const authPages = ["/giris-yap", "/kayit-ol", "/parola-sifirla", "/e-posta-dogrula"];

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Subdomain Algılama (Örn: slug.localhost:3000 -> tenant=slug)
    const hostname = req.headers.get("host") || "";
    // Vercel gibi ortamlarda x-forwarded-host veya kendi domain yapınıza göre güncelleyebilirsiniz.
    // Şimdilik .localhost veya kendi domain'iniz (örneğin ayarl.io) için basit bir kontrol:
    const isLocalhost = hostname.includes("localhost");
    const baseDomain = isLocalhost ? "localhost:3000" : "ayarlio.com"; // TODO: prod domainini buraya girin

    // Eğer port içeriyorsa (localhost:3000 gibi) başını alıyoruz
    const hostWithoutPort = hostname.split(':')[0];
    const baseDomainWithoutPort = baseDomain.split(':')[0];

    if (hostname !== baseDomain && hostname !== `www.${baseDomain}` && hostname !== hostWithoutPort && hostWithoutPort !== baseDomainWithoutPort && hostWithoutPort !== `www.${baseDomainWithoutPort}`) {
        // Alt alan adı var demek (örneğin: deneme.localhost:3000)
        const subdomain = hostWithoutPort.replace(`.${baseDomainWithoutPort}`, "");
        // Eğer subdomain geçerliyse yönlendir
        if (subdomain && subdomain !== "www") {
            return NextResponse.rewrite(new URL(`/t/${subdomain}${pathname}`, req.url));
        }
    }

    const res = NextResponse.next();

    const emailVerified = req.cookies.get("email_verified");
    if (emailVerified) {
        res.headers.set("x-email-verified", "1");
        res.cookies.delete("email_verified");
    }

    const tokenCookie = req.cookies.get("token")?.value;
    const isAuthenticated = !!tokenCookie;

    let isSetup = false;
    let decodedValid = false;

    if (tokenCookie) {
        try {
            const parts = tokenCookie.split('.');
            if (parts.length === 3) {
                const payloadStr = Buffer.from(parts[1], 'base64').toString('utf-8');
                const payload = JSON.parse(payloadStr);

                if (payload.exp && payload.exp * 1000 > Date.now()) {
                    decodedValid = true;
                    isSetup = payload.isSetup === true;
                }
            }
        } catch (error) {
            console.error('Proxy JWT decode hatası:', error);
        }
    }

    const isActuallyAuthenticated = isAuthenticated && decodedValid;

    if (pathname === "/") {
        if (!isActuallyAuthenticated) return NextResponse.redirect(new URL("/giris-yap", req.url));
        return NextResponse.redirect(new URL(isSetup ? "/pano" : "/kurulum", req.url));
    }

    if (protectedRoutes.some(route => pathname.startsWith(route)) && !isActuallyAuthenticated) {
        return NextResponse.redirect(new URL("/giris-yap", req.url));
    }

    if (authPages.some(route => pathname.startsWith(route)) && isActuallyAuthenticated) {
        return NextResponse.redirect(new URL(isSetup ? "/pano" : "/kurulum", req.url));
    }

    if (isActuallyAuthenticated) {
        const isTryingPano = pathname.startsWith("/pano");
        const isTryingKurulum = pathname.startsWith("/kurulum");

        if (!isSetup && isTryingPano) {
            return NextResponse.redirect(new URL("/kurulum", req.url));
        }

        if (isSetup && isTryingKurulum) {
            return NextResponse.redirect(new URL("/pano", req.url));
        }
    }

    return res;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - images (public images)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
    ],
};