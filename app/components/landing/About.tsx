import Image from "next/image";
import aboutImage from "@/public/story_img_desk.webp";
import { cn } from "@/lib/utils";

const containerStyles = cn(
  "max-w-[1240px] mx-auto",
  "px-[32px] py-[60px]",
  "lg:px-[60px]",
  "xl:py-[100px]"
);

const titleStyles = cn(
  "text-[28px] font-display text-center",
  "pb-[20px] border-b-[3px] border-olive-primary",
  "lg:max-w-[400px] lg:text-right lg:self-end",
  "xl:text-[48px] xl:max-w-[650px]"
);

const imageContainerStyles = cn(
  "relative w-full max-w-[420px] h-[550px]",
  "self-center overflow-hidden",
  "shadow-olive",
  "lg:flex-shrink-0",
  "xl:ml-[60px]"
);

const textContainerStyles = cn(
  "lg:self-center lg:max-w-[560px]",
  "xl:pr-[60px]"
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
            "Усі відповіді уже в тобі. <br className="hidden xl:block" /> Я
            тільки допоможу їх віднайти"
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
              <h3 className="text-[18px] text-center font-semibold pb-[20px] lg:text-[20px]">
                Моя історія
              </h3>
              <p className="text-[16px] xl:text-[20px]">
                Сім років тому я розпочала свою подорож до психології. Я знаю,
                як почувається людина, яка відчуває біль, вигорання і
                розгубленість.
                <br />
                <br />
                Знаю, як віднайти омріяний BALANCE. Сміливо починати все з нуля
                і реалізовуватися на повну.
                <br />
                <br />
                Моя місія - спільно з тобою знайти твою внутрішню силу, віру і
                бажання, які допоможуть жити на повну і саме головне - відчути
                справжню енергію життя. допоможуть жити на повну і саме головне
                - відчути справжню енергію життя.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
