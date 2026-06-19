import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/resume-upload/:path*",
    "/ats-checker/:path*",
    "/jobs/:path*",
    "/skill-gap/:path*",
    "/roadmap/:path*",
    "/settings/:path*",
  ],
};
