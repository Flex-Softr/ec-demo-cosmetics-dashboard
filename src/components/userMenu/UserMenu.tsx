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
import { logOut, setUser } from "@/redux/features/auth/authSlice";
import { TUser } from "@/redux/features/auth/interface";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { TErrorResponse } from "@/types/response";
import { TUserProfile } from "@/types/user.interface";
import decodeJWT from "@/utilities/decodeJWT";
import { Key, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
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

const UserMenu = ({
  user,
  accessToken,
}: {
  user: TUserProfile;
  accessToken?: string;
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const { fullName, profilePicture } = user || {};
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);

  const profilePicUrl = profilePicture ? `${profilePicture}` : dummyUser.src;

  // handle logout
  const [logoutUser] = useLogOutMutation();

  const handleLogout = async () => {
    try {
      await logoutUser({}).unwrap();
      dispatch(logOut());
      router.push("/login");
    } catch (error) {
      const err = (error as { data: TErrorResponse }).data;
      toast({
        variant: "destructive",
        title: err?.message,
      });
    }
  };

  useEffect(() => {
    if (token && accessToken && token == accessToken) {
      return;
    } else if (accessToken) {
      const user = decodeJWT(accessToken) as TUser;
      dispatch(setUser({ user: user, token: accessToken }));
    }
  }, [dispatch, token, accessToken]);

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <span>
            <Avatar>
              <AvatarImage src={profilePicUrl} />
              <AvatarFallback>{fullName}</AvatarFallback>
            </Avatar>
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel className="text-center">
            {fullName}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {listItems.map((item, index) => (
              <Link key={index} href={item.href}>
                <DropdownMenuItem className="cursor-pointer">
                  {item.icon}
                  <span>{item.name}</span>
                </DropdownMenuItem>
              </Link>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserMenu;
