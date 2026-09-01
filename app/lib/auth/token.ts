import jwt from "jsonwebtoken";

type TokenPayload = jwt.JwtPayload & { userId: number };

export function getUserIdFromToken(token: string | undefined): number | null {
    const secret = process.env.NEXTAUTH_SECRET;

    if (!token || !secret) {
        return null;
    }

    try {
        const payload = jwt.verify(token, secret) as TokenPayload;
        return typeof payload.userId === "number" ? payload.userId : null;
    } catch {
        return null;
    }
}
