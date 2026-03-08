"use client";
import { useSidebar } from "@/providers/SidebarProvider";
import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/logo.png";

export default function NavbarLogo() {
  const { isCollapsed } = useSidebar();

  if (isCollapsed) return null;

  return (
    <Link href="/dashboard">
      <Image
        className="w-24 h-16 object-contain"
        src={logo}
        alt="Logo"
        priority={true}
        width={100}
        height={100}
      />
    </Link>
  );
}
