'use server';

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

type TokenPayload = jwt.JwtPayload & { userId: number };

export async function getCurrentUserId(): Promise<number | null> {
    const token = (await cookies()).get("token")?.value;
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