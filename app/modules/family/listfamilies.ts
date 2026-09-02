import { Family } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { getCurrentUserId } from "../auth/auth";

export type ListFamiliesState = {
    success: boolean;
    message: string;
    families?: Family[];
};

export async function listFamilies(): Promise<ListFamiliesState> {
    const userId = await getCurrentUserId();
    if (!userId) {
        return { success: false, message: "You must be logged in to list families." };
    }

    try {
        const families = await prisma.family.findMany({
            where: {
                memberships: {
                    some: { userId },
                },
            },
        });
        return { success: true, message: "Families listed successfully.", families };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Failed to list families." };
    }
}