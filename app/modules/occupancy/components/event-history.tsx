import { getEventHistory } from "../event-history-getter";

function displayName(user: { name: string | null; email: string }) {
    return user.name?.trim() || user.email;
}

export default async function EventHistory({ familyId }: { familyId: string }) {
    const events = await getEventHistory(familyId);

    return (
        <div>
            <h2>Event History</h2>
            {events.length === 0 ? (
                <p>No occupancy history yet.</p>
            ) : (
                <ul>
                    {events.map((event) => (
                        <li key={event.id}>
                            {displayName(event.member.user)} {event.room} - started at {event.startedAt.toLocaleString()} ended at {event.endedAt?.toLocaleString() || "still running"}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
