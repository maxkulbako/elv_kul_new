"use client";

import { useState } from "react";
import { Session } from "next-auth";
import Link from "next/link";
import { Calendar, Settings, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/auth";

const NavbarMobileMenu = ({ session }: { session: Session | null }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-olive-primary/20 p-4 shadow-md animate-slide-in">
      <div className="flex flex-col space-y-4">
        {session ? (
          <>
            <div className="flex items-center space-x-2 p-2 bg-olive-light rounded-md">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-olive-primary text-white">
                {session.user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium">{session.user?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {session.user?.email}
                </p>
              </div>
            </div>

            <Link href="/dashboard" onClick={() => setIsOpen(false)}>
              Dashboard
            </Link>
            <Link href="/appointments" onClick={() => setIsOpen(false)}>
              Appointments
            </Link>
            <Link href="/settings" onClick={() => setIsOpen(false)}>
              Settings
            </Link>
            <button
              onClick={() => {
                signOut();
                setIsOpen(false);
              }}
              className="flex items-center p-2 hover:bg-olive-light rounded-md text-left w-full"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </button>
          </>
        ) : (
          <>
            <Link href="/about" onClick={() => setIsOpen(false)}>
              About
            </Link>
            <Link href="/services" onClick={() => setIsOpen(false)}>
              Services
            </Link>
            <Link href="/contact" onClick={() => setIsOpen(false)}>
              Contact
            </Link>
            <Button
              onClick={() => {
                window.location.href = "/sign-in";
                setIsOpen(false);
              }}
              className="w-full bg-olive-primary text-white hover:bg-olive-primary/90"
            >
              Login / Register
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default NavbarMobileMenu;
