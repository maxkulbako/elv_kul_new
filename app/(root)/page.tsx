import { Metadata } from "next";
import Hero from "@/app/components/landing/Hero";
import About from "@/app/components/landing/About";
import Themes from "@/app/components/landing/Themes";
export const metadata: Metadata = {
  title: "Home",
};

const HomePage = () => {
  return (
    <div>
      <Hero />
      <About />
      <Themes />
    </div>
  );
};

export default HomePage;
