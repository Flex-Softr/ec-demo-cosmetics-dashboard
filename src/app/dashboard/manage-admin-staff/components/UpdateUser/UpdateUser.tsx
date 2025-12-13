import CommonModal from "@/components/modal/CommonModal";
import { TUser } from "@/redux/features/user/userInterface";
import { Dispatch, SetStateAction } from "react";
import UpdateUserForm from "./UpdateUserForm";
const UpdateUser = ({
  editUserModal,
  handleEditUserModal,
  user,
  setEditUserModal,
}: {
  editUserModal: boolean;
  handleEditUserModal: () => void;
  user: TUser;
  setEditUserModal: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <div>
      <CommonModal
        open={editUserModal}
        handleOpen={handleEditUserModal}
        modalTitle="Update user"
        className="min-h-[550px] w-[950px]"
      >
        <UpdateUserForm setEditUserModal={setEditUserModal} user={user} />
      </CommonModal>
    </div>
  );
};

export default UpdateUser;
