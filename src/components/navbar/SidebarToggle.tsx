"use client";

import { useSidebar } from "@/providers/SidebarProvider";
import { Menu } from "lucide-react";
import { Button } from "../ui/button";

export default function SidebarToggle() {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="mr-4 bg-white hover:bg-white"
      onClick={toggleSidebar}
    >
      <Menu size={24} />
    </Button>
  );
}
