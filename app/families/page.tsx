import FamilyForms from "./family-forms";
import ListFamilies from "./list";

export default function FamiliesPage() {
    return (
        <div>
            <h1>Families</h1>
            <ListFamilies />
            <FamilyForms />
        </div>
    );
}
