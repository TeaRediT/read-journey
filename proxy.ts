import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const privateRoutes = ["/recommended", "/library", "/reading"];
const publicRoutes = ["/login", "/register"];

export default function middleware(req: NextRequest) {
  const session = req.cookies.get("auth-session")?.value;
  const { pathname } = req.nextUrl;

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isPrivateRoute && !session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isPublicRoute && session) {
    return NextResponse.redirect(new URL("/recommended", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/recommended", "/library", "/reading", "/login", "/register"],
};
