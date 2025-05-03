import { memo } from 'react';

const PageNavigation = memo(({ currentPage, totalPages, onPageChange }) => {
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm disabled:opacity-50"
        title="Previous Page"
      >
        &#8249;
      </button>
      
      <span className="text-sm">
        Page <span className="font-medium">{currentPage}</span> of {totalPages}
      </span>
      
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm disabled:opacity-50"
        title="Next Page"
      >
        &#8250;
      </button>
    </div>
  );
});

export default PageNavigation;