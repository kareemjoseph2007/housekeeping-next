"use server"

import { comparePassword } from "../utils/bcrypt";
import { prisma } from "../prisma";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { signToken } from "./signtoken";

export type LoginState = {
    success: boolean;
    message: string;
};

export async function login(_previousState: LoginState | null, formData: FormData): Promise<LoginState> {
    const email = formData.get("email");
    const password = formData.get("password");

    if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
        return { success: false, message: "Email and password are required." };
    }

    const user = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (!user) {
        return { success: false, message: "Invalid email or password." };
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
        return { success: false, message: "Invalid email or password." };
    }

    const token =  await signToken(user.id, user.email);
    (await cookies()).set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7
    });

    redirect("/");
}