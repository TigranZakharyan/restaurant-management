"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TUser } from "@/api/types";
import { UserLoginModal } from "@/components/userLoginModal";
import { UserCard } from "@/components/userCard";

export default function HomePage({ users = [] }: { users: TUser[] }) {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<TUser | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(u => 
    u.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="h-full flex flex-col">
      <header className="bg-white border-b-2 border-gray-200 p-6 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">STAFF LOGIN</h1>
            <p className="text-gray-600 font-medium">Select your profile to begin shift</p>
          </div>
          
          <div className="relative w-full md:w-96">
            <input 
              type="text"
              placeholder="Search by name..."
              className="w-full pl-12 pr-4 py-4 bg-gray-100 border-2 text-gray-600 border-gray-200 rounded-2xl text-lg font-semibold focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none transition-all placeholder:text-gray-600"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredUsers.map(user => (
          <UserCard user={user} onClick={(user) => setSelectedUser(user)} key={user._id} />
        ))}
      </main>

      {selectedUser && (
        <UserLoginModal 
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onSuccess={() => router.push("/tables")}
        />
      )}
    </div>
  );
}
