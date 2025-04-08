"use client";

import { X, Menu } from "lucide-react";
import { useState } from "react";

const BurgerButton = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <button
      className="md:hidden flex items-center text-olive-dark"
      onClick={() => setIsMenuOpen(!isMenuOpen)}
    >
      {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
  );
};

export default BurgerButton;
