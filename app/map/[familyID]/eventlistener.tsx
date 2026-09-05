"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { OccupancyEvent } from "@prisma/client";

export default function EventListener({ familyID }: { familyID: string }) {
    const [events] = useState<OccupancyEvent[]>([]);
    const router = useRouter();

    useEffect(() => {
        const eventSource = new EventSource(`/api/map/${familyID}/events`);
        eventSource.onmessage = (event) => {
            console.log(event.data);
            router.refresh();
        };
        return () => {
            eventSource.close();
        };
    }, [familyID, router]);

    return (
        <div>
            <h1>Events</h1>
            <ul>
                {events.map((event) => (
                    <li key={event.id}>{event.startedAt.toLocaleString()}</li>
                ))}
            </ul>
        </div>
    );
}
