import { fetchTablesSSR } from "@/api"
import TablesPage from "@/pages/tablesPage";
import { cookies } from "next/headers";

export default async function Tables() {
    const cookieStore = await cookies();
    const tables = await fetchTablesSSR(cookieStore.toString())
    return <TablesPage tables={tables} />
}