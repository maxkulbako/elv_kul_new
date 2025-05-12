"use client";

import { cn } from "@/lib/utils/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Arrow from "@/public/arrow.svg";
import Image from "next/image";

const sectionStyles = cn(
  "max-w-[1440px] mx-auto bg-olive-primary",
  "gap-8 w-full",
);

const containerStyles = cn(
  "max-w-[1240px] mx-auto flex flex-col items-center justify-center gap-[32px] ",
  "px-[32px] py-[60px]",
  "lg:px-[60px]",
  "xl:py-[100px] xl:px-0",
);

const faqItems: { question: string; answer: string }[] = [
  {
    question: "Скільки консультацій необхідно?",
    answer:
      "Кількість необхідних зустрічей, залежить від декількох факторів: ваш основний запит/скарга, тобто те, з чим ви звернулися, наявність додаткових проблем, виявлених у ході обстеження/дослідження, кінцевий список цілей, сформульований спільно з вами. Після систематизації списку цілей і бажань ми можемо узгодити план консультування або терапії та прогнозування її тривалості. Також до уваги варто взяти життєвий контекст, який може вносити корективи в довготривалість терапії.",
  },
  {
    question: "Як часто проводяться консультації?",
    answer:
      "Частота консультацій залежить від вашого графіку і потреби в терапії. Зазвичай вони проводяться раз на тиждень або раз на два тижні.",
  },
  {
    question: "Яка вартість консультацій?",
    answer:
      "Вартість консультацій може варіюватися в залежності від тривалості сесії та інших факторів. Будь ласка, зверніться за додатковою інформацією.",
  },
  {
    question: "Скільки консультацій необхідно?",
    answer:
      "Кількість необхідних зустрічей, залежить від декількох факторів: ваш основний запит/скарга, тобто те, з чим ви звернулися, наявність додаткових проблем, виявлених у ході обстеження/дослідження, кінцевий список цілей, сформульований спільно з вами. Після систематизації списку цілей і бажань ми можемо узгодити план консультування або терапії та прогнозування її тривалості. Також до уваги варто взяти життєвий контекст, який може вносити корективи в довготривалість терапії.",
  },
  {
    question: "Як часто проводяться консультації?",
    answer:
      "Частота консультацій залежить від вашого графіку і потреби в терапії. Зазвичай вони проводяться раз на тиждень або раз на два тижні.",
  },
  {
    question: "Яка вартість консультацій?",
    answer:
      "Вартість консультацій може варіюватися в залежності від тривалості сесії та інших факторів. Будь ласка, зверніться за додатковою інформацією.",
  },
];

const FAQ = () => {
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);

  const handelOpenQuestion = (index: number) => {
    setActiveQuestion(activeQuestion === index ? null : index);
    console.log(activeQuestion);
  };

  return (
    <section className={sectionStyles}>
      <div className={containerStyles}>
        <p className="text-[16px] italic text-white border-b-[2px] border-black w-fit hidden xl:block self-end">
          07
        </p>
        <div className="w-full flex flex-col items-center justify-center gap-[32px] lg:w-[720px]">
          <h2 className="text-center text-white text-[28px] font-display leading-[120%] tracking-[0%] pb-[20px] border-b-[3px] border-white xl:text-[48px] max-w-[580px]">
            Відповіді на чісті запитання
          </h2>
          <div className="w-full flex flex-col items-center justify-center gap-[32px]">
            {faqItems.map((item, index) => (
              <div key={index} className="w-full">
                <div className="w-full bg-[#919D79] rounded-lg border-[#F5F6F0]/30 border-[1px]">
                  <motion.button
                    className="px-[20px] py-[16px] w-full flex justify-between items-center"
                    onClick={() => handelOpenQuestion(index)}
                  >
                    <div className="w-full">
                      <h3 className="font-medium pr-[42px] text-left">
                        {item.question}
                      </h3>
                    </div>

                    <motion.div
                      animate={{ rotate: activeQuestion === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-2xl"
                    >
                      <Image src={Arrow} alt="Arrow" width={23} height={18} />
                    </motion.div>
                  </motion.button>
                  <AnimatePresence>
                    {activeQuestion === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-[20px] py-[16px] whitespace-pre-line bg-[#F5F6F0] rounded-b-lg">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
