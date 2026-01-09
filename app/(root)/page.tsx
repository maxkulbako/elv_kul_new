import { Metadata } from "next";
import Hero from "@/components/landing/Hero";
import About from "@/components/landing/About";
import Themes from "@/components/landing/Themes";
import Prices from "@/components/landing/Prices";
import Confidence from "@/components/landing/Confidence";
import Programs from "@/components/landing/Programs";
import Reviews from "@/components/landing/Reviews";
import FAQ from "@/components/landing/FAQ";
import Additional from "@/components/landing/Additional";

export const metadata: Metadata = {
  title: "Home",
};

const HomePage = () => {
  return (
    <div>
      <Hero />
      <About />
      <Themes />
      <Prices />
      <Confidence />
      <Programs />
      <Reviews />
      <FAQ />
      <Additional />
    </div>
  );
};

export default HomePage;
