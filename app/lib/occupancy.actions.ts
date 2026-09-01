"use server";

import { getMembership, type Room } from "./occupancy.server";
import { prisma } from "./prisma";

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
