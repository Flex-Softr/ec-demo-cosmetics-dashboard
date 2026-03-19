import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getProfile } from "@/lib/getAccessToken";
import { Metadata } from "next";
import dummyUser from "../../../public/user.jpg";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Nora Life Style",
};

const Dashboard = async () => {
  const user = await getProfile();
  const profilePicUrl = user?.profilePicture
    ? `${user?.profilePicture}`
    : dummyUser.src;
  return (
    <div className="flex justify-center items-center h-full">
      <div>
        <div className="flex justify-center">
          <Avatar className="rounded-full w-28 h-28">
            <AvatarImage src={profilePicUrl} />
            <AvatarFallback>{user?.fullName}</AvatarFallback>
          </Avatar>
        </div>
        <h2 className="text-center font-semibold text-xl">{user.fullName}</h2>
        <h2 className="text-center">{user.phoneNumber}</h2>
      </div>
    </div>
  );
};

export default Dashboard;
