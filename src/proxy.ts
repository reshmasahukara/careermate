import { auth } from "@/auth";

export default auth;

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/resume-upload/:path*",
    "/resume-analysis/:path*",
    "/resume-builder/:path*",
    "/ats-checker/:path*",
    "/jobs/:path*",
    "/skill-gap/:path*",
    "/roadmap/:path*",
    "/career-pathways/:path*",
    "/career-insights/:path*",
    "/settings/:path*",
  ],
};
