import { redirect } from "next/navigation"
import { getCurrentUserId } from "../modules/auth/auth";

export default async function MapPage() {
const userId = await getCurrentUserId();

if (!userId) {
    redirect("/login");
}
redirect("/families");}