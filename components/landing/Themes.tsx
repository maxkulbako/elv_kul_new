"use client";

import { cn } from "@/lib/utils/utils";
import Image from "next/image";
import themesImage from "@/public/themes_img_desk.webp";
import questionImage from "@/public/questions_img_desk.webp";
import { motion } from "framer-motion";

const sectionStyles = cn("relative max-w-[1440px] mx-auto", "gap-8 w-full");

const titleStyles = cn(
  "text-[28px] text-white font-display text-center leading-[120%] tracking-[0%]] pb-[20px]",
  "border-b-[3px] border-olive-primary",
  "lg:max-w-[400px] lg:text-left lg:self-start",
  "xl:text-[48px] xl:max-w-[650px]",
);

const questionTitleStyles = cn(
  "text-[28px] text-white font-display text-center leading-[120%] tracking-[0%]] pb-[20px]",
  "border-b-[3px] border-olive-primary",
  "lg:max-w-[400px] lg:text-right lg:self-end",
  "xl:text-[48px] xl:max-w-[650px]",
);

const containerStyles = cn(
  "max-w-[1240px] mx-auto relative z-10 flex flex-col items-center justify-center gap-[32px]",
  "px-[16px] py-[60px]",
  "lg:px-[60px]",
  "xl:py-[100px] xl:px-0",
);

const themesData: string[] = [
  "СТОСУНКИ (ПАРТНЕР / РІДНІ)",
  "ПОШУК СЕБЕ ТА ОПОРИ",
  "БАЛАНС І РЕСУРС",
  "ВИГОРАННЯ І ПЕРЕВАНТАЖЕННЯ",
  "САМООЦІНКА І ВПЕВНЕНІСТЬ",
  'МЕЖІ ТА "НІ" БЕЗ ПРОВИНИ',
  "СТРЕС І ВНУТРІШНЯ НАПРУГА",
  "АДАПТАЦІЯ ДО ЗМІН",
];

const questionsData: string[] = [
  "Я заплуталась з правильним рішенням",
  "Мене не розуміють і не чують рідні",
  "Не розумію, куди рухатись далі",
  "Не знаю, що зі мною відбувається останнім часом",
  "Втомилась від постійної гонки",
  "Стресу стало забагато, і я хочу повернути відчуття опори",
  "Часто переживаю за майбутнє і багато накручую себе",
  "Відчуття самозванця",
  "Відчуваю в собі сили зробити ривок, але боюся",
  'Не можу казати "ні"',
  "Хочу навчитися жити спокійніше — у своєму темпі",
];

const Themes = () => {
  return (
    <section className={sectionStyles}>
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={themesImage}
          alt="Themes background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[rgba(131,142,108,0.5)]" />
      </div>
      {/* Themes container */}
      <div className={containerStyles}>
        {/* Page number */}
        <p className="text-[16px] text-white italic border-b-[2px] border-olive-primary w-fit hidden xl:block self-end">
          04
        </p>
        <div className="flex justify-between gap-[60px] xl:px-[60px]">
          <div className="flex flex-col gap-[30px] xl:gap-[60px]">
            <div className={titleStyles}>
              <h2>
                Теми, на які Ти <br /> знайдеш відповіді
              </h2>
            </div>
            <div className="flex flex-wrap w-full gap-5">
              {themesData.map((theme, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-[calc(50%-10px)]",
                    "flex items-center justify-center",
                    "border border-white rounded-[148px]",
                    "shadow-[0px_2px_4px_0px_rgba(0,0,0,0.25)]",
                    "bg-white/15",
                    "backdrop-blur-[50px]",
                    "py-[13px] px-[16px] md:py-4 md:px-[20px]",
                  )}
                >
                  <p
                    className={cn(
                      "text-[10px] md:text-[18px]",
                      "font-medium md:font-semibold",
                      "text-white text-center",
                    )}
                  >
                    {theme}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative w-[360px] h-[520px] rounded-[4px] border-[1px] border-white hidden lg:block shrink-0">
            <Image
              src={themesImage}
              alt="Themes image"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
      {/* Questions container */}
      <div className={containerStyles}>
        {/* Page number */}
        <p className="text-[16px] text-white italic border-b-[2px] border-olive-primary w-fit hidden xl:block self-start">
          05
        </p>
        <div className="flex justify-between gap-[60px] xl:px-[60px]">
          <div className="relative w-[360px] h-[520px] rounded-[4px] border-[1px] border-white hidden lg:block shrink-0">
            <Image
              src={questionImage}
              alt="Questions image"
              fill
              className="object-cover scale-x-[-1]"
            />
          </div>
          <div className="flex flex-col gap-[30px] xl:gap-[60px]">
            <div className={questionTitleStyles}>
              <h2>
                Запити, з якими <br /> звертаються клієнти
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 w-full gap-4 sm:gap-5">
              {questionsData.map((question, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: "easeOut",
                  }}
                  className={cn(
                    "px-6 py-4 sm:px-8 sm:py-5",
                    "flex items-center justify-start relative",
                    "rounded-full",
                    "shadow-[0px_2px_4px_0px_rgba(0,0,0,0.25)]",
                    "bg-olive-primary/90",
                    "before:content-['\u201C']",
                    "before:absolute before:left-4 sm:before:left-5",
                    "before:text-white/40 before:text-[24px] before:font-serif",
                  )}
                >
                  <p
                    className={cn(
                      "text-[14px] sm:text-[15px] md:text-[16px]",
                      "font-medium",
                      "text-white",
                      "pl-6 sm:pl-7",
                      "leading-[1.4]",
                    )}
                  >
                    {question}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Themes;
