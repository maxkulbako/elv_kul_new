"use client";

import { useState } from "react";
import { Calendar, Settings, LogOut, HomeIcon, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signOutUser } from "@/lib/actions/user.action";
import BurgerButton from "./BurgerButton";
import { Session } from "next-auth";

const AdminMobileNavBar = ({ session }: { session: Session }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const user = session?.user;

  return (
    <div className="lg:hidden">
      <BurgerButton isOpen={isOpen} toggleMenu={toggleMenu} />

      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg border-t border-olive-primary/20 animate-slide-in z-50">
          <nav className="flex flex-col p-4 space-y-4">
            <div className="flex items-center space-x-2 p-2 bg-olive-light rounded-md">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-olive-primary text-white">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <Link
              href="/admin/dashboard"
              onClick={() => setIsOpen(false)}
              className="hover:bg-olive-light p-2 rounded-md"
            >
              <span className="flex items-center gap-2 text-olive-primary font-semibold">
                <HomeIcon className="w-4 h-4" /> Головна
              </span>
            </Link>
            <Link
              href="/admin/clients"
              onClick={() => setIsOpen(false)}
              className="hover:bg-olive-light p-2 rounded-md"
            >
              <span className="flex items-center gap-2 text-olive-primary font-semibold">
                <Users className="w-4 h-4" /> Клієнти
              </span>
            </Link>
            <Link
              href="/admin/calendar"
              onClick={() => setIsOpen(false)}
              className="hover:bg-olive-light p-2 rounded-md"
            >
              <span className="flex items-center gap-2 text-olive-primary font-semibold">
                <Calendar className="w-4 h-4" /> Календар
              </span>
            </Link>
            <Link
              href="/admin/settings"
              onClick={() => setIsOpen(false)}
              className="hover:bg-olive-light p-2 rounded-md"
            >
              <span className="flex items-center gap-2 text-olive-primary font-semibold">
                <Settings className="w-4 h-4" /> Налаштування
              </span>
            </Link>
            <form action={signOutUser}>
              <Button
                variant="outline"
                type="submit"
                className="w-full flex items-center justify-center text-olive-primary"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Вийти
              </Button>
            </form>
          </nav>
        </div>
      )}
    </div>
  );
};

export default AdminMobileNavBar;
