import { cn } from "@/lib/utils/utils";
import Navbar from "../shared/Navbar";
import AnimatedLogo from "./AnimatedLogo";

const containerStyles = cn(
  "bg-olive-primary border-b-[1px] border-[#42412D]",
  "relative z-50",
);

const headerStyles = cn(
  "flex items-center justify-between relative z-100 max-w-[1240px] mx-auto",
  "px-8 pt-9 pb-3",
  "md:py-4.5",
  "xl:px-[20px] xl:py-6",
  "[@media(min-width:1330px)]:px-[0px]",
);

const Header = () => {
  return (
    <div className={containerStyles}>
      <header className={headerStyles}>
        <AnimatedLogo />
        <Navbar />
      </header>
    </div>
  );
};

export default Header;
