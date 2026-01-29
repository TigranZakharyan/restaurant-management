"use client";

import { useEffect, useState } from "react";
import { TTable } from "@/api/types";
import { Users, ChevronLeft, ChevronRight } from "lucide-react";
import { useSwipeable } from "react-swipeable";
import { Pagination } from "@/components/pagination";
import { updateTableById } from "@/api";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";

type TablePageProps = {
  tables: TTable[];
};

export default function TablesPage({ tables = [] }: TablePageProps) {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTable, setSelectedTable] = useState<TTable | null>(null);
  const [seats, setSeats] = useState(0);

  const tablesPerPage = 10;
  const totalPages = Math.ceil(tables.length / tablesPerPage);

  const indexOfLastTable = currentPage * tablesPerPage;
  const indexOfFirstTable = indexOfLastTable - tablesPerPage;
  const currentTables = tables.slice(indexOfFirstTable, indexOfLastTable);

  useEffect(() => {
    router.refresh();
  }, []);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setCurrentPage((p) => Math.min(p + 1, totalPages)),
    onSwipedRight: () => setCurrentPage((p) => Math.max(p - 1, 1)),
    delta: 50,
    trackMouse: true,
  });

  const openTable = (table: TTable) => {
    if (table.status === "busy") {
      router.push(`/tables/${table._id}`);
    } else {
      setSelectedTable(table);
      setSeats(table.status === "reserved" ? table.seats : 0);
    }
  };

  const handleReserve = async () => {
    if (!selectedTable || seats === 0) return;
    await updateTableById(selectedTable._id, { status: "reserved", seats });
    setSelectedTable(null);
    router.refresh();
  };

  const handleSaveSeats = async () => {
    if (!selectedTable) return;
    await updateTableById(selectedTable._id, { seats });
    setSelectedTable(null);
    router.refresh();
  };

  const handleCancelReservation = async () => {
    if (!selectedTable) return;
    await updateTableById(selectedTable._id, { status: "free", seats: 0 });
    setSelectedTable(null);
    router.refresh();
  };

  const handleOrder = async () => {
    if (!selectedTable) return;
    await updateTableById(selectedTable._id, { status: "busy", seats });
    setSelectedTable(null);
    router.refresh()
    router.push(`/tables/${selectedTable._id}`)
  };

  return (
    <>
      <Header />

      <div
        className="h-full bg-slate-50 p-6 md:p-12 flex items-center"
        {...swipeHandlers}
      >
        {/* LEFT PAGINATION BUTTON */}
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          className="absolute left-4 top-1/2 w-20 h-20 rounded-full bg-indigo-500 shadow flex items-center justify-center disabled:opacity-30"
        >
          <ChevronLeft className="w-8 h-8" color="white" />
        </button>

        {/* RIGHT PAGINATION BUTTON */}
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="absolute right-4 top-1/2 w-20 h-20 rounded-full bg-indigo-500 shadow flex items-center justify-center disabled:opacity-30"
        >
          <ChevronRight className="w-8 h-8" color="white" />
        </button>

        {/* TABLE GRID */}
        <div className="max-w-7xl mx-auto flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 min-h-[520px]">
            {currentTables.map((table) => (
              <button
                key={table._id}
                onClick={() => openTable(table)}
                className={`
                  aspect-square rounded-full border-4 bg-white
                  flex flex-col items-center justify-center transition
                  ${
                    table.status === "free"
                      ? "border-emerald-400"
                      : table.status === "reserved"
                      ? "border-red-500"
                      : "border-yellow-400"
                  }
                `}
              >
                <div className="flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-full mb-2">
                  <Users className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-bold">{table.seats} Seats</span>
                </div>

                <span className="text-3xl font-black">{table.title}</span>

                <span className="text-xs font-black uppercase mt-1">
                  {table.status}
                </span>
              </button>
            ))}
          </div>

          <Pagination totalPages={totalPages} currentPage={currentPage} />
        </div>
      </div>

      {/* MODAL */}
      {selectedTable && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setSelectedTable(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-[640px] bg-white rounded-2xl shadow-2xl p-8 grid grid-cols-2 gap-8"
          >
            {/* LEFT */}
            <div className="flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-black">
                  Table {selectedTable.title}
                </h2>
                <span className="text-sm uppercase font-black text-slate-500">
                  {selectedTable.status}
                </span>
              </div>

              <div className="flex flex-col gap-4 mt-10">
                {selectedTable.status === "free" && (
                  <>
                    <button
                      disabled={seats === 0}
                      onClick={handleReserve}
                      className="py-4 rounded-xl border-2 border-indigo-600 text-indigo-600 font-black"
                    >
                      Reserve
                    </button>

                    <button
                      disabled={seats === 0}
                      onClick={handleOrder}
                      className="py-4 rounded-xl bg-indigo-600 text-white font-black"
                    >
                      Book
                    </button>
                  </>
                )}

                {selectedTable.status === "reserved" && (
                  <>
                    {seats !== selectedTable.seats && (
                      <button
                        onClick={handleSaveSeats}
                        className="py-4 rounded-xl border-2 border-emerald-600 text-emerald-600 font-black"
                      >
                        Save changes
                      </button>
                    )}

                    <button
                      onClick={handleCancelReservation}
                      className="py-4 rounded-xl border-2 border-red-500 text-red-600 font-black"
                    >
                      Cancel reservation
                    </button>

                    <button
                      onClick={handleOrder}
                      className="py-4 rounded-xl bg-indigo-600 text-white font-black"
                    >
                      Order
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex flex-col items-center justify-center gap-6">
              <button
                onClick={() => setSeats((s) => s + 1)}
                className="w-16 h-16 rounded-full bg-slate-100 text-2xl font-black"
              >
                ▲
              </button>

              <span className="text-6xl font-black">{seats}</span>

              <button
                onClick={() => setSeats((s) => Math.max(0, s - 1))}
                className="w-16 h-16 rounded-full bg-slate-100 text-2xl font-black"
              >
                ▼
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
