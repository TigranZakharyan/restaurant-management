"use client";

import { X } from "lucide-react";
import { TUser } from "@/api/types";

export function UserSelectModal({
  users,
  onClose,
  onSelect,
}: {
  users: TUser[];
  onClose: () => void;
  onSelect: (user: TUser) => void;
}) {
  return (
    // BACKDROP
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
      onClick={onClose}   // 👈 click outside
    >
      {/* MODAL */}
      <div
        onClick={(e) => e.stopPropagation()} // 👈 prevent closing when clicking inside
        className="bg-white w-full max-w-3xl rounded-3xl p-8 shadow-2xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black">Select User</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {users.map((u) => (
            <button
              key={u._id}
              onClick={() => onSelect(u)}
              className="flex flex-col items-center p-4 border-2 rounded-2xl hover:border-indigo-600 hover:shadow-xl transition"
            >
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.fullName}`}
                className="w-20 h-20 rounded-xl bg-gray-100"
                alt="user"
              />
              <span className="mt-2 font-bold text-gray-900 text-center">
                {u.fullName}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
