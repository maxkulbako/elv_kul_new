"use client";

import Image from "next/image";
import CallBackButton from "@/app/components/shared/CallBackButton";
import { useState } from "react";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    label: "Про мене",
    href: "",
  },
  {
    label: "Запити",
    href: "",
  },
  {
    label: "Вартість",
    href: "",
  },
  {
    label: "Питання",
    href: "",
  },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="bg-olive-primary border-b-[1px] border-[#42412D] relative z-50">
      <header className="flex items-center justify-between px-8 pt-9 pb-3 md:py-4.5 xl:px-24 xl:py-6 relative z-100  max-w-[1240px] mx-auto">
        {/* Logo */}
        <Image
          src="/logo.png"
          alt="main_logo"
          width={130}
          height={48}
          priority
        />

        {/* Navigation */}
        <nav
          className={cn(
            "fixed top-[87px] left-0 w-full h-screen backdrop-blur-md bg-olive-primary/80 flex flex-col flex-1 items-center justify-start transition-all duration-300 p-15",
            "xl:static xl:h-auto xl:bg-transparent xl:flex-row xl:backdrop-blur-none xl:justify-center xl:p-0",
            isMenuOpen
              ? "opacity-100 visible"
              : "opacity-0 invisible xl:visible xl:opacity-100"
          )}
        >
          <ul
            className={cn("flex flex-col items-center gap-7.5", "xl:flex-row")}
          >
            {menuItems.map((item) => (
              <li key={item.label} className="p-1">
                <a
                  className="text-white cursor-pointer font-medium nav-link"
                  onClick={() => {
                    console.log(item.label);
                    setIsMenuOpen(false);
                  }}
                  href={item.href}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Call back button and burger menu */}
        <div className="flex items-center justify-end gap-4">
          <CallBackButton text="Зв'язатися" className="hidden md:block" />

          {/* Burger menu */}
          <button
            className="w-[25px] h-[22px] xl:hidden cursor-pointer z-100 relative"
            onClick={toggleMenu}
          >
            <span
              className={cn(
                "absolute top-0 left-0 w-full h-0.5 bg-white transition-all ease-in duration-300",
                isMenuOpen && "rotate-45 translate-y-2"
              )}
            ></span>
            <span
              className={cn(
                "absolute top-1/2 left-0 w-full h-0.5 bg-white transition-all ease-in",
                isMenuOpen && "opacity-0"
              )}
            ></span>
            <span
              className={cn(
                "absolute top-full left-0 w-full h-0.5 bg-white transition-all ease-in duration-300",
                isMenuOpen && "-translate-y-3.5 -rotate-45"
              )}
            ></span>
          </button>
        </div>
      </header>
    </div>
  );
};

export default Header;
