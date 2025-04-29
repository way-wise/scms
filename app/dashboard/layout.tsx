"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Settings,
  Moon,
  Sun,
  Menu,
  Database,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { setTheme, theme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 pr-0">
            <MobileNav pathname={pathname} setOpen={setOpen} />
          </SheetContent>
        </Sheet>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-muted/40 md:block">
          <DesktopNav pathname={pathname} />
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

function DesktopNav({ pathname }: { pathname: string }) {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-1">
        <h3 className="px-2 text-lg font-semibold">Dashboard</h3>
        <div className="flex flex-col gap-1">
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium",
              pathname === "/dashboard"
                ? "bg-accent text-accent-foreground"
                : "hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
            Overview
          </Link>
          <Link
            href="/dashboard/pages"
            className={cn(
              "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium",
              pathname.startsWith("/dashboard/pages")
                ? "bg-accent text-accent-foreground"
                : "hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <FileText className="h-4 w-4" />
            Pages
          </Link>

          <Link
            href="/dashboard/settings"
            className={cn(
              "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium",
              pathname === "/dashboard/settings"
                ? "bg-accent text-accent-foreground"
                : "hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </div>
      </div>
    </div>
  );
}

function MobileNav({
  pathname,
  setOpen,
}: {
  pathname: string;
  setOpen: (open: boolean) => void;
}) {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-1">
        <h3 className="px-2 text-lg font-semibold">Dashboard</h3>
        <div className="flex flex-col gap-1">
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium",
              pathname === "/dashboard"
                ? "bg-accent text-accent-foreground"
                : "hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
            Overview
          </Link>
          <Link
            href="/dashboard/pages"
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium",
              pathname.startsWith("/dashboard/pages")
                ? "bg-accent text-accent-foreground"
                : "hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <FileText className="h-4 w-4" />
            Pages
          </Link>
          <Link
            href="/dashboard/content"
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium",
              pathname === "/dashboard/content"
                ? "bg-accent text-accent-foreground"
                : "hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Database className="h-4 w-4" />
            Content
          </Link>
          <Link
            href="/dashboard/settings"
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium",
              pathname === "/dashboard/settings"
                ? "bg-accent text-accent-foreground"
                : "hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </div>
      </div>
    </div>
  );
}
