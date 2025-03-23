import Image from "next/image";
import CallBackButton from "./CallBackButton";

const Header = () => {
  return (
    <header className="flex items-center justify-between bg-olive-primary px-24 py-7">
      <Image src="/logo.png" alt="main_logo" width={130} height={48} />
      <nav>
        <ul className="flex items-center gap-7.5">
          <li className="text-white cursor-pointer">Про мене</li>
          <li className="text-white cursor-pointer">Запити</li>
          <li className="text-white cursor-pointer">Вартість</li>
          <li className="text-white cursor-pointer">Питання</li>
        </ul>
      </nav>
      <CallBackButton />
    </header>
  );
};

export default Header;
