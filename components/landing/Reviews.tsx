"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils/utils";
import { ChevronLeft, ChevronRight, User } from "lucide-react";

// Soft gradient colors for anonymous avatars
const avatarGradients = [
  "from-[#E6EAD8] to-[#C8D4A9]",
  "from-[#D4E0C8] to-[#A8C090]",
  "from-[#E8E4D8] to-[#D0C8B8]",
  "from-[#DCE8D8] to-[#B8D0A8]",
  "from-[#E0E8DC] to-[#C0D4B8]",
];

const titleStyles = cn(
  "text-[28px] font-display leading-[120%] pb-[20px]",
  "border-b-[3px] border-olive-primary",
  "xl:text-[48px]",
);

type Review = {
  id: number;
  text: string;
};

const reviewsData: Review[] = [
  {
    id: 1,
    text: "Я прийшла з відчуттям постійної втоми і внутрішнього вигорання. З кожною зустріччю з'являлось більше легкості — ніби стає трохи більше повітря. Навіть складні речі ми проговорювали дуже м'яко, без болю. Це було схоже на розмову з подругою за кавою, після якої стає тепліше всередині.",
  },
  {
    id: 2,
    text: "Дякую за підтримку та розуміння. Кожна сесія допомагала мені краще зрозуміти себе та свої емоції. Рекомендую всім, хто шукає професійну психологічну допомогу.",
  },
  {
    id: 3,
    text: "Після декількох консультацій я нарешті змогла розібратися зі своїми страхами та тривогою. Дуже вдячна за професійний підхід та теплу атмосферу.",
  },
  {
    id: 4,
    text: "Це була найкраща інвестиція в себе. Завдяки роботі з психологом я навчилася встановлювати кордони та говорити «ні». Моє життя змінилося на краще.",
  },
  {
    id: 5,
    text: "Професійний підхід, комфортна атмосфера та реальні результати. Дуже рада, що знайшла саме цього спеціаліста. Рекомендую всім!",
  },
];

type ReviewCardProps = {
  review: Review;
  index: number;
  scale: number;
  opacity: number;
};

const ReviewCard = ({ review, index, scale, opacity }: ReviewCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const gradientClass = avatarGradients[index % avatarGradients.length];

  return (
    <div
      className={cn(
        "min-w-[280px] max-w-[280px] md:min-w-[320px] md:max-w-[320px]",
        "pt-[24px] pr-[32px] pb-[20px] pl-[40px]",
        "bg-[#F5F6EF] border border-[#E6EAD8] rounded-[4px]",
        "flex flex-col gap-[12px]",
        "shadow-[0px_4px_12px_rgba(0,0,0,0.08)]",
        "transition-all duration-300 ease-out origin-center",
      )}
      style={{
        transform: `scale(${scale})`,
        opacity: opacity,
      }}
    >
      {/* Anonymous avatar + Quote */}
      <div className="flex items-center gap-[12px]">
        {/* Soft gradient avatar with silhouette */}
        <div
          className={cn(
            "w-[44px] h-[44px] rounded-full",
            "bg-gradient-to-br",
            gradientClass,
            "flex items-center justify-center",
            "shadow-sm",
          )}
        >
          <User className="w-5 h-5 text-olive-primary/60" strokeWidth={1.5} />
        </div>
        {/* Quote icon */}
        <span className="text-olive-primary/40 text-[32px] font-serif leading-none ml-auto">
          &ldquo;
        </span>
      </div>

      {/* Review text */}
      <p
        className={cn(
          "text-[14px] text-gray-700 leading-[1.6]",
          !isExpanded && "line-clamp-5",
        )}
      >
        {review.text}
      </p>

      {/* More button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-[14px] text-olive-primary underline hover:no-underline self-start mt-auto"
      >
        {isExpanded ? "Сховати" : "Більше"}
      </button>
    </div>
  );
};

const Reviews = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [cardScales, setCardScales] = useState<number[]>(
    reviewsData.map(() => 1),
  );
  const [cardOpacities, setCardOpacities] = useState<number[]>(
    reviewsData.map(() => 1),
  );

  const calculateScales = useCallback(() => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;

    const cards = container.querySelectorAll("[data-review-card]");
    const newScales: number[] = [];
    const newOpacities: number[] = [];

    cards.forEach((card) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const distanceFromCenter = Math.abs(containerCenter - cardCenter);
      const maxDistance = containerRect.width / 2;

      // Calculate scale: 1 at center, 0.85 at edges
      const normalizedDistance = Math.min(distanceFromCenter / maxDistance, 1);
      const scale = 1 - normalizedDistance * 0.15;

      // Calculate opacity: 1 at center, 0.6 at edges
      const opacity = 1 - normalizedDistance * 0.4;

      newScales.push(Math.max(scale, 0.85));
      newOpacities.push(Math.max(opacity, 0.6));
    });

    setCardScales(newScales);
    setCardOpacities(newOpacities);
  }, []);

  const checkScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
    calculateScales();
  }, [calculateScales]);

  useEffect(() => {
    calculateScales();
    window.addEventListener("resize", calculateScales);
    return () => window.removeEventListener("resize", calculateScales);
  }, [calculateScales]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 352; // card width (320) + gap (32)
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-[60px] xl:py-[100px]">
      <div className="max-w-[1240px] mx-auto px-[32px] lg:px-[60px] xl:px-0">
        {/* Page number */}
        <p className="text-[16px] italic border-b-[2px] border-olive-primary w-fit hidden xl:block ml-auto mb-[40px]">
          01
        </p>

        {/* Title */}
        <h2 className={titleStyles}>
          Найцінніше для мене - <br />
          ВАШІ відгуки
        </h2>

        {/* Carousel container */}
        <div className="relative mt-[40px]">
          {/* Left arrow */}
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={cn(
              "absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10",
              "w-[46px] h-[46px] rounded-full bg-[#E6EAD8]",
              "flex items-center justify-center",
              "hover:bg-[#d9deca] transition-colors",
              "disabled:opacity-30 disabled:cursor-not-allowed",
              "hidden lg:flex",
            )}
            aria-label="Previous reviews"
          >
            <ChevronLeft className="w-5 h-5 text-[#42412D]" strokeWidth={2.5} />
          </button>

          {/* Reviews scroll container */}
          <div
            ref={scrollContainerRef}
            onScroll={checkScroll}
            className="flex gap-[16px] md:gap-[32px] items-center overflow-x-auto scrollbar-hide py-8 -mx-[32px] px-[32px] lg:-mx-[60px] lg:px-[60px] xl:mx-0 xl:px-0"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {reviewsData.map((review, index) => (
              <div key={review.id} data-review-card>
                <ReviewCard
                  review={review}
                  index={index}
                  scale={cardScales[index]}
                  opacity={cardOpacities[index]}
                />
              </div>
            ))}
          </div>

          {/* Right arrow */}
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={cn(
              "absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10",
              "w-[46px] h-[46px] rounded-full bg-[#E6EAD8]",
              "flex items-center justify-center",
              "hover:bg-[#d9deca] transition-colors",
              "disabled:opacity-30 disabled:cursor-not-allowed",
              "hidden lg:flex",
            )}
            aria-label="Next reviews"
          >
            <ChevronRight
              className="w-5 h-5 text-[#42412D]"
              strokeWidth={2.5}
            />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
