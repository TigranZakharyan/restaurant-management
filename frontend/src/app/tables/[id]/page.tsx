import { fetchCategoriesSSR, fetchTableByIdSSR } from "@/api";
import TableByIdPage from "@/pages/tableByIdPage";
import { cookies } from "next/headers";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Table({ params }: PageProps) {
    const { id } = await params;
    
    const cookieStore = await cookies();
    const cookieString = cookieStore.toString();

    const [table, categories] = await Promise.all([
        fetchTableByIdSSR(id, cookieString),
        fetchCategoriesSSR(cookieString)
    ]);

    return <TableByIdPage table={table} categories={categories} />;
}