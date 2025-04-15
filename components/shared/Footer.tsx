import { cn } from "@/lib/utils";
import Image from "next/image";
import smallLogo from "@/public/small_logo.svg";
import logo from "@/public/logo.png";
import { Icons } from "../shared/icons";

const containerStyles = cn(
  "max-w-[1240px] mx-auto flex flex-col items-center justify-center gap-[60px]",
  "px-[32px] py-[60px]",
  "lg:px-[60px]"
);

const Footer = () => {
  return (
    <footer className="bg-[#42412D]">
      <div className={containerStyles}>
        <div className="w-full flex flex-col items-center justify-center gap-[40px] xl:flex-row xl:justify-between">
          <div className="relative w-[44px] h-[44px] block xl:hidden">
            <Image
              src={smallLogo}
              alt="logo"
              fill
              className="object-contain"
              sizes="44px"
            />
          </div>
          <div className="relative w-[120px] h-[120px] hidden xl:block">
            <Image src={logo} alt="logo" fill className="object-contain" />
          </div>
          <div className="text-white text-[18px] text-center">
            <p>+38 098 123 45 67</p>
            <p>home@psy-elvida.com</p>
          </div>
          <div className="flex gap-[20px]">
            <Icons.telegram className="w-[56px] h-[56px]" color="#fff" />
            <Icons.instagram className="w-[56px] h-[56px]" color="#fff" />
            <Icons.facebook className="w-[56px] h-[56px]" color="#fff" />
          </div>
          <p className="text-[16px] font-medium text-white">
            &copy; {new Date().getFullYear()} Elvida Kulbako
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
