"use client";

import {
  CalendarDays,
  CreditCard,
  MapPin,
  PhoneCall,
  ScrollText,
  UserRound,
} from "lucide-react";

type PersonalInfoPanelProps = {
  fullName?: string;
  emergencyContact?: string | null;
  NIDNo?: string | null;
  birthCertificateNo?: string | null;
  joiningDate?: string | null;
  fullAddress?: string | null;
};

type InfoTileProps = {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
};

const InfoTile = ({ icon, label, value }: InfoTileProps) => (
  <div className="rounded-lg border border-border bg-muted/40 p-3">
    <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
      {icon}
      {label}
    </div>
    <p className="truncate text-sm font-medium text-foreground">
      {value || "N/A"}
    </p>
  </div>
);

const PersonalInfoPanel = ({
  fullName,
  emergencyContact,
  NIDNo,
  birthCertificateNo,
  joiningDate,
  fullAddress,
}: PersonalInfoPanelProps) => {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-none">
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <UserRound className="h-4 w-4 text-primary" />
        </div>
        <h2 className="text-sm font-semibold text-foreground">
          Personal information
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <InfoTile
          icon={<UserRound className="h-3 w-3" />}
          label="Full name"
          value={fullName}
        />
        <InfoTile
          icon={<PhoneCall className="h-3 w-3" />}
          label="Emergency contact"
          value={emergencyContact}
        />
        <InfoTile
          icon={<CreditCard className="h-3 w-3" />}
          label="NID"
          value={NIDNo}
        />
        <InfoTile
          icon={<ScrollText className="h-3 w-3" />}
          label="Birth certificate"
          value={birthCertificateNo}
        />
        <InfoTile
          icon={<CalendarDays className="h-3 w-3" />}
          label="Joining date"
          value={joiningDate}
        />
        <InfoTile
          icon={<MapPin className="h-3 w-3" />}
          label="Address"
          value={fullAddress}
        />
      </div>
    </div>
  );
};

export default PersonalInfoPanel;
