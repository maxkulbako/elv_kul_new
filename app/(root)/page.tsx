import { Metadata } from "next";
import Hero from "@/app/components/landing/Hero";

export const metadata: Metadata = {
  title: "Home",
};

const HomePage = () => {
  return (
    <div>
      <Hero />
    </div>
  );
};

export default HomePage;
