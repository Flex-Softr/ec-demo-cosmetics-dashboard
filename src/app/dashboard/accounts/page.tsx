import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import config from "@/config/config";
import { getProfile } from "@/lib/getAccessToken";
import dummyUser from "../../../../public/icons/user.jpg";

const AccountsPage = async () => {
  const user = await getProfile();
  const profilePicUrl = user?.profilePicture
    ? `${config.base_url}/${user?.profilePicture}`
    : dummyUser.src;
  return (
    <div className="flex-1 space-y-7">
      <Card className="p-4 shadow-none rounded-xl">
        <div className="flex gap-5">
          <div>
            <Avatar className="rounded-full w-20 h-20">
              <AvatarImage src={profilePicUrl} />
              <AvatarFallback>{user?.fullName}</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-xl">{user?.fullName}</p>
            <p className="capitalize text-gray-500">{user?.role}</p>
            <p className="capitalize text-gray-500">{user?.uid}</p>
          </div>
        </div>
      </Card>
      <Card className="p-4 shadow-none rounded-xl">
        <h2 className="font-semibold text-lg">Personal information</h2>
        <div className="grid grid-cols-2 mt-5 gap-3">
          <div>
            <p className="text-gray-500">Full name:</p>
            <p className="text-gray-600 font-semibold capitalize">
              {user?.fullName}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Mobile:</p>
            <p className="text-gray-600 font-semibold">{user?.phoneNumber}</p>
          </div>
          <div>
            <p className="text-gray-500">Email:</p>
            <p className="text-gray-600 font-semibold">{user?.email}</p>
          </div>
          <div>
            <p className="text-gray-500">Birth certificate No:</p>
            <p className="text-gray-600 font-semibold">
              {user?.birthCertificateNo || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-500">NID:</p>
            <p className="text-gray-600 font-semibold">
              {user?.NIDNo || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Emergency contact:</p>
            <p className="text-gray-600 font-semibold">
              {user?.emergencyContact || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Joining Date:</p>
            <p className="text-gray-600 font-semibold">{user?.joiningDate}</p>
          </div>
          <div>
            <p className="text-gray-500">Full address:</p>
            <p className="text-gray-600 font-semibold">
              {user?.address?.fullAddress || "N/A"}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AccountsPage;
