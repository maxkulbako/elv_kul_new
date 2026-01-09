import { cn } from "@/lib/utils/utils";
import Image from "next/image";
import additionalImage from "@/public/additional_img_desk.webp";
import Link from "next/link";

const containerStyles = cn(
  "max-w-[1240px] mx-auto",
  "px-[32px] py-[60px]",
  "lg:px-[60px]",
  "xl:py-[100px] xl:px-0",
);

const imageContainerStyles = cn(
  "relative w-full max-w-[420px] h-[550px]",
  "self-center overflow-hidden",
  "shadow-olive-revert",
  "lg:flex-shrink-0",
  "xl:ml-[60px]",
);

const Additional = () => {
  return (
    <section>
      <div className={containerStyles}>
        <div className="flex flex-col items-center gap-[32px] lg:flex-row lg:justify-between xl:px-[60px]">
          <div className="flex flex-col items-center gap-[32px]">
            <h2 className="text-[28px] font-display text-center leading-[120%] tracking-[0%]] xl:text-[48px]">
              Все ще залишилися питання?
            </h2>
            <div className="flex flex-col items-center gap-[12px]">
              <p className="text-[16px] font-medium">
                Напиши їх мені в Telegram
              </p>
              <Link
                href="https://t.me/elvida_kulbako"
                target="_blank"
                rel="noopener noreferrer"
                className="w-[234px] h-[62px] xl:w-[264px] p-[6px] border-[0.5px] border-[#42412d] rounded-[100px]"
              >
                <span className="btn-gradient w-full h-full text-[18px] p-[14px] font-semibold flex items-center justify-center">
                  Звʼязатися
                </span>
              </Link>
            </div>
          </div>
          <div className={imageContainerStyles}>
            <Image
              src={additionalImage}
              alt="additional"
              className="w-full h-full object-cover scale-x-[-1]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Additional;
