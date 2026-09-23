import { cn } from "@/lib/utils/utils";
import CallBackButton from "../shared/CallBackButton";
import ContactModal from "../shared/ContactModal";
import PriceCard from "./PriceCard";

const containerStyles = cn(
  "max-w-[1240px] mx-auto flex flex-col items-center justify-center gap-[60px]",
  "px-[16px] py-[60px]",
  "lg:px-[60px]",
  "xl:py-[100px] xl:px-0",
);

const titleStyles = cn(
  "text-[28px] font-display text-center leading-[120%] tracking-[0%] pb-[20px]",
  "border-b-[3px] border-olive-primary",
  "xl:text-[48px]",
);

// Base price for one session — all savings are calculated from it
const BASE_UAH = 1800;
const BASE_EUR = 35;

const savingsNote = (
  consultations: number,
  priceUah: number,
  validity: string,
) => {
  const savedUah = BASE_UAH * consultations - priceUah;
  return `Економія ${savedUah} грн. Використати протягом ${validity}`;
};

const plans = [
  {
    consultations: 1,
    priceUah: BASE_UAH,
    priceEur: BASE_EUR,
    duration: "50 хвилин",
    motion: {
      initial: { opacity: 0, translateX: -100 },
      whileInView: { opacity: 1, translateX: 0 },
      transition: { duration: 0.5 },
    },
  },
  {
    consultations: 3,
    priceUah: 4900, // 1633 per session
    priceEur: 95,
    validity: "2 місяців",
    isHighlighted: true,
    motion: {
      initial: { scale: 0.8 },
      whileInView: { scale: 1 },
      transition: { duration: 0.5, delay: 0.5 },
    },
  },
  {
    consultations: 5,
    priceUah: 7800, // 1560 per session
    priceEur: 150,
    validity: "3 місяців",
    motion: {
      initial: { opacity: 0, translateX: 100 },
      whileInView: { opacity: 1, translateX: 0 },
      transition: { duration: 0.5 },
    },
  },
];

const Prices = () => {
  return (
    <section>
      <div className={containerStyles}>
        {/* Page number */}
        <p className="text-[16px] italic border-b-[2px] border-olive-primary w-fit hidden xl:block self-end">
          06
        </p>
        <h2 className={titleStyles}>Тарифи</h2>
        <div className="w-full overflow-x-hidden">
          <div className="flex flex-col items-center justify-between w-full gap-[30px] lg:flex-row">
            {plans.map(({ motion, validity, ...plan }) => (
              <PriceCard
                key={plan.consultations}
                {...plan}
                note={
                  validity
                    ? savingsNote(plan.consultations, plan.priceUah, validity)
                    : undefined
                }
                {...motion}
              />
            ))}
          </div>
        </div>
        <ContactModal>
          <CallBackButton text="Звʼязатися" />
        </ContactModal>
      </div>
    </section>
  );
};

export default Prices;
