import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getUserIdFromToken } from "./app/lib/auth/token";

export function proxy(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    const userId = getUserIdFromToken(token);

    if (!userId) {
        const loginUrl = new URL("/login", request.url);
        const response = NextResponse.redirect(loginUrl);
        if (token) {
            response.cookies.delete("token");
        }
        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/families", "/families/:path*", "/map", "/map/:path*"],
};
