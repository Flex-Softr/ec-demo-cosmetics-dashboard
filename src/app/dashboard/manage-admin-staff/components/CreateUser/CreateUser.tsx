"use client";
import CommonModal from "@/components/modal/CommonModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import UserDataForm from "./UserDataForm";
const CreateUser = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const handleModal = () => {
    setModalOpen((state) => !state);
  };

  return (
    <div>
      <Button onClick={handleModal} className="rounded-2xl">
        <Plus /> Create user
      </Button>
      <CommonModal
        open={modalOpen}
        handleOpen={handleModal}
        modalTitle="Create user"
        className="min-h-[550px] w-[950px]"
      >
        <UserDataForm setModalOpen={setModalOpen} />
      </CommonModal>
    </div>
  );
};

export default CreateUser;
