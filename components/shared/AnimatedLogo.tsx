"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Lato } from "next/font/google";

const lato = Lato({
  weight: "300",
  subsets: ["latin"],
  display: "swap",
});

const AnimatedLogo = () => {
  return (
    <Link href="/" className="flex items-center gap-2">
      {/* Rotating flower */}
      <motion.div
        initial={{ rotate: 0 }}
        whileInView={{ rotate: 360 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <Image
          src="/small_logo.svg"
          alt="logo_flower"
          width={40}
          height={40}
          priority
        />
      </motion.div>
      {/* Static text */}
      <span
        className={`${lato.className} text-white text-[24px] leading-[100%] tracking-[0%]`}
      >
        Elvida
        <br />
        Kulbako
      </span>
    </Link>
  );
};

export default AnimatedLogo;
