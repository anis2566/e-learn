import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard",
  "/teacher(.*)"
]);


export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    const role = auth().sessionClaims?.role as string;
    console.log(role)
    // const isScout = role?.split(" ")?.includes("Scout")
    if (!auth().userId) {
      auth().protect(); 
    } else {
      // if (req.nextUrl.pathname.startsWith("/scout") && !isScout) {
      //   return NextResponse.redirect(new URL("/apply", req.url));
      // }
      // // if (req.nextUrl.pathname.startsWith("/scout") && status === "pending") {
      // //   return NextResponse.redirect(new URL("/scout/pending", req.url));
      // // }

      // // if (req.nextUrl.pathname.startsWith("/dashboard") && role !== "admin") {
      // //   return NextResponse.redirect(new URL("/", req.url));
      // // }
    }
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
