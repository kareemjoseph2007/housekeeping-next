"use server";

import { getCurrentUserId } from "./auth/auth";
import { prisma } from "./prisma";

export type Room = "bathroom" | "kitchen";

export type Occupancy = {
    bathroom: boolean;
    kitchen: boolean;
    bathroomOccupants: string[];
    kitchenOccupants: string[];
    currentUserLocation: string | null;
    hasFamily: boolean;
};

function occupantName(user: { name: string | null; email: string }) {
    const name = user.name?.trim();
    return name || user.email;
}

function occupantsInRoom(
    members: { location: string | null; user: { name: string | null; email: string } }[],
    room: Room
) {
    return members
        .filter((member) => member.location === room)
        .map((member) => occupantName(member.user));
}

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
            bathroomOccupants: [],
            kitchenOccupants: [],
            currentUserLocation: null,
            hasFamily: false,
        };
    }

    const familyMembers = await prisma.familyMember.findMany({
        where: { familyId },
        select: {
            location: true,
            user: {
                select: { name: true, email: true },
            },
        },
    });

    const bathroomOccupants = occupantsInRoom(familyMembers, "bathroom");
    const kitchenOccupants = occupantsInRoom(familyMembers, "kitchen");

    return {
        bathroom: bathroomOccupants.length > 0,
        kitchen: kitchenOccupants.length > 0,
        bathroomOccupants,
        kitchenOccupants,
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
