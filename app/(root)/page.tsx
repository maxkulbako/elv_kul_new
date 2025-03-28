import { Metadata } from "next";
import Hero from "@/app/components/landing/Hero";
import About from "@/app/components/landing/About";
import Themes from "@/app/components/landing/Themes";
import Prices from "@/app/components/landing/Prices";
import Confidence from "@/app/components/landing/Confidence";
import Programs from "@/app/components/landing/Programs";
import FAQ from "@/app/components/landing/FAQ";

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
      <FAQ />
    </div>
  );
};

export default HomePage;
