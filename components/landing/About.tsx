"use client";

import Image from "next/image";
import aboutImage from "@/public/story_img_desk.webp";
import { cn } from "@/lib/utils/utils";
import { motion } from "framer-motion";

const containerStyles = cn(
  "max-w-[1240px] mx-auto",
  "px-[32px] py-[60px]",
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
  return (
    <section>
      <div className={containerStyles}>
        <div className="flex flex-col items-center gap-[32px]">
          <p className="text-[16px] italic border-b-[2px] border-olive-primary w-fit hidden xl:block self-start">
            01
          </p>

          {/* Title */}
          <h2 className={titleStyles}>
            &quot;Я допомагаю побачити і почути себе,
            <br className="hidden xl:block" /> зрозуміти свої бажання і вибрати
            свій шлях.&quot;
          </h2>

          {/* Image */}
          <div className="flex flex-col gap-[32px] w-full h-full lg:flex-row lg:justify-between">
            <div className={imageContainerStyles}>
              <Image
                src={aboutImage}
                alt="About"
                fill
                sizes="(max-width: 1024px) 420px, (max-width: 1280px) 450px, 650px"
                className="object-cover object-top"
              />
            </div>

            {/* Text */}
            <div className={textContainerStyles}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-[18px] text-center font-semibold pb-[20px] lg:text-[20px] lg:text-left">
                  Моя історія
                </h3>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-[16px] xl:text-[20px]"
              >
                Я Ельвіда, психологиня. Працюю з тими, хто хоче жити щасливо і
                якісно, але зараз відчуває, що щось заважає — навіть якщо поки
                не зрозуміло, що саме. Ми разом розкладаємо все по поличках, щоб
                у вас з&apos;явилися внутрішній спокій, опора всередині й
                зрозумілі кроки, що робити далі.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h3 className="text-[18px] text-center font-semibold pt-[32px] pb-[20px] lg:text-[20px] lg:text-left">
                  Моя місія
                </h3>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
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
