import Image from "next/image";
import heroImage from "@/public/about_img_desk.webp";
import CallBackButton from "../shared/CallBackButton";
import { cn } from "@/lib/utils";

const Hero = () => {
  return (
    <section className="bg-olive-primary">
      <div className="max-w-[1240px] mx-auto px-8 pb-17 pt-8 xl:px-24 landing-grid">
        <div className="text-center xl:text-left xl:leading-11 xl:self-end area-title animate-fade-in-up opacity-0">
          <p className="text-white text-[28px] lg:text-4xl xl:text-[40px] font-display">
            НАПРАВЛЮ ТЕБЕ
          </p>
          <p className="text-white text-[28px] lg:text-4xl xl:text-[40px] font-display">
            ЯК{" "}
            <span className="font-sans text-[28px] lg:text-[42px] xl:text-[48px] font-semibold text-[#444E30]">
              ВИРІШИТИ
            </span>
          </p>
          <p className="text-white text-[28px] lg:text-4xl xl:text-[40px] font-display">
            СКЛАДНІ{" "}
            <span className="font-sans text-[28px] lg:text-[42px] xl:text-[48px] font-semibold text-[#444E30]">
              СИТУАЦІЇ
            </span>
          </p>
        </div>
        <div
          className={cn(
            "flex justify-center w-full max-w-[350px] h-[400px] my-5 rounded-[4px] border-[1px] border-white relative",
            "md:max-w-[400px] md:h-[500px] xl:w-[420px] xl:h-[550px]",
            "area-img animate-fade-in-left opacity-0 delay-200"
          )}
        >
          <Image
            src={heroImage}
            alt="Hero Image"
            className="object-cover"
            fill
            priority
            sizes="(max-width: 768px) 350px,
            (max-width: 1024px) 400px,
            420px"
          />
        </div>
        <div className=" xl:w-full mx-auto pb-[20px] area-text animate-fade-in-up opacity-0 delay-400 xl:justify-self-start">
          <p className="text-[16px]  italic text-center xl:text-left xl:text-[20px] leading-6 max-w-[360px]">
            Психологиня-консультант.
            <br />
            Допомагаю людям віднайти гармонію. Вселяю віру та любов до себе.
            <br />
            Пізнай себе по-новому!
          </p>
        </div>
        <div className="area-btn animate-fade-in-up opacity-0 delay-600 xl:self-start">
          <CallBackButton text="Зв'язатися" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
