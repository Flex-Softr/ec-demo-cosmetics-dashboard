"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { useAppSelector } from "@/redux/hooks";
import { Loader2 } from "lucide-react";
import dummyUser from "../../../../public/user.jpg";

const AccountsPage = () => {
  const { profile, isProfileLoading } = useAppSelector((state) => state.auth);

  if (isProfileLoading || !profile) {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const profilePicUrl = profile.profilePicture
    ? `${profile.profilePicture}`
    : dummyUser.src;

  return (
    <div className="flex-1 space-y-6">
      <Card>
        <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start text-center sm:text-left">
          <div>
            <Avatar className="rounded-full w-20 h-20">
              <AvatarImage src={profilePicUrl} />
              <AvatarFallback>{profile.fullName}</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-xl">{profile.fullName}</p>
            <p className="capitalize text-gray-500">{profile.role}</p>
            <p className="capitalize text-gray-500">{profile.uid}</p>
          </div>
        </div>
      </Card>
      <Card>
        <h2 className="font-semibold text-lg">Personal information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 mt-5 gap-4">
          <div>
            <p className="text-gray-500">Full name:</p>
            <p className="text-gray-600 font-semibold capitalize">
              {profile.fullName}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Mobile:</p>
            <p className="text-gray-600 font-semibold">{profile.phoneNumber}</p>
          </div>
          <div>
            <p className="text-gray-500">Email:</p>
            <p className="text-gray-600 font-semibold">{profile.email}</p>
          </div>
          <div>
            <p className="text-gray-500">Birth certificate No:</p>
            <p className="text-gray-600 font-semibold">
              {profile.birthCertificateNo || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-500">NID:</p>
            <p className="text-gray-600 font-semibold">
              {profile.NIDNo || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Emergency contact:</p>
            <p className="text-gray-600 font-semibold">
              {profile.emergencyContact || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Joining Date:</p>
            <p className="text-gray-600 font-semibold">{profile.joiningDate}</p>
          </div>
          <div>
            <p className="text-gray-500">Full address:</p>
            <p className="text-gray-600 font-semibold">
              {profile.address?.fullAddress || "N/A"}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AccountsPage;
