import Link from "next/link";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Calendar,
  Settings,
  LogOut,
  User,
  UserIcon,
  CalendarIcon,
} from "lucide-react";
import CallBackButton from "@/components/shared/CallBackButton";
import { signOutUser } from "@/lib/actions/user.action";
import MobileNav from "@/components/shared/MobileNavbar";

const Navbar = async () => {
  const session = await auth();

  if (!session) {
    return (
      <Link href="/sign-in">
        <CallBackButton text="Клієнтський портал"></CallBackButton>
      </Link>
    );
  }

  return (
    <>
      {/* Navbar for desktop */}
      <div className="hidden md:block">
        <nav className="flex gap-6 item-center">
          <Link href="/dashboard" className="hidden md:block">
            <Button className="bg-olive-light text-olive-primary hover:bg-olive-primary hover:text-white">
              <UserIcon className="w-4 h-4" />
              <span className="font-semibold text-[16px] ">Головна</span>
            </Button>
          </Link>
          <Link href="/appointments" className="hidden md:block">
            <Button className="bg-olive-light text-olive-primary hover:bg-olive-primary hover:text-white">
              <CalendarIcon className="w-4 h-4" />
              <span className="font-semibold text-[16px] ">Записи</span>
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>{session.user?.name}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 bg-white"
              align="end"
              forceMount
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {session.user?.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {session.user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link
                  href="/profile"
                  className="flex items-center text-olive-primary hover:bg-olive-light p-2 rounded-md"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span className="font-semibold text-[16px] ">Профіль</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  href="/appointments"
                  className="flex items-center text-olive-primary hover:bg-olive-light p-2 rounded-md"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  <span className="font-semibold text-[16px] ">Записи</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  href="/settings"
                  className="flex items-center text-olive-primary hover:bg-olive-light p-2 rounded-md"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span className="font-semibold text-[16px] ">
                    Налаштування
                  </span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <form action={signOutUser} className="w-full">
                  <Button
                    variant="outline"
                    type="submit"
                    className="flex items-center w-full"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span className="font-semibold text-[16px] ">Вийти</span>
                  </Button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>

      {/* Navbar for mobile */}
      <MobileNav session={session} />
    </>
  );
};

export default Navbar;
