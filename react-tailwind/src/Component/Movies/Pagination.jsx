// components/Movies/components/Pagination.jsx
import React from "react";

export const Pagination = ({
  currentPage,
  onPageChange,
  onFirstPage,
  onLastPage,
  onPreviousPage,
  onNextPage,
}) => (
  <div className="flex items-center gap-1 text-sm p-4 ml-100 dark:bg-gray-800 rounded-lg">
    <button
      onClick={onFirstPage}
      disabled={currentPage === 1}
      className="px-3 py-1 rounded-full bg-rose-300 hover:bg-slate-500 dark:hover:bg-slate-600 disabled:opacity-50 disabled:hover:bg-transparent transition-colors cursor-pointer"
    >
      &lt;&lt;
    </button>
    <button
      onClick={onPreviousPage}
      disabled={currentPage === 1}
      className="px-3 py-1 rounded-full bg-rose-300 hover:bg-slate-500 dark:hover:bg-slate-600 disabled:opacity-50 disabled:hover:bg-transparent transition-colors cursor-pointer"
    >
      Previous
    </button>
    <span>Page</span>
    <input
      type="text"
      placeholder={`1-500`}
      title="Enter page number (1-500)"
      value={currentPage}
      onChange={onPageChange}
      onBlur={(e) => {
        const num = parseInt(e.target.value) || 1;
        onPageChange(Math.min(Math.max(num, 1), 500));
      }}
      className="w-12 px-2 py-1 border rounded text-center bg-white dark:bg-slate-700"
    />
    <span>of 500</span>
    <button
      onClick={onNextPage}
      disabled={currentPage === 500}
      className="px-3 py-1 rounded-full bg-rose-300 hover:bg-slate-500 dark:hover:bg-slate-600 disabled:opacity-50 disabled:hover:bg-transparent transition-colors cursor-pointer relative"
    >
      Next
    </button>
    <button
      onClick={onLastPage}
      disabled={currentPage === 500}
      className="px-3 py-1 rounded-full bg-rose-300 hover:bg-slate-500 dark:hover:bg-slate-600 disabled:opacity-50 disabled:hover:bg-transparent transition-colors cursor-pointer"
    >
      &gt;&gt;
    </button>
  </div>
);
