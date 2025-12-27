"use client";

import { useSidebar } from "@/providers/SidebarProvider";
import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/logo.jpg";

export default function NavbarLogo() {
  const { isCollapsed } = useSidebar();

  if (isCollapsed) return null;

  return (
    <Link href="/dashboard">
      <Image
        className="w-24"
        src={logo}
        alt="Nora Life Style"
        priority={true}
        placeholder="blur"
      />
    </Link>
  );
}
