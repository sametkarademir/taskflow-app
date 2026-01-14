import { useState, useRef, useEffect } from "react";

import { KeyRound, LogOut } from "lucide-react";

import { useUser } from "../../../contexts/userContext";
import { useLogout } from "../../../features/auth/hooks/useLogout";
import { useLocale } from "../../../features/common/hooks/useLocale";
import { ChangePasswordModal } from "../../../features/profile/components/ChangePasswordModal";

export const UserProfileDropdown = () => {
  const { t } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  const logoutMutation = useLogout();

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  const handleChangePassword = () => {
    setIsOpen(false);
    setIsChangePasswordModalOpen(true);
  };

  const handleLogout = () => {
    setIsOpen(false);
    logoutMutation.mutate();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
      >
        <div className="size-8 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
          {getInitials()}
        </div>
        <div className="flex flex-col items-start flex-shrink-0 flex-1 min-w-0">
          <span className="text-sm font-medium text-white truncate w-full">
            {user?.email}
          </span>
          <span className="text-xs text-zinc-400">Pro Plan</span>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-full bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="py-1">
            <button
              onClick={handleChangePassword}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
            >
              <KeyRound className="w-4 h-4" />
              <span>{t("components.layouts.dashboard.userProfileDropdown.changePassword")}</span>
            </button>
            <button
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogOut className="w-4 h-4" />
              <span>{t("components.layouts.dashboard.userProfileDropdown.logout")}</span>
            </button>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
      />
    </div>
  );
};
