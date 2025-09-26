import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

interface JwtPayload {
  userId: string;
  email: string;
  tenantId: string;
  role: string;
  tenant: {
    id: string;
    name: string;
    slug: string;
  };
}

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key"
);

async function verifyToken(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);

    const userId = payload.sub || payload.userId;
    if (
      typeof userId === "string" &&
      typeof payload.email === "string" &&
      typeof payload.tenantId === "string" &&
      typeof payload.role === "string"
    ) {
      return {
        userId,
        email: payload.email,
        tenantId: payload.tenantId,
        role: payload.role,
        tenant: payload.tenant as { id: string; name: string; slug: string },
      };
    }

    return null;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const authRoutes = ["/login"];
  const publicRoutes = ["/signup", "/signup/success"];
  const protectedRoutes = ["/dashboard", "/profile", "/settings", "/admin"];

  const token = request.cookies.get("auth-token")?.value;
  const user = token ? await verifyToken(token) : null;

  if (
    publicRoutes.includes(pathname) ||
    publicRoutes.some((route) => pathname.startsWith(route))
  ) {
    return NextResponse.next();
  }

  if (authRoutes.includes(pathname)) {
    if (user) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (pathname.startsWith("/admin") && user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (
      pathname.startsWith("/settings") &&
      !["ADMIN", "MANAGER"].includes(user.role)
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    const response = NextResponse.next();
    response.headers.set("x-user-id", user.userId);
    response.headers.set("x-tenant-id", user.tenantId);
    response.headers.set("x-user-role", user.role);

    return response;
  }

  if (pathname === "/" && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};
