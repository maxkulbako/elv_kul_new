import { cn } from "@/lib/utils/utils";
import Image from "next/image";
import Link from "next/link";
import smallLogo from "@/public/small_logo.svg";
import logo from "@/public/logo.png";
import { Icons } from "../shared/icons";

const TELEGRAM_LINK = "https://t.me/elvida_kulbako";
const INSTAGRAM_LINK = "https://instagram.com/psy.elvida_kulbako";
const FACEBOOK_LINK = "https://facebook.com/elvida.tretyak";

const containerStyles = cn(
  "max-w-[1240px] mx-auto flex flex-col items-center justify-center gap-[60px]",
  "px-[32px] py-[60px]",
  "lg:px-[60px]",
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
              sizes="(max-width: 1280px) 44px, 0px"
            />
          </div>
          <div className="relative w-[120px] h-[120px] hidden xl:block">
            <Image
              src={logo}
              alt="logo"
              fill
              className="object-contain"
              sizes="(min-width: 1280px) 120px, 0px"
            />
          </div>
          <div className="text-white text-[18px] text-center">
            <p>+38 067 353 07 75</p>
            <p>home@psy-elvida.com</p>
          </div>
          <div className="flex gap-[20px]">
            <Link
              href={TELEGRAM_LINK}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icons.telegram
                className="w-[56px] h-[56px] hover:opacity-80 transition-opacity"
                color="#fff"
              />
            </Link>
            <Link
              href={INSTAGRAM_LINK}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icons.instagram
                className="w-[56px] h-[56px] hover:opacity-80 transition-opacity"
                color="#fff"
              />
            </Link>
            <Link
              href={FACEBOOK_LINK}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icons.facebook
                className="w-[56px] h-[56px] hover:opacity-80 transition-opacity"
                color="#fff"
              />
            </Link>
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
