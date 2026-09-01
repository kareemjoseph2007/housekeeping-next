import Link from "next/link";
import { listFamilies } from "../lib/app/listfamilies";

export default async function ListFamilies() {
    const families = await listFamilies();

    if (!families.success) {
        return <p>{families.message}</p>;
    }

    if (!families.families || families.families.length === 0) {
        return <p>No families found.</p>;
    }

    return (
        <div>
            {families.families.map((family) => (
                <div key={family.id}>
                    <h2>{family.name}</h2>
                    <p>
                        Family ID: <code>{family.id}</code>
                    </p>
                    <Link href={`/map/${family.id}`}>Go to map</Link>
                </div>
            ))}
        </div>
    );
}
