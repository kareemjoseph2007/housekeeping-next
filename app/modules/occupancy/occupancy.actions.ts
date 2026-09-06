"use server";
import { getMembership, type Room } from "./occupancy.server";
import { prisma } from "../lib/prisma";
import { notifyFamily } from "./occupancy-subs";

export async function setRoomOccupancy(familyId: string, room: Room, occupied: boolean) {
    const membership = await getMembership(familyId);
    if (!membership) {
        return { ok: false as const, error: "NOT_A_MEMBER" };
    }
    if (!occupied && membership.location !== room) {
        return { ok: false as const, error: "NOT_IN_ROOM" };
    }

    const now = new Date();

    await prisma.$transaction(async (tx) => {
        await tx.familyMember.update({
            where: { id: membership.id },
            data: {
                location: occupied ? room : null,
                startedAt: now,
            },
        });

        // one open stay per member: close whatever is in progress
        await tx.occupancyEvent.updateMany({
            where: { memberId: membership.id, endedAt: null },
            data: { endedAt: now },
        });

        if (occupied) {
            await tx.occupancyEvent.create({
                data: {
                    memberId: membership.id,
                    familyId,
                    room,
                    startedAt: now,
                    endedAt: null,
                },
            });
        }

        await tx.outbox.create({
            data: {
                type: "occupancy",
                payload: {
                    familyId,
                    room,
                    occupied,
                },
            },
        });
    });

    await prisma.$executeRaw`NOTIFY outbox`;

  notifyFamily(familyId);

  return { ok: true as const };
}
