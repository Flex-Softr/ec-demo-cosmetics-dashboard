import NavLink from "@/components/NavLink/NavLink";

const Sidebar = () => {
  return (
    <div className="w-full md:w-[17rem] p-2 md:h-[calc(100vh-60px)] flex flex-col gap-2 overflow-y-auto">
      <NavLink
        href="/dashboard/accounts"
        name="My profile"
        activeClassName="bg-gray-100"
      />
      <NavLink
        href="/dashboard/accounts/change-password"
        name="Change password"
        activeClassName="bg-gray-100"
      />
    </div>
  );
};

export default Sidebar;
