// import React from "react";

// const PageSkeleton = ({ width, pageNumber }) => {
//   // A4 aspect ratio is approximately 1:1.414
//   const height = width * 1.414;

//   return (
//     <div
//       className="w-full bg-gray-100 shadow-md animate-pulse"
//       style={{ height: `${height}px` }}
//     >
//       {/* Header section skeleton */}
//       <div className="p-6">
//         <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
//         <div className="h-3 bg-gray-200 rounded w-1/2 mb-6"></div>
//       </div>

//       {/* Content skeleton */}
//       <div className="px-6">
//         {/* Paragraph lines */}
//         {[...Array(12)].map((_, i) => (
//           <div
//             key={i}
//             className="h-2 bg-gray-200 rounded mb-3"
//             style={{ width: `${Math.floor(70 + Math.random() * 30)}%` }}
//           ></div>
//         ))}

//         {/* Gap */}
//         <div className="h-8"></div>

//         {/* More paragraph lines */}
//         {[...Array(8)].map((_, i) => (
//           <div
//             key={i + 12}
//             className="h-2 bg-gray-200 rounded mb-3"
//             style={{ width: `${Math.floor(50 + Math.random() * 40)}%` }}
//           ></div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default PageSkeleton;


//?added pagenumber in footer section of page

import React from "react";

const PageSkeleton = ({ width, pageNumber }) => {
  // A4 aspect ratio is approximately 1:1.414
  const height = width * 1.414;

  return (
    <div
      className="w-full bg-gray-100 shadow-md animate-pulse flex flex-col"
      style={{ height: `${height}px` }}
    >
      {/* Header section skeleton */}
      <div className="p-6">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-6"></div>
      </div>

      {/* Content skeleton */}
      <div className="px-6 flex-1">
        {/* Paragraph lines */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="h-2 bg-gray-200 rounded mb-3"
            style={{ width: `${Math.floor(70 + Math.random() * 30)}%` }}
          ></div>
        ))}

        {/* Gap */}
        <div className="h-8"></div>

        {/* More paragraph lines */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i + 12}
            className="h-2 bg-gray-200 rounded mb-3"
            style={{ width: `${Math.floor(50 + Math.random() * 40)}%` }}
          ></div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center py-2 text-gray-500 text-sm border-t border-gray-200">
        Page {pageNumber}
      </div>
    </div>
  );
};

export default PageSkeleton;
