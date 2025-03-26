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

const containerStyles = cn(
  "bg-olive-primary border-b-[1px] border-[#42412D]",
  "relative z-50"
);

const headerStyles = cn(
  "flex items-center justify-between relative z-100 max-w-[1240px] mx-auto",
  "px-8 pt-9 pb-3",
  "md:py-4.5",
  "xl:px-[20px] xl:py-6",
  "[@media(min-width:1330px)]:px-[0px]"
);

const navigationStyles = (isMenuOpen: boolean) =>
  cn(
    "fixed top-[87px] left-0 w-full h-screen",
    "flex flex-col flex-1 items-center justify-start",
    "backdrop-blur-md bg-olive-primary/80",
    "transition-all duration-300 p-15",
    isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible",
    "xl:static xl:h-auto xl:bg-transparent",
    "xl:flex-row xl:backdrop-blur-none xl:justify-center xl:p-0",
    "xl:visible xl:opacity-100"
  );

const menuListStyles = cn("flex flex-col items-center gap-7.5", "xl:flex-row");

const menuItemStyles = "text-white cursor-pointer font-medium nav-link";

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

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className={containerStyles}>
      <header className={headerStyles}>
        {/* Logo */}
        <Image
          src="/logo.png"
          alt="main_logo"
          width={130}
          height={48}
          priority
        />

        {/* Navigation */}
        <nav className={navigationStyles(isMenuOpen)}>
          <ul className={menuListStyles}>
            {menuItems.map((item) => (
              <li key={item.label} className="p-1">
                <a
                  className={menuItemStyles}
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
          <button className={burgerButtonStyles} onClick={toggleMenu}>
            <span className={burgerLineStyles(isMenuOpen, "top")} />
            <span className={burgerLineStyles(isMenuOpen, "middle")} />
            <span className={burgerLineStyles(isMenuOpen, "bottom")} />
          </button>
        </div>
      </header>
    </div>
  );
};

export default Header;
