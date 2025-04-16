import { signOutUser } from "@/lib/actions/user.action";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { LogOut, HomeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Session } from "next-auth";

const AdminNavBar = ({ session }: { session: Session }) => {
  return (
    <div className="hidden lg:block">
      <nav className="flex gap-6 item-center">
        <Link href="/admin/dashboard" className="hidden md:block">
          <Button className="bg-olive-light text-olive-primary hover:bg-olive-primary hover:text-white">
            <HomeIcon className="w-4 h-4" />
            <span className="font-semibold text-[16px] ">Головна</span>
          </Button>
        </Link>
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
  );
};

export default AdminNavBar;
