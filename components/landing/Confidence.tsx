import { cn } from "@/lib/utils/utils";
import Image from "next/image";
import confidenceImage from "@/public/confidence_img_desk.webp";

const sectionStyles = cn("relative max-w-[1440px] mx-auto", "gap-8 w-full");

const containerStyles = cn(
  "max-w-[1240px] mx-auto relative z-10 flex flex-col items-center justify-center gap-[32px]",
  "px-[32px] py-[60px]",
  "lg:px-[60px]",
  "xl:py-[100px] xl:px-0",
);

const Confidence = () => {
  return (
    <section className={sectionStyles}>
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={confidenceImage}
          alt="Themes background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[rgba(131,142,108,0.5)]" />
      </div>
      {/* Content */}
      <div className={containerStyles}>
        {/* Page number */}
        <p className="text-[16px] text-white italic border-b-[2px] border-olive-primary w-fit hidden xl:block self-end">
          05
        </p>

        <div className="flex flex-col items-center p-6 sm:p-12 gap-8 bg-white/5 backdrop-blur-[20px] shadow-[0px_2px_20px_0px_rgba(0,0,0,0.25)]">
          <div className="w-full sm:min-w-[395px] lg:min-w-[700px]">
            <h2 className="text-center text-white text-[28px] font-display leading-[120%] tracking-[0%] pb-[20px] border-b-[3px] border-olive-primary xl:text-[48px]">
              100% КОНФІДЕНЦІЙНОСТІ
            </h2>
          </div>

          <p className="font-montserrat text-base lg:text-xl text-white text-center w-full font-normal lg:font-extralight">
            Я дію відповідно до етичних стандартів УАПП
          </p>

          <p className="font-montserrat text-base lg:text-xl text-white text-center w-full font-normal lg:font-extralight">
            Завжди враховую інтереси своїх клієнтів, усвідомлюю
            <br />
            межі своїх знань,
            <br />
            досвіду та навичок.
          </p>

          <Image
            src="/small_logo.svg"
            alt="Small logo"
            width={42}
            height={42}
          />
        </div>
      </div>
    </section>
  );
};

export default Confidence;
