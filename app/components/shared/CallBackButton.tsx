"use client";

import { cn } from "@/lib/utils";

const CallBackButton = ({
  className,
  text,
}: {
  className?: string;
  text: string;
}) => {
  return (
    <div
      className={cn(
        "w-[234px] h-[62px] xl:w-[264px] p-[6px] border-[0.5px] border-[#42412d] rounded-[100px]",
        className
      )}
    >
      <button
        className="btn-gradient w-full h-full text-[18px] p-[14px] font-semibold flex items-center justify-center"
        onClick={() => console.log("clicked on call back button")}
      >
        {text}
      </button>
    </div>
  );
};

export default CallBackButton;
