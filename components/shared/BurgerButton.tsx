import { cn } from "@/lib/utils";

const burgerButtonStyles = cn(
  "w-[25px] h-[22px]",
  "xl:hidden cursor-pointer z-100 relative"
);

const burgerLineStyles = (
  isOpen: boolean,
  position: "top" | "middle" | "bottom"
) =>
  cn(
    "absolute left-0 w-full h-0.5 bg-white transition-all ease-in",
    position === "top" && [
      "top-0",
      "duration-300",
      isOpen && "rotate-45 translate-y-2",
    ],
    position === "middle" && ["top-1/2", isOpen && "opacity-0"],
    position === "bottom" && [
      "top-full",
      "duration-300",
      isOpen && "-translate-y-3.5 -rotate-45",
    ]
  );

const BurgerButton = ({
  isOpen,
  toggleMenu,
}: {
  isOpen: boolean;
  toggleMenu: () => void;
}) => {
  return (
    <button className={burgerButtonStyles} onClick={toggleMenu}>
      <span className={burgerLineStyles(isOpen, "top")} />
      <span className={burgerLineStyles(isOpen, "middle")} />
      <span className={burgerLineStyles(isOpen, "bottom")} />
    </button>
  );
};

export default BurgerButton;
