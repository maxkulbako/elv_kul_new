"use client";

import { useRef } from "react";
import Image from "next/image";
import aboutImage from "@/public/story_img_desk.webp";
import { cn } from "@/lib/utils/utils";
import { motion, useInView } from "framer-motion";

const containerStyles = cn(
  "max-w-[1240px] mx-auto",
  "px-[16px] py-[60px]",
  "lg:px-[60px]",
  "xl:py-[100px] xl:px-0",
);

const titleStyles = cn(
  "text-[28px] font-display text-center leading-[120%] tracking-[0%]]",
  "pb-[20px] border-b-[3px] border-olive-primary",
  "lg:max-w-[400px] lg:text-right lg:self-end",
  "xl:text-[48px] xl:max-w-[650px]",
);

const imageContainerStyles = cn(
  "relative w-full max-w-[420px] h-[550px]",
  "self-center overflow-hidden",
  "shadow-olive",
  "lg:flex-shrink-0",
  "xl:ml-[60px]",
);

const textContainerStyles = cn(
  "max-w-[650px] self-center",
  "lg:self-center",
  "xl:pr-[60px] xl:max-w-[605px]",
);

const About = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: false, margin: "-30%" });

  return (
    <section ref={containerRef} className="relative overflow-hidden">
      {/* Background Typography */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 hidden lg:block">
        <span className="text-[15vw] font-display text-olive-primary/5 whitespace-nowrap select-none">
          ІСТОРІЯ
        </span>
      </div>

      <div className={cn(containerStyles, "relative z-10")}>
        <div className="flex flex-col items-center gap-[32px]">
          <p className="text-[16px] italic border-b-[2px] border-olive-primary w-fit hidden xl:block self-start">
            01
          </p>

          {/* Title */}
          <motion.h2
            className={titleStyles}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            &quot;Я допомагаю побачити і почути себе,
            <br className="hidden xl:block" /> зрозуміти свої бажання і вибрати
            свій шлях.&quot;
          </motion.h2>

          {/* Image and Text */}
          <div className="flex flex-col gap-[32px] w-full h-full lg:flex-row lg:justify-between items-center">
            {/* Image with Venetian Blinds Effect */}
            <div className={cn(imageContainerStyles, "relative")}>
              <Image
                src={aboutImage}
                alt="About"
                fill
                sizes="(max-width: 1024px) 420px, (max-width: 1280px) 450px, 650px"
                className="object-cover object-top"
              />
              {/* The Blinds Overlay */}
              <div className="absolute inset-0 flex flex-col h-full w-full">
                {[...Array(10)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-full bg-[#F5F6F0] flex-1"
                    initial={{ scaleY: 1 }}
                    animate={isInView ? { scaleY: 0 } : { scaleY: 1 }}
                    transition={{
                      duration: 0.8,
                      ease: [0.22, 1, 0.36, 1],
                      delay: i * 0.05,
                    }}
                    style={{ originY: 0 }}
                  />
                ))}
              </div>
            </div>

            {/* Text with slide-in animation */}
            <div className={textContainerStyles}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.8,
                  delay: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <h3 className="text-[18px] text-center font-semibold pb-[20px] lg:text-[20px] lg:text-left">
                  Про мене
                </h3>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.8,
                  delay: 1.0,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="text-[16px] xl:text-[20px]"
              >
                Я Ельвіда, психологиня. Працюю з тими, хто хоче жити щасливо і
                якісно, але зараз відчуває, що щось заважає — навіть якщо поки
                не зрозуміло, що саме. Ми разом розкладаємо все по поличках, щоб
                у вас з&apos;явилися внутрішній спокій, опора всередині й
                зрозумілі кроки, що робити далі.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.8,
                  delay: 1.3,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <h3 className="text-[18px] text-center font-semibold pt-[32px] pb-[20px] lg:text-[20px] lg:text-left">
                  Моя місія
                </h3>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.8,
                  delay: 1.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="text-[16px] xl:text-[20px]"
              >
                Моя місія - приводити вас до щастя і внутрішнього спокою. До
                свободи обирати своє життя без внутрішніх блоків, установок та
                обмежень. Про масштаб мислення, сміливість мріяти, дозволяти
                собі бути собою і отримувати задоволення від процесу під назвою
                життя. Я живу так сама - це моя філософія.
              </motion.p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
