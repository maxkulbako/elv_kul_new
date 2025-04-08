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
import { Calendar, Settings, LogOut, User, UserIcon } from "lucide-react";
import CallBackButton from "@/app/components/shared/CallBackButton";
import { signOutUser } from "@/lib/actions/user.action";

const Navbar = async () => {
  const session = await auth();

  if (!session) {
    return (
      <Button asChild>
        <Link href="/sign-in">
          <UserIcon className="w-4 h-4" /> Клієнтський портал
        </Link>
      </Button>
    );
  }

  return (
    <div className="flex gap-2 item-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>{session.user?.name}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-white" align="end" forceMount>
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
            <Link href="/profile" className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              <span className="font-semibold">Профіль</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/appointments" className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              <span className="font-semibold">Записи</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/settings" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              <span className="font-semibold">Налаштування</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <form action={signOutUser}>
              <Button type="submit" className="flex items-center">
                <LogOut className="mr-2 h-4 w-4" />
                <span className="font-semibold">Вийти</span>
              </Button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Navbar;
