import FamilyForms from "../modules/occupancy/components/family-forms";
import ListFamilies from "../modules/family/list";

export default function FamiliesPage() {
    return (
        <div>
            <h1>Families</h1>
            <ListFamilies />
            <FamilyForms />
        </div>
    );
}
