"use client";

import Image from "next/image";
import programsImage from "@/public/programs_img_desk.webp";
import { cn } from "@/lib/utils/utils";
import { motion } from "framer-motion";

const containerStyles = cn(
  "max-w-[1240px] mx-auto",
  "px-[16px] py-[60px]",
  "lg:px-[60px]",
  "xl:py-[100px] xl:px-0",
);

const titleStyles = cn(
  "text-[28px] font-display text-center leading-[120%] tracking-[0%]",
  "pb-[20px] border-b-[3px] border-olive-primary",
  "lg:max-w-[500px] lg:text-right lg:self-end",
  "xl:text-[48px] xl:max-w-[700px]",
);

const imageContainerStyles = cn(
  "relative w-full max-w-[420px] h-[550px]",
  "self-center overflow-hidden",
  "shadow-olive",
  "lg:flex-shrink-0",
  "xl:ml-[60px]",
);

const Programs = () => {
  const benefitsData = [
    "Знайдете внутрішню опору і почнете ставитися до себе м'якше.",
    "Зменшите вигорання і повернете собі енергію.",
    "Відчуєте більше впевненості і зможете рухатися до своїх цілей.",
    "Навчитеся будувати кордони та казати «ні» без провини.",
    "Навчитеся краще керувати тривогою і заспокоювати себе.",
    "Послабите самокритику, синдром самозванця і потребу бути ідеальними.",
    "Усвідомите свої справжні бажання і почнете діяти більш по-своєму.",
    "Знизите рівень стресу та внутрішньої напруги, краще відновлюватиметесь.",
    'Стане менше тривожних думок, навчитеся заспокоювати себе і повертатися "в тут-і-зараз".',
  ];

  return (
    <section>
      <div className={containerStyles}>
        <div className="flex flex-col items-center gap-[32px]">
          <p className="text-[16px] italic border-b-[2px] border-olive-primary w-fit hidden xl:block self-end">
            02
          </p>

          {/* Title */}
          <h2 className={titleStyles}>
            Що ви отримаєте в результаті роботи зі мною
          </h2>

          {/* Image and Benefits */}
          <div className="flex flex-col gap-[32px] w-full h-full lg:flex-row lg:justify-between">
            <div className={imageContainerStyles}>
              <Image
                src={programsImage}
                alt="Результати роботи"
                fill
                sizes="(max-width: 1024px) 420px, (max-width: 1280px) 450px, 650px"
                className="object-cover object-top"
              />
            </div>

            {/* Benefits List */}
            <div className="flex flex-col gap-[12px] justify-center lg:max-w-[550px]">
              {benefitsData.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.1,
                  }}
                  className="flex items-start gap-[16px] bg-[#F5F6F0] p-[20px] rounded-[4px]"
                >
                  <span className="text-olive-primary text-[20px] font-semibold flex-shrink-0">
                    ✓
                  </span>
                  <p className="text-[16px] leading-[150%] xl:text-[18px]">
                    {benefit}
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

export default Programs;
