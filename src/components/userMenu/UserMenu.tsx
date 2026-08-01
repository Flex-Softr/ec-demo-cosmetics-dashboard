"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { useLogOutMutation } from "@/redux/features/auth/authApi";
import { logOut } from "@/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { TErrorResponse } from "@/types/response";
import { Key, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dummyUser from "../../../public/user.jpg";

const listItems = [
  {
    name: "Accounts",
    icon: <User className="mr-2 h-4 w-4" />,
    href: "/dashboard/accounts",
  },
  {
    name: "Change password",
    icon: <Key className="mr-2 h-4 w-4" />,
    href: "/dashboard/accounts/change-password",
  },
];

const UserMenu = () => {
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.auth.profile);
  const user = useAppSelector((state) => state.auth.user);

  const fullName = profile?.fullName || "";
  const role = profile?.role || user?.role || "";
  const profilePicUrl = profile?.profilePicture
    ? `${profile.profilePicture}`
    : dummyUser.src;

  const [logoutUser] = useLogOutMutation();

  const handleLogout = async () => {
    try {
      await logoutUser({}).unwrap();
      dispatch(logOut());
      // next/navigation auto-prefixes basePath — do not add /admin again
      router.push("/login");
    } catch (error) {
      const err = (error as { data: TErrorResponse }).data;
      toast({
        variant: "destructive",
        title: err?.message,
      });
    }
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-3 cursor-pointer group select-none outline-none">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors">
                {fullName || "User"}
              </p>
              <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                {String(role).replace("_", " ")}
              </p>
            </div>
            <Avatar className="h-9 w-9 border-2 border-transparent group-hover:border-primary/20 transition-all duration-300 ring-2 ring-gray-50">
              <AvatarImage src={profilePicUrl} className="object-cover" />
              <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                {fullName?.substring(0, 2).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-64 mt-1 p-1 rounded-xl shadow-xl border-gray-100"
          align="end"
        >
          <div className="px-3 py-3 border-b border-gray-50 sm:hidden">
            <p className="text-sm font-bold text-gray-900">{fullName}</p>
            <p className="text-xs text-gray-500">{role}</p>
          </div>
          <DropdownMenuLabel className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 py-2">
            User Account
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-gray-50" />
          <DropdownMenuGroup className="py-1">
            {listItems.map((item, index) => (
              <Link key={index} href={item.href}>
                <DropdownMenuItem className="cursor-pointer py-2.5 px-3 rounded-lg focus:bg-primary/5 focus:text-primary group transition-all duration-200">
                  <span className="text-gray-400 group-focus:text-primary transition-colors">
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.name}</span>
                </DropdownMenuItem>
              </Link>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator className="bg-gray-50" />
          <DropdownMenuItem
            onClick={handleLogout}
            className="cursor-pointer py-2.5 px-3 rounded-lg focus:bg-red-50 focus:text-red-600 transition-all duration-200 mt-1"
          >
            <LogOut className="mr-2 h-4 w-4 text-gray-400 group-focus:text-red-500" />
            <span className="font-medium">Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserMenu;
