import { fetchUsers } from "@/api";
import HomePage from "@/pages/homePage";

export default async function LoginPage() {
  const users = await fetchUsers();
  return <HomePage users={users} />;
}