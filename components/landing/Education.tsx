"use client";

import { useState, useRef, useCallback, useLayoutEffect } from "react";
import { cn } from "@/lib/utils/utils";
import { X, GraduationCap, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const titleStyles = cn(
  "text-[28px] font-display leading-[120%] pb-[20px]",
  "border-b-[3px] border-olive-primary",
  "xl:text-[48px]",
);

type Certificate = {
  id: number;
  title: string;
  image: string;
  description: string;
};

const certificates: Certificate[] = [
  {
    id: 1,
    title: "Диплом психолога",
    image: "/diploma_Elv.webp",
    description:
      "Тернопільський національний педагогічний університет імені Володимира Гнатюка",
  },
  {
    id: 2,
    title: "Сертифікована программа позитивної психотерапії",
    image: "/diploma_world.webp",
    description:
      "World Association of Positive and Transcultural Psychotherapy",
  },
  {
    id: 3,
    title: "Сертифікат консультанта з позитивної психотерапії",
    image: "/cert_consultant_page.webp",
    description: "Українська асоціація позитивної психотерапії",
  },

  {
    id: 4,
    title: "Сертифікат",
    image: "/cert_1_Elvida.webp",
    description: "Нарцисизм та нарцисичний розлад особистості",
  },
  {
    id: 5,
    title: "Сертифікат",
    image: "/cert_2_Elvida.webp",
    description: "Інтимність",
  },
  {
    id: 6,
    title: "Сертифікат",
    image: "/cert_attendance.webp",
    description: "Форум позитивної психотерапії",
  },
  {
    id: 7,
    title: "Сертифікат УАПП",
    image: "/cert_3_Elv.webp",
    description: "Конференція з позитивної психотерапії",
  },
];

type CertificateCardProps = {
  certificate: Certificate;
  scale: number;
  opacity: number;
  onClick: () => void;
};

const CertificateCard = ({
  certificate,
  scale,
  opacity,
  onClick,
}: CertificateCardProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative cursor-pointer group flex-shrink-0",
        "bg-[#F5F6EF] border-2 border-olive-primary/20",
        "rounded-[4px] overflow-hidden",
        "shadow-[0px_4px_16px_rgba(0,0,0,0.08)]",
        "hover:shadow-[0px_8px_24px_rgba(0,0,0,0.12)]",
        "transition-all duration-300 ease-out origin-center",
        "w-[280px] h-[200px]",
        "md:w-[340px] md:h-[240px]",
        "lg:w-[400px] lg:h-[280px]",
      )}
      style={{
        transform: `scale(${scale})`,
        opacity: opacity,
      }}
    >
      {/* Certificate Image */}
      <div className="relative w-full h-full bg-white">
        <Image
          src={certificate.image}
          alt={certificate.title}
          fill
          className="object-contain"
        />
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-olive-primary/90 via-olive-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-[60px] h-[60px] rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <GraduationCap
                  className="w-[32px] h-[32px] text-white"
                  strokeWidth={1.5}
                />
              </div>
              <span className="text-white text-[14px] font-medium">
                Натисніть для збільшення
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="absolute bottom-0 left-0 right-0 p-[12px] bg-gradient-to-t from-black/80 via-black/60 to-transparent">
        <h3 className="text-[13px] font-semibold text-white mb-[4px] line-clamp-1">
          {certificate.title}
        </h3>
        <p className="text-[11px] text-white/80 line-clamp-1">
          {certificate.description}
        </p>
      </div>
    </div>
  );
};

const Education = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedCertificate, setSelectedCertificate] =
    useState<Certificate | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [cardScales, setCardScales] = useState<number[]>(
    certificates.map(() => 1),
  );
  const [cardOpacities, setCardOpacities] = useState<number[]>(
    certificates.map(() => 1),
  );

  const calculateScales = useCallback(() => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;

    const cards = container.querySelectorAll("[data-certificate-card]");
    const newScales: number[] = [];
    const newOpacities: number[] = [];

    cards.forEach((card) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const distanceFromCenter = Math.abs(containerCenter - cardCenter);
      const maxDistance = containerRect.width / 2;

      // Calculate scale: 1.2 at center, 0.7 at edges (більший контраст)
      const normalizedDistance = Math.min(distanceFromCenter / maxDistance, 1);
      const scale = 1.2 - normalizedDistance * 0.5;

      // Calculate opacity: 1 at center, 0.5 at edges
      const opacity = 1 - normalizedDistance * 0.5;

      newScales.push(Math.max(scale, 0.7));
      newOpacities.push(Math.max(opacity, 0.5));
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

  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- DOM measurements require setState after layout
    calculateScales();
    window.addEventListener("resize", calculateScales);
    return () => window.removeEventListener("resize", calculateScales);
  }, [calculateScales]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      // Адаптивний scrollAmount залежно від розміру екрану
      const isMobile = window.innerWidth < 768;
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

      let scrollAmount = 432; // desktop: card width (400) + gap (32)
      if (isMobile) {
        scrollAmount = 312; // mobile: card width (280) + gap (32)
      } else if (isTablet) {
        scrollAmount = 372; // tablet: card width (340) + gap (32)
      }

      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <section className="py-[60px] xl:py-[100px] bg-white relative overflow-hidden">
        {/* Background Typography */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 hidden lg:block">
          <span className="text-[15vw] font-display text-olive-primary/5 whitespace-nowrap select-none">
            ОСВІТА
          </span>
        </div>

        <div className="max-w-[1240px] mx-auto px-[16px] lg:px-[60px] xl:px-0 relative z-10">
          {/* Page number */}
          <p className="text-[16px] italic border-b-[2px] border-olive-primary w-fit hidden xl:block ml-auto mb-[40px]">
            06
          </p>

          {/* Title and Intro Card */}
          <div className="flex flex-col items-center gap-[20px] mb-[40px]">
            <h2 className={cn(titleStyles, "text-center")}>
              Освіта та сертифікати
            </h2>
            <p className="text-[16px] lg:text-[18px] text-gray-600 text-center max-w-[700px]">
              Моя освіта та професійний розвиток — це фундамент довіри, на якому
              будується наша робота
            </p>
          </div>

          {/* Intro Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={cn(
              "max-w-[800px] mx-auto mb-[40px]",
              "p-[32px] lg:p-[48px]",
              "bg-gradient-to-br from-olive-primary to-[#6B7759]",
              "rounded-[4px]",
              "flex flex-col gap-[24px] items-center",
              "shadow-[0px_6px_20px_rgba(0,0,0,0.15)]",
            )}
          >
            <motion.div
              initial={{ rotate: 0 }}
              whileInView={{ rotate: 360 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            >
              <GraduationCap
                className="w-[60px] h-[60px] text-white"
                strokeWidth={1.5}
              />
            </motion.div>
            <p className="text-[16px] lg:text-[18px] text-white/90 text-center leading-[1.6] font-light">
              Я постійно навчаюся і розвиваюсь професійно, щоб надавати вам
              найкращу психологічну підтримку. Нижче ви можете переглянути мої
              дипломи та сертифікати.
            </p>
          </motion.div>

          {/* Mobile scroll hint */}
          <div className="flex items-center justify-center gap-[8px] text-[14px] text-olive-primary mb-[24px] lg:hidden">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 5l7 7-7 7M5 5l7 7-7 7"
              />
            </svg>
            <span className="font-medium">Гортайте вправо</span>
          </div>

          {/* Carousel container */}
          <div className="relative mt-[40px]">
            {/* Left arrow */}
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={cn(
                "absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10",
                "w-[46px] h-[46px] rounded-full bg-olive-primary",
                "flex items-center justify-center",
                "hover:bg-olive-primary/80 transition-colors",
                "disabled:opacity-30 disabled:cursor-not-allowed",
                "hidden lg:flex",
                "shadow-lg",
              )}
              aria-label="Previous certificates"
            >
              <ChevronLeft className="w-5 h-5 text-white" strokeWidth={2.5} />
            </button>

            {/* Certificates scroll container */}
            <div
              ref={scrollContainerRef}
              onScroll={checkScroll}
              className="flex gap-[32px] items-center overflow-x-auto scrollbar-hide py-12 -mx-[16px] px-[16px] lg:-mx-[60px] lg:px-[60px] xl:mx-0 xl:px-0"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {certificates.map((certificate, index) => (
                <div key={certificate.id} data-certificate-card>
                  <CertificateCard
                    certificate={certificate}
                    scale={cardScales[index] ?? 1}
                    opacity={cardOpacities[index] ?? 1}
                    onClick={() => setSelectedCertificate(certificate)}
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
                "w-[46px] h-[46px] rounded-full bg-olive-primary",
                "flex items-center justify-center",
                "hover:bg-olive-primary/80 transition-colors",
                "disabled:opacity-30 disabled:cursor-not-allowed",
                "hidden lg:flex",
                "shadow-lg",
              )}
              aria-label="Next certificates"
            >
              <ChevronRight className="w-5 h-5 text-white" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </section>

      {/* Modal for enlarged certificate */}
      <AnimatePresence>
        {selectedCertificate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCertificate(null)}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-[16px] lg:p-[40px]"
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedCertificate(null)}
              className={cn(
                "absolute top-[20px] right-[20px] z-10",
                "w-[44px] h-[44px] rounded-full",
                "bg-white/10 backdrop-blur-sm",
                "hover:bg-white/20",
                "flex items-center justify-center",
                "transition-colors",
              )}
              aria-label="Close"
            >
              <X className="w-[24px] h-[24px] text-white" strokeWidth={2} />
            </button>

            {/* Certificate content */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-[1100px] w-full bg-white rounded-[4px] overflow-auto shadow-2xl max-h-[90vh]"
            >
              <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] bg-gradient-to-br from-[#f5f6f0] via-white to-[#f0f2e8]">
                <Image
                  src={selectedCertificate.image}
                  alt={selectedCertificate.title}
                  fill
                  className="object-contain p-2 md:p-4"
                />
              </div>
              <div className="p-[16px] md:p-[24px] lg:p-[32px] border-t-2 border-olive-primary/20 bg-white">
                <h3 className="text-[16px] md:text-[20px] lg:text-[24px] font-display text-gray-900 mb-[8px] md:mb-[12px]">
                  {selectedCertificate.title}
                </h3>
                <p className="text-[13px] md:text-[14px] lg:text-[16px] text-gray-600">
                  {selectedCertificate.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Education;
