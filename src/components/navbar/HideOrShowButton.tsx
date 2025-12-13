"use client";
import { setShowNav } from "@/redux/features/pagination/PaginationSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { AlignLeft } from "lucide-react";
const HideOrShowButton = () => {
  const dispatch = useAppDispatch();
  const showNav = useAppSelector(({ pagination }) => pagination.showNav);

  return (
    <>
      <button
        onClick={() => dispatch(setShowNav(!showNav))}
        className="cursor-pointer"
        title="Hide or show sidebar"
      >
        <AlignLeft className="w-8 h-8" />
      </button>
    </>
  );
};

export default HideOrShowButton;
