"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";

interface NavigationItem {
  label: string;
  url: string;
  children?: Array<{ label: string; url: string }>;
}

interface HeaderProps {
  logo: string;
  navigation: NavigationItem[];
  ctaButton: {
    label: string;
    url: string;
  };
}

export default function Header({ logo, navigation, ctaButton }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src={logo || "/placeholder.svg"}
              alt="Logo"
              width={120}
              height={40}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item, index) => (
              <div key={index} className="relative group">
                {item.children ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center text-gray-600 hover:text-gray-900">
                      {item.label}
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {item.children.map((child, childIndex) => (
                        <DropdownMenuItem key={childIndex} asChild>
                          <Link href={child.url}>{child.label}</Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    href={item.url}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              {ctaButton.label}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-4">
          <div className="container mx-auto px-4 space-y-4">
            {navigation.map((item, index) => (
              <div key={index} className="py-2">
                {item.children ? (
                  <>
                    <div className="font-medium mb-2">{item.label}</div>
                    <div className="pl-4 space-y-2">
                      {item.children.map((child, childIndex) => (
                        <Link
                          key={childIndex}
                          href={child.url}
                          className="block text-gray-600 hover:text-gray-900"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.url}
                    className="block font-medium text-gray-600 hover:text-gray-900"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            <div className="pt-2">
              <Button
                className="w-full bg-indigo-600 hover:bg-indigo-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                {ctaButton.label}
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
