// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token && req.nextUrl.pathname !== "/") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (token && req.nextUrl.pathname !== "/") {
    return NextResponse.next();
  }

  if(token && req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/tables", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/tables/:path*"], 
};
