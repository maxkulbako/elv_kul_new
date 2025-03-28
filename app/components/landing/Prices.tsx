import { cn } from "@/lib/utils";
import CallBackButton from "../shared/CallBackButton";
import PriceCard from "./PriceCard";

const containerStyles = cn(
  "max-w-[1240px] mx-auto flex flex-col items-center justify-center gap-[60px]",
  "px-[32px] py-[60px]",
  "lg:px-[60px]",
  "xl:py-[100px]"
);

const titleStyles = cn(
  "text-[28px] font-display text-center leading-[120%] tracking-[0%]] pb-[20px]",
  "border-b-[3px] border-olive-primary",
  "xl:text-[48px]"
);

const Prices = () => {
  return (
    <section>
      <div className={containerStyles}>
        <h2 className={titleStyles}>Тарифи</h2>
        <div className="flex flex-col items-center justify-between w-full gap-[30px] lg:flex-row">
          <PriceCard
            price={500}
            consultation="1"
            initial={{ opacity: 0, x: -500 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          />
          <PriceCard
            price={2500}
            consultation="5 + 1"
            giftNumber={1}
            isRecommended
            isHighlighted
            initial={{ scale: 0.8 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          />
          <PriceCard
            price={5000}
            consultation="10 + 2"
            giftNumber={2}
            initial={{ opacity: 0, x: 500 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <CallBackButton text="Звʼязатися" />
      </div>
    </section>
  );
};

export default Prices;
