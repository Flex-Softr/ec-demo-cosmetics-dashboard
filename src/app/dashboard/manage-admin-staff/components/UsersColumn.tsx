import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import config from "@/config/config";
import { TUser } from "@/redux/features/user/userInterface";
import backgroundColor from "@/utilities/backgroundColor";
import { ColumnDef } from "@tanstack/react-table";
import { Mail, PhoneCall } from "lucide-react";
import dummyUser from "../../../../../public/icons/user.jpg";
import Action from "./Action/Action";

const columns: ColumnDef<TUser>[] = [
  {
    accessorKey: "",
    header: "SL",
    cell: ({ row }) => (
      <div className="capitalize flex flex-col justify-center items-center">
        <span className="">{row?.index + 1}</span>
      </div>
    ),
  },
  {
    accessorKey: "profilePicture",
    header: "Image",
    cell: ({ row }) => {
      const profileUrl = row.original.profilePicture
        ? `${config.base_url}/${row.original.profilePicture}`
        : dummyUser.src;
      return (
        <div className="flex justify-center">
          <Avatar>
            <AvatarImage src={profileUrl} />
            <AvatarFallback>{row.original.fullName}</AvatarFallback>
          </Avatar>
        </div>
      );
    },
  },
  {
    accessorKey: "uid",
    header: "UID",
    cell: ({ row }) => <p>{row.original.uid}</p>,
  },
  {
    accessorKey: "fullName",
    header: "Name",
    cell: ({ row }) => <p>{row.original.fullName}</p>,
  },
  {
    accessorKey: "phoneNumber",
    header: "Contact",
    cell: ({ row }) => {
      const { phoneNumber, email } = row.original;
      return (
        <div className="space-y-1 flex flex-col items-center">
          {phoneNumber ? (
            <a href={`tel:${phoneNumber}`} className="flex gap-2 items-center">
              <Mail size={16} /> {phoneNumber}
            </a>
          ) : null}
          {email ? (
            <a href={`mailto:${email}`} className="flex gap-2 items-center">
              <PhoneCall size={16} />
              {email}
            </a>
          ) : null}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div>
        <p
          className={`capitalize px-2 pb-[2px] pt-[1px] rounded text-white ${backgroundColor(row.original.status)} capitalize inline-block select-none`}
        >
          {row.original.status}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <p
        className={`capitalize px-2 pb-[2px] pt-[1px] rounded text-white ${backgroundColor(row.original.role)} capitalize inline-block select-none`}
      >
        {row.original.role}
      </p>
    ),
  },
  {
    accessorKey: "",
    header: "action",
    cell: ({ row }) => <Action user={row.original} />,
  },
];

export default columns;
