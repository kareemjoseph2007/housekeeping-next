"use server";

import { prisma } from "../lib/prisma";
import { getCurrentUserId } from "../auth/auth";

export type CreateFamilyState = {
    success: boolean;
    message: string;
    familyId?: string;
};

export async function createFamily(
    _previousState: CreateFamilyState | null,
    formData: FormData
): Promise<CreateFamilyState> {
    const userId = await getCurrentUserId();
    if (!userId) {
        return { success: false, message: "You must be logged in to create a family." };
    }

    const name = formData.get("name");
    if (typeof name !== "string" || !name.trim()) {
        return { success: false, message: "Name is required." };
    }

    try {
        const family = await prisma.family.create({
            data: {
                name: name.trim(),
                memberships: {
                    create: { userId },
                },
            },
        });

        return {
            success: true,
            message: "Family created successfully.",
            familyId: family.id,
        };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Failed to create family." };
    }
}
