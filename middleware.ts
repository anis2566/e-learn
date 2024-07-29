import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard", "/teacher(.*)"]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    const role = auth().sessionClaims?.role as string;
    const isTeacher = role === Role.Teacher;
    const isAdmin = role === Role.Admin;
    if (!auth().userId) {
      auth().protect();
    } else {
      if (req.nextUrl.pathname.startsWith("/teacher") && !isTeacher) {
        return NextResponse.redirect(new URL("/sign-up/teacher", req.url));
      }
      // if (req.nextUrl.pathname.startsWith("/scout") && status === "pending") {
      //   return NextResponse.redirect(new URL("/scout/pending", req.url));
      // }

      // if (req.nextUrl.pathname.startsWith("/dashboard") && role !== "admin") {
      //   return NextResponse.redirect(new URL("/", req.url));
      // }
    }
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
