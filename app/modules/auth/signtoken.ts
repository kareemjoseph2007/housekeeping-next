import jwt from "jsonwebtoken";

export async function signToken(userId: number, email: string): Promise<string> {
  const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) {
        throw new Error("NEXTAUTH_SECRET is not set");
    }

  return jwt.sign({ userId, email }, secret, { expiresIn: "7d" });
}