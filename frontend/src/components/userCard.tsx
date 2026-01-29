import { TUser } from "@/api/types";


export function UserCard({ user, onClick }: { user: TUser, onClick: (user: TUser) => void }) {
    return (
        <button
            key={user._id}
            onClick={() => onClick(user)}
            className="flex flex-col items-center p-4 bg-white border-2 border-gray-200 rounded-[2rem] shadow hover:border-indigo-600 hover:shadow-xl transition-all group"
        >
            <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.fullName}&backgroundColor=f1f5f9`}
                alt="staff"
                className="w-full aspect-square mb-3 rounded-[1.5rem] object-cover border border-gray-100"
            />
            <p className="text-base font-bold text-gray-900 group-hover:text-indigo-600 truncate w-full text-center">{user.fullName}</p>
        </button>
    )
}