"use client";

import { cn } from "@/lib/utils/utils";
import Image from "next/image";
import confidenceImage from "@/public/confidence_img_desk.webp";
import { motion } from "framer-motion";

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
              МОЯ ОСОБЛИВІСТЬ У РОБОТІ
            </h2>
          </div>

          <p className="font-montserrat text-base lg:text-xl text-white text-center w-full font-normal lg:font-extralight">
            Моя сильна сторона - глибина і щирий інтерес.
          </p>

          <p className="font-montserrat text-base lg:text-xl text-white text-center w-full font-normal lg:font-extralight max-w-[800px] mx-auto">
            Завжди враховую інтереси своїх клієнтів, усвідомлюю
            <br />
            Мені справді важливо, як ви почуваєтесь і що з вами відбувається.
            Тому з часом ви починаєте більше довіряти, розслаблятися і можете
            говорити чесно - без напруги і страху, що вас оцінять.
            <br />
            <br />Я багато працюю над собою, своєю якістю життя і професійністю.
            І мій досвід допомагає створити такий простір, де вам безпечно і
            по-простому і легко.
          </p>

          <motion.div
            initial={{ rotate: 0 }}
            whileInView={{ rotate: 360 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <Image
              src="/small_logo.svg"
              alt="Small logo"
              width={42}
              height={42}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Confidence;
