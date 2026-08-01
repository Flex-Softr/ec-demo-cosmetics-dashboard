"use client";

import { useAppSelector } from "@/redux/hooks";
import { Loader2, UserRound } from "lucide-react";
import ChangePasswordPanel from "./components/ChangePasswordPanel";
import PermissionsPanel from "./components/PermissionsPanel";
import PersonalInfoPanel from "./components/PersonalInfoPanel";
import ProfileHero from "./components/ProfileHero";

const AccountsPage = () => {
  const { profile, user, isProfileLoading } = useAppSelector(
    (state) => state.auth
  );

  if (isProfileLoading || !profile) {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const permissions = profile.permissions?.length
    ? profile.permissions
    : user?.permissions || [];

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
          <UserRound className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-foreground">My profile</h1>
          <p className="text-xs text-muted-foreground">
            Account details, password, and assigned permissions
          </p>
        </div>
      </div>

      <ProfileHero
        fullName={profile.fullName}
        role={profile.role}
        email={profile.email}
        phoneNumber={profile.phoneNumber}
        profilePicture={profile.profilePicture}
        uid={profile.uid}
      />

      <PersonalInfoPanel
        fullName={profile.fullName}
        emergencyContact={profile.emergencyContact}
        NIDNo={profile.NIDNo}
        birthCertificateNo={profile.birthCertificateNo}
        joiningDate={profile.joiningDate}
        fullAddress={profile.address?.fullAddress}
      />

      <div className="grid gap-5 md:grid-cols-5">
        <div className="md:col-span-2">
          <ChangePasswordPanel />
        </div>
        <div className="md:col-span-3">
          <PermissionsPanel permissions={permissions} />
        </div>
      </div>
    </div>
  );
};

export default AccountsPage;
