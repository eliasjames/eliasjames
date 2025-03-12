export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/dashboard", "/task-management", "/animal-details/:path*"],
};
