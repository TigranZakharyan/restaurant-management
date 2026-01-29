export const Pagination = ({ totalPages, currentPage }: { totalPages: number, currentPage: number }) => {
    return (
        <div className="flex justify-center gap-2 mt-12">
            {[...Array(totalPages)].map((_, i) => (
                <div
                    key={i}
                    className={`h-2 transition-all duration-300 rounded-full ${currentPage === i + 1 ? "w-8 bg-indigo-600" : "w-2 bg-slate-300"
                        }`}
                />
            ))}
        </div>
    )
}