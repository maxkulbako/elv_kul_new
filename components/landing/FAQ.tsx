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
  "px-[16px] py-[60px]",
  "lg:px-[60px]",
  "xl:py-[100px] xl:px-0",
);

const faqItems: { question: string; answer: string }[] = [
  {
    question: "Скільки консультацій необхідно?",
    answer:
      "Кількість зустрічей залежить від вашого запиту, цілей і життєвого контексту. На перших 1–2 консультаціях ми уточнюємо, з чим ви прийшли, формулюємо цілі й узгоджуємо орієнтовний план та тривалість роботи.",
  },
  {
    question: "Як часто проводяться консультації?",
    answer:
      "Частота залежить від вашого запиту та ритму життя. Найчастіше зустрічі відбуваються 1 раз на тиждень або 1 раз на два тижні, інколи — 1 раз на місяць (для підтримки/супроводу).",
  },
  {
    question: "Яка вартість консультацій?",
    answer:
      'Вартість консультації вказана вище на цій сторінці (у блоці "Тарифи").',
  },
  {
    question: "Як скасувати або перенести зустріч?",
    answer:
      "Якщо виник форс-мажор, будь ласка, попередьте не пізніше ніж за 24 години — тоді ми переносимо зустріч, і оплата зберігається. Якщо скасування менш ніж за 24 години — сесія зазвичай вважається проведеною (це стандартна практика).",
  },
  {
    question: "Скільки триває консультація?",
    answer: "Зазвичай консультація триває 50–55 хвилин.",
  },
  {
    question: "Онлайн чи офлайн? Як проходить зустріч?",
    answer:
      "Консультації проходять онлайн (відеозв'язок) - вам потрібне тихе місце та стабільний інтернет.",
  },
  {
    question: "Як підготуватися до першої консультації?",
    answer:
      "Достатньо бути в спокійному місці і подумати: що саме турбує і якого результату хочеться. Якщо запит сформулювати складно - ми зробимо це разом.",
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
