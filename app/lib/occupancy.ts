"use server";

import { getCurrentUserId } from "./auth/auth";
import { prisma } from "./prisma";

export type Room = "bathroom" | "kitchen";

export type Occupancy = {
    bathroom: boolean;
    kitchen: boolean;
    currentUserLocation: string | null;
    hasFamily: boolean;
};

async function getMembership(familyId: string) {
    const userId = await getCurrentUserId();
    if (!userId) {
        return null;
    }

    return prisma.familyMember.findUnique({
        where: {
            userId_familyId: {
                userId,
                familyId,
            },
        },
    });
}

export async function getOccupancy(familyId: string): Promise<Occupancy> {
    const membership = await getMembership(familyId);
    if (!membership) {
        return {
            bathroom: false,
            kitchen: false,
            currentUserLocation: null,
            hasFamily: false,
        };
    }

    const familyMembers = await prisma.familyMember.findMany({
        where: { familyId },
        select: { location: true },
    });

    return {
        bathroom: familyMembers.some((member) => member.location === "bathroom"),
        kitchen: familyMembers.some((member) => member.location === "kitchen"),
        currentUserLocation: membership.location,
        hasFamily: true,
    };
}

export async function setRoomOccupancy(familyId: string, room: Room, occupied: boolean) {
    const membership = await getMembership(familyId);
    if (!membership) {
        return { ok: false as const, error: "NOT_A_MEMBER" };
    }
    if (!occupied && membership.location !== room) {
        return { ok: false as const, error: "NOT_IN_ROOM" };
    }

    await prisma.familyMember.update({
        where: { id: membership.id },
        data: {
            location: occupied ? room : null,
            startedAt: new Date(),
        },
    });

    return { ok: true as const };
}
