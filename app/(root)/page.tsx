import { Metadata } from "next";
import Hero from "@/app/components/landing/Hero";
import About from "@/app/components/landing/About";
import Themes from "@/app/components/landing/Themes";
import Prices from "@/app/components/landing/Prices";
import Confidence from "@/app/components/landing/Confidence";

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
    </div>
  );
};

export default HomePage;
