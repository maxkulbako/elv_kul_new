import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Navbar from "../shared/Navbar";

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

const Header = () => {
  return (
    <div className={containerStyles}>
      <header className={headerStyles}>
        <Link href="/">
          <Image
            src="/logo.png"
            alt="main_logo"
            width={130}
            height={48}
            priority
          />
        </Link>

        <Link href="/" className="flex items-center space-x-2">
          <span className="text-[40px] text-white text-xl font-display font-bold leading-[10px]">
            MindfulPortal
          </span>
        </Link>
        <Navbar />
      </header>
    </div>
  );
};

export default Header;
