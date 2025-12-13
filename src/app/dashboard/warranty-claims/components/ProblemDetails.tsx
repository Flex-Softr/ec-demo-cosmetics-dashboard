"use client";
import CommonModal from "@/components/modal/CommonModal";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const ProblemDetails = ({ problemDetails }: { problemDetails: string }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen((prev) => !prev);
  };
  return (
    <div>
      <Button
        onClick={handleOpen}
        className="bg-inherit text-inherit hover:bg-inherit"
      >
        View details
      </Button>
      <CommonModal
        open={open}
        handleOpen={handleOpen}
        className="h-[80vh] w-11/12"
        modalTitle="Problem details"
      >
        <p>{problemDetails}</p>
      </CommonModal>
    </div>
  );
};

export default ProblemDetails;
