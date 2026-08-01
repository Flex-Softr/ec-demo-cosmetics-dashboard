"use client";

import { useSidebar } from "@/providers/SidebarProvider";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "../ui/button";

export default function SidebarToggle() {
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9 shrink-0 rounded-lg text-foreground/80 hover:bg-muted hover:text-foreground"
      onClick={toggleSidebar}
      aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
      {isCollapsed ? (
        <PanelLeftOpen className="h-5 w-5" strokeWidth={2} />
      ) : (
        <PanelLeftClose className="h-5 w-5" strokeWidth={2} />
      )}
    </Button>
  );
}
