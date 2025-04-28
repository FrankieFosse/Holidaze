// components/Pagination.jsx
function Pagination({ page, totalPages, setPage }) {
    return (
      <div className="pagination-controls flex flex-row justify-evenly items-center mb-8">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <p>{page} / {totalPages}</p>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    );
  }
  
  export default Pagination;
  