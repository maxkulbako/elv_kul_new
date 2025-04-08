import Image from "next/image";
import Link from "next/link";
import CallBackButton from "@/components/shared/CallBackButton";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/shared/icons";
import Navbar from "../shared/Navbar";

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
    "fixed top-[99px] left-0 w-full h-screen",
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

const specialMenuItemStyles = cn(
  menuItemStyles,
  "relative group flex items-center gap-2",
  "before:absolute before:inset-0 before:bg-gradient-to-r before:from-[#919D79]/30 before:to-[#42412D]/30",
  "before:opacity-0 before:transition-opacity before:duration-300",
  "hover:before:opacity-100",
  "after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-[2px] after:bg-[#F5F6F0]",
  "after:transition-all after:duration-300",
  "hover:after:w-full hover:after:left-0",
  "before:absolute before:bottom-0 before:right-1/2 before:w-0 before:h-[2px] before:bg-[#F5F6F0]",
  "before:transition-all before:duration-300",
  "hover:before:w-full hover:before:right-0",
  "px-3 py-1 rounded-md mx-3 justify-end"
);

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
  // const [isMenuOpen, setIsMenuOpen] = useState(false);

  // useEffect(() => {
  //   if (isMenuOpen) {
  //     document.body.style.overflow = "hidden";
  //   } else {
  //     document.body.style.overflow = "";
  //   }

  //   return () => {
  //     document.body.style.overflow = "";
  //   };
  // }, [isMenuOpen]);

  // const toggleMenu = () => {
  //   setIsMenuOpen(!isMenuOpen);
  // };

  return (
    <div className={containerStyles}>
      <header className={headerStyles}>
        {/* Logo */}
        <Link href="/">
          <Image
            src="/logo.png"
            alt="main_logo"
            width={130}
            height={48}
            priority
          />
        </Link>
        {/* Navigation */}
        {/* <nav className={navigationStyles(isMenuOpen)}>
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
        </nav> */}
        <Navbar />

        {/* Tests */}
        {/* <Link href="/tests" className={specialMenuItemStyles}>
          <Icons.sparkles
            className="w-4 h-4 text-[#F5F6F0] animate-pulse"
            color="currentColor"
          />
          <span className="text-white">Тести</span>
          <Icons.sparkles
            className="w-4 h-4 text-[#F5F6F0] animate-pulse"
            color="currentColor"
          />
        </Link> */}

        {/* Call back button and burger menu */}
        {/* <div className="flex items-center justify-end gap-4">
          <Link href="/sign-in">
            <CallBackButton text="Клієнтський портал" />
          </Link> */}

        {/* Burger menu */}
        {/* <button className={burgerButtonStyles} onClick={toggleMenu}>
            <span className={burgerLineStyles(isMenuOpen, "top")} />
            <span className={burgerLineStyles(isMenuOpen, "middle")} />
            <span className={burgerLineStyles(isMenuOpen, "bottom")} />
          </button>
        </div> */}
      </header>
    </div>
  );
};

export default Header;
