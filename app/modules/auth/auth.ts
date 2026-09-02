"use server";
import { cookies } from "next/headers";
import { getUserIdFromToken } from "./token";

export async function getCurrentUserId(): Promise<number | null> {
    const token = (await cookies()).get("token")?.value;
    return getUserIdFromToken(token);
}
