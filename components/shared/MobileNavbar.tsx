"use client";

import { useState } from "react";
import { User, Calendar, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signOutUser } from "@/lib/actions/user.action";
import { cn } from "@/lib/utils";

const burgerButtonStyles = cn(
  "w-[25px] h-[22px]",
  "xl:hidden cursor-pointer z-100 relative"
);

const burgerLineStyles = (
  isMenuOpen: boolean,
  position: "top" | "middle" | "bottom"
) =>
  cn(
    "absolute left-0 w-full h-0.5 bg-white transition-all ease-in",
    position === "top" && [
      "top-0",
      "duration-300",
      isMenuOpen && "rotate-45 translate-y-2",
    ],
    position === "middle" && ["top-1/2", isMenuOpen && "opacity-0"],
    position === "bottom" && [
      "top-full",
      "duration-300",
      isMenuOpen && "-translate-y-3.5 -rotate-45",
    ]
  );

const MobileNav = ({ session }: { session: any }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="md:hidden">
      <button className={burgerButtonStyles} onClick={toggleMenu}>
        <span className={burgerLineStyles(isOpen, "top")} />
        <span className={burgerLineStyles(isOpen, "middle")} />
        <span className={burgerLineStyles(isOpen, "bottom")} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg border-t border-olive-primary/20 animate-slide-in z-50">
          <nav className="flex flex-col p-4 space-y-4">
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="hover:bg-olive-light p-2 rounded-md"
            >
              <span className="flex items-center gap-2 text-olive-primary font-semibold">
                <User className="w-4 h-4" /> Головна
              </span>
            </Link>
            <Link
              href="/appointments"
              onClick={() => setIsOpen(false)}
              className="hover:bg-olive-light p-2 rounded-md"
            >
              <span className="flex items-center gap-2 text-olive-primary font-semibold">
                <Calendar className="w-4 h-4" /> Записи
              </span>
            </Link>
            <Link
              href="/settings"
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

export default MobileNav;
