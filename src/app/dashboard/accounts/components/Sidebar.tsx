import NavLink from "@/components/NavLink/NavLink";

const Sidebar = () => {
  return (
    <div className="w-[17rem] p-2 h-[calc(100vh-60px)] overflow-y-auto flex flex-col gap-2">
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
