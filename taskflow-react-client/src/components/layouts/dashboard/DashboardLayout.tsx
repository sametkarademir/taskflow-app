import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { SidebarProvider } from "../../../contexts/sidebarContext";

export const DashboardLayout = () => {
  return (
    <SidebarProvider>
      <div className="h-screen overflow-hidden flex bg-zinc-950 text-zinc-200">
        <Sidebar />
        <main className="flex-1 flex flex-col h-full overflow-hidden bg-zinc-950">
          <Header />
          <div className="flex-1 overflow-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

