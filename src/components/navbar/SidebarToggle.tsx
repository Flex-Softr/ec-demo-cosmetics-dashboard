"use client";
import { useAppSelector } from "@/redux/hooks";
import { Sidebar } from "@/components/sidebar/Sidebar";

const SidebarToggle = () => {
  const showNav = useAppSelector(({ pagination }) => pagination.showNav);
  return <>{showNav ? <Sidebar /> : null}</>;
};

export default SidebarToggle;
