"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { setRoomOccupancy } from "../lib/occupancy";

export default function Bathroom({ familyId, isOccupied, isUserOccupying, hasFamily }: {
  familyId: string;
  isOccupied: boolean;
  isUserOccupying: boolean;
  hasFamily: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const toggleOccupancy = () => {
    startTransition(async () => {
      await setRoomOccupancy(familyId, "bathroom", !isUserOccupying);
      router.refresh();
    });
  };

  return (
    <div>
      <div className="room-label">Bathroom</div>
      <div className="status">Status: {isOccupied ? "Occupied" : "Available"}</div>
      <div style={{ marginTop: 8 }}>
        <button className="occupy-btn" onClick={toggleOccupancy} disabled={!hasFamily || isPending}>
          {isPending ? "Updating..." : isUserOccupying ? "Free" : "Occupy"}
        </button>
      </div>
    </div>
  );
}
