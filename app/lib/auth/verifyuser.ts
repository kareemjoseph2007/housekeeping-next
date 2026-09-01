export function verifyUser(req: Request): boolean {
  const cookieHeader = req.headers.get("cookie");
    if (!cookieHeader) {
      return false;
    }
    return true;
}