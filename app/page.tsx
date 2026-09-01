
import { redirect } from "next/navigation";
import { getCurrentUserId } from "./lib/auth/auth";
import Link from "next/link";

export default async function Home() {
  const userId = await getCurrentUserId();
  if (userId) {
    redirect("/families");
  }
  return (
    <div>
      <h1>Welcome to the Home Map Page</h1>
      <Link href="/login">Login</Link>
      <Link href="/signup">Signup</Link>
    </div>
  );
}
