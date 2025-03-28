import { cn } from "@/lib/utils";
import Image from "next/image";
import smallLogo from "@/public/small_logo.svg";
import logo from "@/public/logo.png";
import { Icons } from "../shared/icons";

const containerStyles = cn(
  "max-w-[1240px] mx-auto flex flex-col items-center justify-center gap-[60px]",
  "px-[32px] py-[60px]",
  "lg:px-[60px]",
  "xl:py-[100px]"
);

const Footer = () => {
  return (
    <footer className="bg-olive-primary">
      <div className={containerStyles}>
        <div className="w-full flex flex-col items-center justify-center gap-[40px] xl:flex-row xl:justify-between">
          <Image
            src={smallLogo}
            alt="logo"
            width={44}
            height={44}
            className="block xl:hidden"
          />
          <Image
            src={logo}
            alt="logo"
            width={120}
            height={120}
            className="hidden xl:block"
          />
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
