import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";

const protectedRoutes = ["/cart", "/checkout", "/orders/success", "/admin"];
const authRoutes = ["/login", "/register"];
const intlMiddleware = createMiddleware(routing);

function getLocalePath(pathname: string) {
  const segments = pathname.split("/");
  const maybeLocale = segments[1];
  const hasLocale = routing.locales.includes(
    maybeLocale as (typeof routing.locales)[number],
  );

  return {
    locale: hasLocale ? maybeLocale : routing.defaultLocale,
    pathnameWithoutLocale: hasLocale
      ? `/${segments.slice(2).join("/")}`.replace(/\/$/, "") || "/"
      : pathname,
  };
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { locale, pathnameWithoutLocale } = getLocalePath(pathname);
  const token = request.cookies.get("auth_token")?.value;
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathnameWithoutLocale.startsWith(route),
  );
  const isAuthRoute = authRoutes.includes(pathnameWithoutLocale);

  if (isProtectedRoute && !token) {
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set(
      "redirect",
      pathname.startsWith(`/${locale}`) ? pathname : `/${locale}${pathname}`,
    );

    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL(`/${locale}/products`, request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
