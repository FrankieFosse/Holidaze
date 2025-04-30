import { FaChevronRight, FaChevronLeft } from "react-icons/fa";


function Pagination({ page, totalPages, setPage }) {
    return (
      <div className="pagination-controls flex flex-row justify-evenly items-center mb-8">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="text-xs flex flex-row justify-center px-2 py-1 gap-2 items-center bg-blackSecondary w-24 border-1 border-blackSecondary duration-150 cursor-pointer hover:border-grayPrimary"
        >
          <FaChevronLeft size={20}/>
          Previous
        </button>
        <p>{page} / {totalPages}</p>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={page === totalPages}
          className="text-xs flex flex-row justify-center px-2 py-1 gap-2 items-center bg-blackSecondary w-24 border-1 border-blackSecondary duration-150 cursor-pointer hover:border-grayPrimary"
        >
          Next
          <FaChevronRight size={20}/>
        </button>
      </div>
    );
  }
  
  export default Pagination;
  