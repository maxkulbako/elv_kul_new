"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type PriceCardProps = HTMLMotionProps<"div"> & {
  price: number;
  consultation: string;
  giftNumber?: number;
  isRecommended?: boolean;
  isHighlighted?: boolean;
};

const PriceCard = ({
  price,
  consultation,
  giftNumber,
  isRecommended,
  isHighlighted = false,
  ...motionProps
}: PriceCardProps) => {
  return (
    <motion.div
      className={cn(
        "w-full min-h-[220px] lg:flex-1 max-w-[350px] flex flex-col items-center justify-between rounded-[8px] border-[3px]",
        isHighlighted ? "border-olive-primary" : "border-[#E6EAD8]"
      )}
      {...motionProps}
    >
      <div className="w-full flex items-center justify-center py-[12px] px-[20px] bg-olive-primary">
        <h3 className="text-[24px] text-white text-center font-semibold">
          {price} грн
        </h3>
      </div>
      <div className="py-[32px]">
        <p className="text-[18px] text-center font-medium">{consultation}</p>
        <p className="text-[18px] text-center">
          {giftNumber ? `${giftNumber} консультація в` : "консультація"}
        </p>
        {giftNumber && (
          <p className="text-[18px] text-center font-medium">ПОДАРУНОК</p>
        )}
        <br />
        {isRecommended && (
          <p className="text-[14px] text-center">* рекомендую</p>
        )}
      </div>
    </motion.div>
  );
};
export default PriceCard;
