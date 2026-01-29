"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, User, ChevronLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { TUser } from "@/api/types";
import { UserLoginModal } from "@/components/userLoginModal";
import { UserSelectModal } from "@/components/userSelectModal";
import { useUsers } from "@/context/UsersContext";

export function Header({
  tableNumber,
  includeBack = false,
}: {
  tableNumber?: string;
  includeBack?: boolean;
}) {
  const { users } = useUsers();
  const { user, logout } = useAuth();
  const router = useRouter();

  const [showUserSelect, setShowUserSelect] = useState(false);
  const [loginUser, setLoginUser] = useState<TUser | null>(null);

  if (!user) return null;

  return (
    <>
      <header className="h-20 bg-white border-b-2 border-gray-200 flex items-center px-6 relative gap-3">
        {/* LEFT — Back */}
        {includeBack && (
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 font-bold px-4 py-2 rounded-xl hover:bg-gray-100 transition"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
        )}

        {/* LEFT — Logout */}
        <button
          onClick={() => {
            logout();
            router.push("/");
          }}
          className="flex items-center gap-2 text-red-600 font-bold hover:bg-red-50 px-4 py-2 rounded-xl transition"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>

        {/* CENTER — Table */}
        <div className="absolute left-1/2 -translate-x-1/2 text-xl font-black text-gray-900">
          {tableNumber ? `Table: ${tableNumber}` : ""}
        </div>

        {/* RIGHT — Current User */}
        <button
          onClick={() => setShowUserSelect(true)}
          className="ml-auto flex items-center gap-3 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-2xl transition"
        >
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.fullName}`}
            className="w-10 h-10 rounded-xl border bg-white"
            alt="user"
          />
          <span className="font-bold text-gray-900">{user.fullName}</span>
          <User className="w-4 h-4 text-gray-500" />
        </button>
      </header>

      {/* STEP 1 — USER SELECT */}
      {showUserSelect && (
        <UserSelectModal
          users={users}
          onClose={() => setShowUserSelect(false)}
          onSelect={(u) => setLoginUser(u)}
        />
      )}

      {/* STEP 2 — LOGIN */}
      {loginUser && (
        <UserLoginModal
          user={loginUser}
          onClose={() => setLoginUser(null)}
          onSuccess={() => {
            setLoginUser(null);
            setShowUserSelect(false);
          }}
        />
      )}
    </>
  );
}
