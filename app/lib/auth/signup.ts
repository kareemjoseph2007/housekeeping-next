"use server"

import { hashPassword } from "../utils/bcrypt";
import { prisma } from "../prisma";
import { cookies } from "next/headers";
import { signToken } from "./signtoken";

export type SignupState = {
    success: boolean;
    message: string;
};

export async function signup(_previousState: SignupState | null, formData: FormData): Promise<SignupState> {
    const email = formData.get("email");
    const password = formData.get("password");

    if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
        return { success: false, message: "Email and password are required." };
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        return { success: false, message: "An account with that email already exists." };
    }

    const hashed = await hashPassword(password);
    const user = await prisma.user.create({
        data: {
            email,
            password: hashed
        }

    });

    const token = await signToken(user.id, user.email);
    (await cookies()).set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7
    });

    return { success: true, message: "Signup successful!" };
}