import Navbar from "@/components/navbar/Navbar";
// import ScrollRestoration from "@/components/ScrollRestoration";
import { Sidebar } from "@/components/sidebar/Sidebar";
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section>
      <Navbar></Navbar>
      <div className="flex">
        <Sidebar></Sidebar>
        <div className="w-full h-[calc(100vh-60px)] overflow-y-auto">
          {children}
        </div>
        {/* <ScrollRestoration>{children}</ScrollRestoration> */}
      </div>
    </section>
  );
};

export default DashboardLayout;
