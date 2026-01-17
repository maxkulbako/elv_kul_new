import Image from "next/image";
import heroImage from "@/public/about_img_desk.webp";
import CallBackButton from "../shared/CallBackButton";
import ContactModal from "../shared/ContactModal";
import { cn } from "@/lib/utils/utils";

const containerStyles = cn(
  "max-w-[1240px] mx-auto",
  "px-4 pb-17 pt-8",
  "xl:px-24",
  "landing-grid",
);

const titleStyles = cn(
  "text-center leading-8",
  "xl:text-left xl:leading-11 xl:self-end",
  "area-title animate-fade-in-up opacity-0",
);

const titleTextStyles = cn(
  "text-white text-[28px] font-display",
  "lg:text-4xl",
  "xl:text-[40px]",
);

const highlightTextStyles = cn(
  "font-sans text-[28px] font-semibold text-[#444E30]",
  "lg:text-[42px]",
  "xl:text-[48px]",
);

const imageContainerStyles = cn(
  "flex justify-center w-full max-w-[350px] h-[400px] my-5 rounded-[4px] border-[1px] border-white relative",
  "md:max-w-[400px] md:h-[500px]",
  "xl:w-[420px] xl:h-[550px]",
  "area-img animate-fade-in-left opacity-0 delay-200",
);

const descriptionStyles = cn(
  "xl:w-full mx-auto py-[20px]",
  "area-text animate-fade-in-up opacity-0 delay-400",
  "xl:justify-self-start",
);

const descriptionTextStyles = cn(
  "text-[16px] italic text-center max-w-[360px] leading-6",
  "xl:text-left xl:text-[20px]",
);

const buttonWrapperStyles = cn(
  "area-btn",
  "animate-fade-in-up opacity-0 delay-600",
  "xl:self-start",
);

const Hero = () => {
  return (
    <section className="bg-olive-primary">
      <div className={containerStyles}>
        {/* Title */}
        <div className={titleStyles}>
          <p className={titleTextStyles}>КОЛИ ХОЧЕТЬСЯ</p>
          <p className={titleTextStyles}>
            ЖИТИ <span className={highlightTextStyles}>ЩАСЛИВО, </span>
          </p>
          <p className={titleTextStyles}>
            АЛЕ <span className={highlightTextStyles}>ЩОСЬ ЗАВАЖАЄ...</span>
          </p>
        </div>

        {/* Image */}
        <div className={imageContainerStyles}>
          <Image
            src={heroImage}
            alt="Hero Image"
            className="object-cover"
            fill
            priority
            sizes="(max-width: 768px) 350px, (max-width: 1024px) 400px, 420px"
          />
        </div>

        {/* Description */}
        <div className={descriptionStyles}>
          <p className={descriptionTextStyles}>
            Зі мною ви зможете зупинитися,
            <br />
            розібратися й повернутися до себе..
            <br />
            Пізнай себе по-новому!
          </p>
        </div>

        {/* Button */}
        <div className={buttonWrapperStyles}>
          <ContactModal>
            <CallBackButton text="Зв'язатися" />
          </ContactModal>
        </div>
      </div>
    </section>
  );
};

export default Hero;
