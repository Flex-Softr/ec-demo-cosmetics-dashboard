"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone, ShieldCheck, UserCircle } from "lucide-react";
import dummyUser from "../../../../../public/user.jpg";

type ProfileHeroProps = {
  fullName?: string;
  role?: string;
  email?: string;
  phoneNumber?: string;
  profilePicture?: string | null;
  uid?: string;
};

function getInitials(name?: string) {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatRoleLabel(role?: string) {
  if (!role) return "";
  return role
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1")
    .trim();
}

const ProfileHero = ({
  fullName,
  role,
  email,
  phoneNumber,
  profilePicture,
  uid,
}: ProfileHeroProps) => {
  const initials = getInitials(fullName);
  const imageUrl = profilePicture ? `${profilePicture}` : dummyUser.src;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-none">
      <div className="h-1.5 w-full bg-gradient-to-r from-primary via-primary/60 to-transparent" />
      <div className="flex flex-col items-start gap-5 p-6 sm:flex-row sm:items-center">
        <div className="relative shrink-0">
          <Avatar className="h-20 w-20 rounded-2xl border-2 border-primary/20">
            <AvatarImage src={imageUrl} className="rounded-2xl object-cover" />
            <AvatarFallback className="rounded-2xl bg-primary/10 text-2xl font-bold tracking-tight text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-card bg-green-500" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2.5">
            <h2 className="truncate text-xl font-bold text-foreground">
              {fullName || "—"}
            </h2>
            {role ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-medium capitalize text-primary">
                <ShieldCheck className="h-3 w-3" />
                {formatRoleLabel(role)}
              </span>
            ) : null}
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {email ? (
              <span className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 shrink-0" />
                {email}
              </span>
            ) : null}
            {phoneNumber ? (
              <span className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 shrink-0" />
                {phoneNumber}
              </span>
            ) : null}
            {uid ? (
              <span className="flex items-center gap-1.5 text-xs">
                UID: {uid}
              </span>
            ) : null}
          </div>
        </div>

        <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-border bg-muted lg:flex">
          <UserCircle className="h-7 w-7 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
};

export default ProfileHero;
