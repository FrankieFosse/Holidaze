import { FaChevronRight, FaChevronLeft } from "react-icons/fa";

function Pagination({ page, totalPages, setPage }) {
  if (totalPages <= 1) return null; // Hide pagination if only one page

  return (
    <div className="pagination-controls flex flex-row justify-center items-center mb-8 gap-8">
      <button
        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        disabled={page === 1}
        className="text-xs flex flex-row justify-center pr-2 pl-1.5 py-1 gap-2 items-center bg-blackSecondary w-max border-1 border-blackSecondary duration-150 cursor-pointer hover:border-grayPrimary rounded disabled:opacity-50 disabled:cursor-default"
      >
        <FaChevronLeft size={20} />
      </button>
      <p>{page} / {totalPages}</p>
      <button
        onClick={() => setPage((prev) => prev + 1)}
        disabled={page === totalPages}
        className="text-xs flex flex-row justify-center pl-2 pr-1.5 py-1 gap-2 items-center bg-blackSecondary w-max border-1 border-blackSecondary duration-150 cursor-pointer hover:border-grayPrimary rounded disabled:opacity-50 disabled:cursor-default"
      >
        <FaChevronRight size={20} />
      </button>
    </div>
  );
}

export default Pagination;
