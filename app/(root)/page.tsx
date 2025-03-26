import { Metadata } from "next";
import Hero from "@/app/components/landing/Hero";
import About from "@/app/components/landing/About";
export const metadata: Metadata = {
  title: "Home",
};

const HomePage = () => {
  return (
    <div>
      <Hero />
      <About />
    </div>
  );
};

export default HomePage;
