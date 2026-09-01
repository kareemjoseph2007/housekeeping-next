import Bathroom from "./bathroom";
import Kitchen from "./kitchen";
import type { Occupancy } from "../lib/occupancy";

export default function Map({ occupancy, familyId }: { occupancy: Occupancy; familyId: string }) {
    return (
        <div>
            <h1>Map</h1>

            <div className="floorplan" role="img" aria-label="2D house floor plan">
                <div className="room bathroom" aria-label="Bathroom">
                    <Bathroom
                        familyId={familyId}
                        isOccupied={occupancy.bathroom}
                        isUserOccupying={occupancy.currentUserLocation === "bathroom"}
                        hasFamily={occupancy.hasFamily}
                    />
                </div>

                <div className="room kitchen" aria-label="Kitchen">
                    <Kitchen
                        familyId={familyId}
                        isOccupied={occupancy.kitchen}
                        isUserOccupying={occupancy.currentUserLocation === "kitchen"}
                        hasFamily={occupancy.hasFamily}
                    />
                </div>

                {/* example door between hallway and kitchen */}
                <div className="door" style={{ left: '34%', top: '28%' }} aria-hidden />
            </div>
        </div>
    );
}
