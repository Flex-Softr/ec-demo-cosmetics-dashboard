"use client";
import CommonModal from "@/components/modal/CommonModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import StaffForm from "../StaffForm";
const CreateUser = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const handleModal = () => {
    setModalOpen((state) => !state);
  };

  return (
    <div>
      <Button onClick={handleModal} size="sm" className="rounded-lg gap-1.5">
        <Plus className="h-4 w-4" />
        <span className="hidden sm:inline">New Employee</span>
      </Button>
      <CommonModal
        open={modalOpen}
        handleOpen={handleModal}
        modalTitle="Create user"
        className="min-h-[550px] w-[95vw] max-w-[950px]"
      >
        <StaffForm setModalOpen={setModalOpen} />
      </CommonModal>
    </div>
  );
};

export default CreateUser;
