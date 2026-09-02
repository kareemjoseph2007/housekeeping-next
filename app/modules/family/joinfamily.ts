"use server";

import { prisma } from "../lib/prisma";
import { getCurrentUserId } from "../auth/auth";

export type JoinFamilyState = {
    success: boolean;
    message: string;
    familyId?: string;
};

export async function joinFamily(
    _previousState: JoinFamilyState | null,
    formData: FormData
): Promise<JoinFamilyState> {
    const userId = await getCurrentUserId();
    if (!userId) {
        return { success: false, message: "You must be logged in to join a family." };
    }

    const familyId = formData.get("familyId");
    if (typeof familyId !== "string" || !familyId.trim()) {
        return { success: false, message: "Family ID is required." };
    }

    const trimmedFamilyId = familyId.trim();

    const family = await prisma.family.findUnique({
        where: { id: trimmedFamilyId },
    });

    if (!family) {
        return { success: false, message: "Family not found. Check the ID and try again." };
    }

    const existingMembership = await prisma.familyMember.findUnique({
        where: {
            userId_familyId: {
                userId,
                familyId: trimmedFamilyId,
            },
        },
    });

    if (existingMembership) {
        return {
            success: false,
            message: "You are already a member of this family.",
            familyId: trimmedFamilyId,
        };
    }

    await prisma.familyMember.create({
        data: {
            userId,
            familyId: trimmedFamilyId,
        },
    });

    return {
        success: true,
        message: `Joined ${family.name}!`,
        familyId: trimmedFamilyId,
    };
}
