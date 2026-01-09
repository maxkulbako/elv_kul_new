"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils/utils";

type PriceCardProps = HTMLMotionProps<"div"> & {
  priceEur: number;
  priceUah: number;
  consultations: number;
  duration?: string;
  note?: string;
  isHighlighted?: boolean;
};

const PriceCard = ({
  priceEur,
  priceUah,
  consultations,
  duration,
  note,
  isHighlighted = false,
  ...motionProps
}: PriceCardProps) => {
  return (
    <motion.div
      className={cn(
        "w-full min-h-[220px] lg:flex-1 max-w-[350px] flex flex-col items-center rounded-[8px] border-[3px] overflow-hidden",
        isHighlighted
          ? "border-olive-primary lg:min-h-[260px] lg:max-w-[380px]"
          : "border-[#E6EAD8]",
      )}
      {...motionProps}
    >
      <div className="w-full flex flex-col items-center justify-center py-[16px] px-[20px] bg-olive-primary">
        <h3 className="text-[28px] text-white text-center font-semibold">
          {priceEur} €
        </h3>
        <p className="text-[16px] text-white/80 text-center">
          або {priceUah} грн
        </p>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center py-[32px] px-[20px]">
        <p className="text-[20px] text-center font-semibold">
          {consultations}{" "}
          {consultations === 1
            ? "консультація"
            : consultations < 5
              ? "консультації"
              : "консультацій"}
        </p>
        {duration && (
          <p className="text-[16px] text-center text-gray-600 mt-[8px]">
            {duration}
          </p>
        )}
        {note && (
          <p className="text-[14px] text-center text-gray-500 mt-[12px] italic">
            * {note}
          </p>
        )}
      </div>
    </motion.div>
  );
};
export default PriceCard;
