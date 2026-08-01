import AuthGuard from "@/components/auth/AuthGuard";
import Navbar from "@/components/navbar/Navbar";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { SidebarProvider } from "@/providers/SidebarProvider";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthGuard>
      <SidebarProvider>
        <section>
          <Navbar />
          <div className="flex">
            <Sidebar />
            <div className="flex-1 h-[calc(100vh-56px)] overflow-y-auto">
              {children}
            </div>
          </div>
        </section>
      </SidebarProvider>
    </AuthGuard>
  );
};

export default DashboardLayout;
