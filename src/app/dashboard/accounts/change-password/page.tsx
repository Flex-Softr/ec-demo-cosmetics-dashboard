"use client";

import { KeyRound } from "lucide-react";
import ChangePasswordPanel from "../components/ChangePasswordPanel";

const ChangePasswordPage = () => {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
          <KeyRound className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-foreground">
            Change password
          </h1>
          <p className="text-xs text-muted-foreground">
            Update your account password securely
          </p>
        </div>
      </div>

      <div className="max-w-md">
        <ChangePasswordPanel />
      </div>
    </div>
  );
};

export default ChangePasswordPage;
