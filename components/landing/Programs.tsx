import Image from "next/image";
import programsImage from "@/public/programs_img_desk.webp";
import { cn } from "@/lib/utils";
import ProgramCard from "./ProgramCard";

const containerStyles = cn(
  "max-w-[1240px] mx-auto",
  "px-[32px] py-[60px]",
  "lg:px-[60px]",
  "xl:py-[100px] xl:px-0"
);

const titleStyles = cn(
  "text-[28px] font-display text-center leading-[120%] tracking-[0%]]",
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

const Programs = () => {
  const programsData = [
    {
      title: "Корпоративні лекції",
      description:
        "Звертайтесь до мене щодо проведення лекцій чи тренінгів, щоб збільшити ефективність своїх співробітників для збільшення доходу.",
    },
    {
      title: "Некомерційне партнерство",
      description: "Я активно підтримую ініціативи, які дотичні до психоосвіти",
    },
    {
      title: "Корпоративні лекції",
      description:
        "Звертайтесь до мене щодо проведення лекцій чи тренінгів, щоб збільшити ефективність своїх співробітників для збільшення доходу.",
    },
    {
      title: "Некомерційне партнерство",
      description: "Я активно підтримую ініціативи, які дотичні до психоосвіти",
    },
  ];

  return (
    <section>
      <div className={containerStyles}>
        <div className="flex flex-col items-center gap-[32px]">
          <p className="text-[16px] italic border-b-[2px] border-olive-primary w-fit hidden xl:block self-start">
            06
          </p>

          {/* Title */}
          <h2 className={titleStyles}>
            "Мої програми. <br className="hidden xl:block" /> Персональні та
            групові"
          </h2>

          {/* Image and Programs */}
          <div className="flex flex-col gap-[32px] w-full h-full lg:flex-row lg:justify-between">
            <div className={imageContainerStyles}>
              <Image
                src={programsImage}
                alt="Programs"
                fill
                sizes="(max-width: 1024px) 420px, (max-width: 1280px) 450px, 650px"
                className="object-cover object-top"
              />
            </div>

            {/* Programs */}
            <div className="flex flex-col gap-[16px] justify-center">
              {programsData.map((program, index) => (
                <ProgramCard
                  key={index}
                  index={index}
                  title={program.title}
                  description={program.description}
                  className={index === 3 ? "hidden xl:flex xl:flex-col" : ""}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Programs;
