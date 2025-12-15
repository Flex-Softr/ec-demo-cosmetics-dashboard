import Navbar from "@/components/navbar/Navbar";
// import ScrollRestoration from "@/components/ScrollRestoration";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { SidebarProvider } from "@/providers/SidebarProvider";
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <section>
        <Navbar></Navbar>
        <div className="flex">
          <Sidebar></Sidebar>
          <div className="flex-1 h-[calc(100vh-60px)] overflow-y-auto">
            {children}
          </div>
          {/* <ScrollRestoration>{children}</ScrollRestoration> */}
        </div>
      </section>
    </SidebarProvider>
  );
};

export default DashboardLayout;
