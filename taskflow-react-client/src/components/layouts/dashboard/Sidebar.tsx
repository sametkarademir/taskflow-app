import { Link, useLocation } from "react-router-dom";
import { clsx } from "clsx";
import {
  LayoutDashboard,
  CheckSquare,
  Database,
  X,
  Shield,
  Users,
  Folder,
} from "lucide-react";
import { useSidebar } from "../../../contexts/sidebarContext";
import { useUser } from "../../../contexts/userContext";
import { useLocale } from "../../../features/common/hooks/useLocale";
import { UserProfileDropdown } from "./UserProfileDropdown";

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  labelKey: string;
  path: string;
  requiredRole?: string;
}

const allNavItems: NavItem[] = [
  { icon: LayoutDashboard, labelKey: "home", path: "/" },
  { icon: CheckSquare, labelKey: "tasks", path: "/tasks" },
  { icon: Folder, labelKey: "categories", path: "/categories" },
  { icon: Users, labelKey: "users", path: "/users", requiredRole: "Admin" },
  { icon: Shield, labelKey: "roles", path: "/roles", requiredRole: "Admin" }
];

export const Sidebar = () => {
  const location = useLocation();
  const { isMobile, isMobileOpen, toggleMobileSidebar } = useSidebar();
  const { t } = useLocale();
  const { hasRole } = useUser();

  const navItems = allNavItems.filter((item) => {
    if (!item.requiredRole) return true;
    return hasRole(item.requiredRole);
  });

  const handleLinkClick = () => {
    if (isMobile) {
      toggleMobileSidebar();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          "bg-zinc-900 border-r border-zinc-800 flex flex-col justify-between h-full transition-transform duration-300 ease-in-out",
          "fixed md:static z-50",
          isMobile
            ? clsx(
                "w-64 transform",
                isMobileOpen ? "translate-x-0" : "-translate-x-full"
              )
            : "w-64 flex-shrink-0"
        )}
      >
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-lg bg-[#6366f1] flex items-center justify-center text-white">
                <Database className="text-xl" />
              </div>
              <h1 className="text-white text-lg font-bold">TaskFlow</h1>
            </div>
            {isMobile && (
              <button
                onClick={toggleMobileSidebar}
                className="md:hidden text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              const label = t(`components.layouts.dashboard.sidebar.navigation.${item.labelKey}`);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={handleLinkClick}
                  className={clsx(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                    isActive
                      ? "bg-[#6366f1]/10 text-[#6366f1] border border-[#6366f1]/20"
                      : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="p-6 border-t border-zinc-800">
          {/* User Profile */}
          <div className="mt-4">
            <UserProfileDropdown />
          </div>
        </div>
      </aside>
    </>
  );
};

