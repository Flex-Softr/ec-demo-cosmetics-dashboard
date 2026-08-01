"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppSelector } from "@/redux/hooks";
import { Loader2 } from "lucide-react";
import dummyUser from "../../../public/user.jpg";

const Dashboard = () => {
  const { profile, isProfileLoading } = useAppSelector((state) => state.auth);

  if (isProfileLoading || !profile) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const profilePicUrl = profile.profilePicture
    ? `${profile.profilePicture}`
    : dummyUser.src;

  return (
    <div className="flex justify-center items-center h-full">
      <div>
        <div className="flex justify-center">
          <Avatar className="rounded-full w-28 h-28">
            <AvatarImage src={profilePicUrl} />
            <AvatarFallback>{profile.fullName}</AvatarFallback>
          </Avatar>
        </div>
        <h2 className="text-center font-semibold text-xl">
          {profile.fullName}
        </h2>
        <h2 className="text-center">{profile.phoneNumber}</h2>
      </div>
    </div>
  );
};

export default Dashboard;
