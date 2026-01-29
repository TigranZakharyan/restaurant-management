"use client";

import { useState } from "react";
import { ArrowLeft, Delete, ChevronRight } from "lucide-react";
import { TUser } from "@/api/types";
import { useAuth } from "@/context/AuthContext";

type PinLoginModalProps = {
  user: TUser;
  onClose: () => void;
  onSuccess: () => void;
};

export function UserLoginModal({ user, onClose, onSuccess }: PinLoginModalProps) {
  const { loginUser } = useAuth();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handleNumberClick = (num: string) => {
    if (pin.length < 4) setPin(prev => prev + num);
  };

  const handleDelete = () => setPin(prev => prev.slice(0, -1));

  const handleLogin = async () => {
    if (pin.length < 4) return;
    setError("");
    const success = await loginUser(user.fullName, pin);
    if (success) {
      onSuccess();
    } else {
      setError("Password is wrong");
      setPin("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative">

        {/* Close / Back Button */}
        <button
          onClick={() => { onClose(); setPin(""); setError(""); }}
          className="absolute top-4 left-4 flex items-center gap-2 text-gray-900 font-bold hover:text-indigo-600 transition-colors bg-gray-100 px-3 py-1 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="flex flex-col items-center mt-6">
          {/* User Info */}
          <div className="flex items-center gap-4 mb-6 bg-indigo-50 p-4 rounded-2xl border-2 border-indigo-100 w-full">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.fullName}`}
              className="w-16 h-16 rounded-xl border-2 border-white shadow-sm"
              alt="user"
            />
            <div>
              <h2 className="text-2xl font-black text-gray-900">{user.fullName}</h2>
              <p className="text-indigo-600 font-bold text-sm uppercase tracking-widest">Enter 4-Digit Pin</p>
            </div>
          </div>

          {/* Error */}
          {error && <div className="mb-4 text-red-600 font-bold text-center">{error}</div>}

          {/* PIN Display */}
          <div className="flex gap-3 mb-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`w-5 h-5 rounded-full border-2 transition-all duration-150 ${pin.length > i
                    ? "bg-indigo-600 border-indigo-600 scale-125 shadow-lg shadow-indigo-200"
                    : "bg-white border-gray-300"
                  }`}
              />
            ))}
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-3 w-full mb-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <button
                key={num}
                onClick={() => handleNumberClick(num.toString())}
                className="h-20 bg-white border-2 border-gray-200 rounded-2xl text-3xl font-black text-gray-900 hover:border-indigo-600 hover:bg-indigo-50 active:bg-indigo-600 active:text-white transition-all shadow-sm"
              >
                {num}
              </button>
            ))}
            <div className="h-20" />
            <button
              onClick={() => handleNumberClick("0")}
              className="h-20 bg-white border-2 border-gray-200 rounded-2xl text-3xl font-black text-gray-900 hover:border-indigo-600 hover:bg-indigo-50 active:bg-indigo-600 active:text-white transition-all shadow-sm"
            >
              0
            </button>
            <button
              onClick={handleDelete}
              className="h-20 bg-red-50 border-2 border-red-100 rounded-2xl flex items-center justify-center text-red-600 hover:bg-red-600 hover:text-white active:scale-95 transition-all shadow-sm"
            >
              <Delete className="w-8 h-8" />
            </button>
          </div>

          {/* Submit */}
          <button
            disabled={pin.length < 4}
            onClick={handleLogin}
            className="w-full py-5 bg-indigo-600 text-white rounded-2xl text-xl font-black shadow-xl shadow-indigo-200 disabled:opacity-20 disabled:grayscale transition-all flex items-center justify-center gap-3"
          >
            LOGIN <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
