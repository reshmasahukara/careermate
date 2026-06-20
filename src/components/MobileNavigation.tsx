"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Upload,
  Briefcase,
  Settings,
  Menu
} from "lucide-react";

interface MobileNavigationProps {
  toggleMobileMenu: () => void;
}

export default function MobileNavigation({ toggleMobileMenu }: MobileNavigationProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    if (href === "/resume-analysis") {
      return pathname === "/resume-analysis" || pathname === "/resume-builder" || pathname === "/resume-upload";
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Resume Hub", href: "/resume-analysis", icon: Upload },
    { name: "Job Board", href: "/jobs", icon: Briefcase },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] h-16 px-4 flex items-center justify-around z-40 lg:hidden shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-all ${
              active ? "text-[#10B981]" : "text-[#64748B] hover:text-[#0F172A]"
            }`}
          >
            <Icon className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-bold tracking-tight">{item.name}</span>
          </Link>
        );
      })}

      {/* More / Mobile Drawer Button */}
      <button
        onClick={toggleMobileMenu}
        className="flex flex-col items-center justify-center flex-1 h-full py-1 text-center text-[#64748B] hover:text-[#0F172A] cursor-pointer"
      >
        <Menu className="w-5 h-5 mb-1" />
        <span className="text-[10px] font-bold tracking-tight">More</span>
      </button>
    </div>
  );
}
