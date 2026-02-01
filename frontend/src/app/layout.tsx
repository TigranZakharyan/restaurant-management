import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from '@/context/AuthContext'
import { UsersProvider } from "@/context/UsersContext";
import { fetchMeSSR, fetchUsers } from "@/api";
import { cookies } from "next/headers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Restaurant X",
  description: "Restaurant management system",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies()
  const users = await fetchUsers()
  const user = await fetchMeSSR(cookieStore.toString());
  console.log(users)
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UsersProvider initialUsers={users}>
          <AuthProvider initialUser={user}>
            <div className="h-screen grid grid-rows-[auto_1fr]">
              {children}
            </div>
          </AuthProvider>
        </UsersProvider>
      </body>
    </html>
  );
}
