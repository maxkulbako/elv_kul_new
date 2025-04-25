"use client";

import { motion } from "framer-motion";

interface ProgramCardProps {
  title: string;
  description: string;
  className?: string;
  index: number;
}

const ProgramCard = ({
  title,
  description,
  className,
  index,
}: ProgramCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.3,
        delay: index * 0.2,
      }}
      className={`flex flex-col bg-[#F5F6F0] p-[32px] rounded-[4px] ${className}`}
    >
      <h3 className="text-[18px] text-center font-semibold pb-[20px] lg:text-[20px] lg:text-left">
        {title}
      </h3>
      <p className="text-[16px] text-center lg:text-left xl:text-[20px]">
        {description}
      </p>
    </motion.div>
  );
};

export default ProgramCard;
