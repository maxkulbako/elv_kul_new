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
  "text-[28px] font-display text-center leading-[120%] tracking-[0%]] pb-[20px]",
  "border-b-[3px] border-olive-primary",
  "xl:text-[48px]",
);

const Prices = () => {
  return (
    <section>
      <div className={containerStyles}>
        {/* Page number */}
        <p className="text-[16px] italic border-b-[2px] border-olive-primary w-fit hidden xl:block self-end">
          04
        </p>
        <h2 className={titleStyles}>Тарифи</h2>
        <div className="w-full overflow-x-hidden">
          <div className="flex flex-col items-center justify-between w-full gap-[30px] lg:flex-row">
            <PriceCard
              priceEur={30}
              priceUah={1500}
              consultations={1}
              duration="50 хвилин"
              initial={{ opacity: 0, translateX: -100 }}
              whileInView={{ opacity: 1, translateX: 0 }}
              transition={{ duration: 0.5 }}
            />
            <PriceCard
              priceEur={75}
              priceUah={3750}
              consultations={3}
              note="використати протягом 2 місяців"
              isHighlighted
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            />
            <PriceCard
              priceEur={110}
              priceUah={5500}
              consultations={5}
              note="використати протягом 3 місяців"
              initial={{ opacity: 0, translateX: 100 }}
              whileInView={{ opacity: 1, translateX: 0 }}
              transition={{ duration: 0.5 }}
            />
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
