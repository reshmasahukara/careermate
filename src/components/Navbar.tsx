"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, ChevronRight, LayoutDashboard, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/Logo";

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Features", href: "/#features" },
    { name: "Jobs", href: "/jobs" },
    { name: "Pricing", href: "/pricing" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isAppRoute = [
    "/dashboard",
    "/resume-upload",
    "/ats-checker",
    "/jobs",
    "/skill-gap",
    "/roadmap",
    "/settings"
  ].some(route => pathname === route || pathname.startsWith(route + "/"));

  if (session && isAppRoute) {
    return null;
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 h-[72px] flex items-center transition-all duration-200 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md border-b border-brand-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link href="/">
            <Logo className="w-6.5 h-6.5" />
          </Link>

          {/* Center Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href.split("#")[0]) && link.href !== "/";

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-colors py-1.5 px-1 hover:text-primary ${
                    isActive
                      ? "text-primary font-semibold"
                      : "text-brand-muted"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right CTAs */}
          <div className="hidden md:flex items-center gap-4 shrink-0">
            {status === "loading" ? (
              <div className="w-16 h-8 bg-slate-100 animate-pulse rounded-lg" />
            ) : session ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700 hover:text-primary transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 text-primary" />
                  Dashboard
                </Link>
                <div className="w-px h-4 bg-brand-border" />
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-rose-600 hover:text-rose-700 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/login"
                  className="border border-[#E2E8F0] hover:border-primary hover:bg-slate-50 text-slate-700 hover:text-primary px-4.5 py-2 rounded-btn text-sm font-semibold transition-all cursor-pointer"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-primary hover:bg-blue-800 text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-btn shadow-sm transition-colors flex items-center gap-1 cursor-pointer"
                >
                  Sign Up
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* Hamburger Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg bg-slate-50 border border-brand-border text-brand-muted hover:text-brand-text focus:outline-none cursor-pointer"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-[72px] left-0 right-0 bg-white border-b border-brand-border shadow-md md:hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2.5">
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href.split("#")[0]) && link.href !== "/";

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`block px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-slate-50 text-primary"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}

              <hr className="border-slate-100 my-4" />

              {status === "loading" ? (
                <div className="w-full h-10 bg-slate-100 animate-pulse rounded-lg" />
              ) : session ? (
                <div className="space-y-2">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <LayoutDashboard className="w-4.5 h-4.5 text-primary" />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex items-center gap-2 w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold text-rose-600 hover:bg-rose-50 cursor-pointer"
                  >
                    <LogOut className="w-4.5 h-4.5" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 px-4">
                  <Link
                    href="/login"
                    className="flex items-center justify-center py-2.5 rounded-btn border border-brand-border text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-50"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="flex items-center justify-center py-2.5 rounded-btn bg-primary text-white text-xs font-bold uppercase tracking-wider hover:bg-blue-700"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
