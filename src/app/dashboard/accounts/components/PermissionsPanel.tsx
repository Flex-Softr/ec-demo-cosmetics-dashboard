"use client";

import { ShieldCheck } from "lucide-react";

type Permission = {
  _id?: string;
  name: string;
};

type PermissionsPanelProps = {
  permissions: Permission[];
};

function formatPermissionLabel(name: string) {
  return name
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase())
    .trim();
}

const PermissionsPanel = ({ permissions }: PermissionsPanelProps) => {
  return (
    <div className="h-full rounded-xl border border-border bg-card p-5 shadow-none">
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <ShieldCheck className="h-4 w-4 text-primary" />
        </div>
        <div className="flex flex-1 items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-foreground">Permissions</h2>
          <span className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            {permissions.length}
          </span>
        </div>
      </div>

      {permissions.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No permissions assigned.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {permissions.map((permission) => (
            <span
              key={permission._id || permission.name}
              className="inline-flex items-center rounded-full border border-primary/15 bg-primary/5 px-2.5 py-1 text-xs font-medium capitalize text-primary"
            >
              {formatPermissionLabel(permission.name)}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default PermissionsPanel;
