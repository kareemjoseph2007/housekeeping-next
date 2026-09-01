import Link from "next/link";
import Map from "../../components/map";
import { getOccupancy } from "../../lib/occupancy.server";

export default async function MapPage({
    params,
}: {
    params: Promise<{ familyID: string }>;
}) {
    const { familyID } = await params;
    const occupancy = await getOccupancy(familyID);

    if (!occupancy.hasFamily) {
        return (
            <div>
                <h1>Map Page</h1>
                <p>You are not a member of this family.</p>
                <Link href="/families">Back to families</Link>
            </div>
        );
    }

    return (
        <div>
            <h1>Map Page</h1>
            <Map occupancy={occupancy} familyId={familyID} />
        </div>
    );
}
