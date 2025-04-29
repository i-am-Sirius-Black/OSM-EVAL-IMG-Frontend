// import { memo, useRef } from 'react';
// import { Page } from 'react-pdf';
// import checkImage from '/check.png';
// import cancelImage from '/cross.png';

// const SinglePage = memo(
//   ({ pageNumber, width, onPageClick, annotations, selectedTool, handleRemoveAnnotation }) => {
//     const pageRef = useRef(null);

//     const getPositionStyle = (position) => {
//       return {
//         position: 'absolute',
//         left: `${position.x}%`,
//         top: `${position.y}%`,
//         transform: 'translate(-50%, -50%)',
//         width: '30px',
//         height: '30px',
//       };
//     };

//     return (
//       <div className="relative mb-6 bg-white rounded-md shadow-sm">
//         <Page
//           pageNumber={pageNumber}
//           width={width}
//           onClick={onPageClick}
//           onContextMenu={onPageClick}
//           renderAnnotationLayer={false}
//           renderTextLayer={false}
//           loading={null}
//           className="border border-gray-100"
//           inputRef={pageRef}
//         />
//         {annotations.map((a) => (
//           <div
//             key={a.id}
//             style={getPositionStyle(a.position)}
//             className="absolute cursor-pointer"
//             onClick={(e) => {
//               e.stopPropagation();
//               if (selectedTool === 'erase') {
//                 handleRemoveAnnotation(a.id);
//               }
//             }}
//           >
//             {a.type === 'comment' ? (
//               <div className=" h-auto w-max p-2 text-sm text-red-500 italic shadow-xl max-w-xs">
//                 <p className="capitalize font-medium">{a.position.text}</p>
//               </div>
//             ) : (
//               <img
//                 src={a.type === 'check' ? checkImage : cancelImage}
//                 alt={a.type === 'check' ? 'Check' : 'Cancel'}
//                 className="w-full h-full"
//               />
//             )}
//           </div>
//         ))}
//       </div>
//     );
//   }
// );

// export default SinglePage;

//? v1 stream image working fine
// import { memo, useRef, useEffect, useState } from 'react';
// import checkImage from '/check.png';
// import cancelImage from '/cross.png';
// import LoadingSpinner from '../Common/LoadingSpinner';

// // SinglePage component for rendering individual image pages
// const SinglePage = memo(
//   ({ pageNumber, imageUrl, width, onPageClick, annotations, selectedTool, handleRemoveAnnotation, handleUpdateAnnotation }) => {
//     const pageRef = useRef(null);
//     const [isVisible, setIsVisible] = useState(false);

// // Lazy load images using Intersection Observer
// useEffect(() => {
//   const observer = new IntersectionObserver(
//     ([entry]) => {
//       if (entry.isIntersecting) {
//         setIsVisible(true);
//         observer.disconnect();
//       }
//     },
//     { threshold: 0.1 }
//   );

//   if (pageRef.current) {
//     observer.observe(pageRef.current);
//   }

//   return () => observer.disconnect();
// }, []);

//     // Handle drawing updates (for 'draw' tool)
//     const handleMouseMove = (e) => {
//       if (selectedTool !== 'draw') return;
//       const rect = pageRef.current.getBoundingClientRect();
//       const x = Math.round(((e.clientX - rect.left) / rect.width) * 100 * 10) / 10;
//       const y = Math.round(((e.clientY - rect.top) / rect.height) * 100 * 10) / 10;
//       handleUpdateAnnotation(pageNumber, { x, y });
//     };

//     // Render annotations
//     const renderAnnotation = (annotation) => {
//       const { id, type, position, path, text } = annotation;

//       const style = {
//         position: 'absolute',
//         left: `${position.x}%`,
//         top: `${position.y}%`,
//         transform: 'translate(-50%, -50%)',
//       };

//       if (type === 'check') {
//         return (
//           <img
//             key={id}
//             src={checkImage}
//             alt="Check"
//             className="w-6 h-6 cursor-pointer"
//             style={style}
//             onClick={() => handleRemoveAnnotation(id)}
//           />
//         );
//       } else if (type === 'cancel') {
//         return (
//           <img
//             key={id}
//             src={cancelImage}
//             alt="Cross"
//             className="w-6 h-6 cursor-pointer"
//             style={style}
//             onClick={() => handleRemoveAnnotation(id)}
//           />
//         );
//       } else if (type === 'comment') {
//         return (
//           <div
//             key={id}
//             className="p-2 rounded text-xl font-semibold text-red-500 cursor-pointer select-none"
//             style={style}
//             onClick={() => handleRemoveAnnotation(id)}
//           >
//             {text}
//           </div>
//         );
//       } else if (type === 'draw' && path) {
//         return (
//           <svg
//             key={id}
//             className="absolute top-0 left-0 w-full h-full pointer-events-none"
//             style={{ zIndex: 10 }}
//           >
//             <polyline
//               points={path.map((p) => `${p.x * width / 100},${p.y * width / 100}`).join(' ')}
//               stroke="red"
//               strokeWidth="2"
//               fill="none"
//             />
//           </svg>
//         );
//       }
//       return null;
//     };

// //?v2
// return (

//   <div className="relative mb-8"> {/* Increased bottom margin for page number */}
//     <div
//       ref={pageRef}
//       className="relative bg-white shadow-md mx-auto"
//       style={{ width: `${width}px` }}
//       onClick={onPageClick}
//       onMouseMove={selectedTool === 'draw' ? handleMouseMove : undefined}
//       onContextMenu={onPageClick}
//     >
//       {isVisible ? (

//         <img
//           src={imageUrl}
//           alt={`Page ${pageNumber}`}
//           style={{ width: '100%', display: 'block' }}
//           loading="lazy"
//         />
//       ) : (
//         <div style={{ width: '100%', height: `${width * 1.414}px`, background: '#f0f0f0' }} />
//       )}
//       {annotations.map(renderAnnotation)}
//     </div>

//     {/* Page number indicator */}
//     <div className="text-center mt-2 text-gray-500 text-sm">
//       Page {pageNumber}
//     </div>
//   </div>
// );

// //?old return
//     // return (
//     //   <div
//     //     ref={pageRef}
//     //     className="relative mb-4 bg-white shadow-md"
//     //     style={{ width: `${width}px`, margin: '0 auto' }}
//     //     onClick={onPageClick}
//     //     onMouseMove={selectedTool === 'draw' ? handleMouseMove : undefined}
//     //     onContextMenu={onPageClick}
//     //   >
//     //     {isVisible ? (
//     //       <>
//     //       <img
//     //         src={imageUrl}
//     //         alt={`Page ${pageNumber}`}
//     //         style={{ width: '100%', display: 'block' }}
//     //         loading="lazy"
//     //       />

//     //       </>
//     //     ) : (
//     //       <div style={{ width: '100%', height: `${width * 1.414}px`, background: '#f0f0f0' }} />
//     //     )}
//     //     {annotations.map(renderAnnotation)}
//     //   </div>
//     // );
//   }
// );

// export default SinglePage;

//?v1.1 same as v1 (added loading skeleton)
// import { memo, useRef, useEffect, useState } from "react";
// import checkImage from "/check.png";
// import cancelImage from "/cross.png";
// import LoadingSpinner from "../Common/LoadingSpinner";
// import PageSkeleton from "../Common/PageSkeleton";

// // SinglePage component for rendering individual image pages
// const SinglePage = memo(
//   ({
//     pageNumber,
//     imageUrl,
//     width,
//     onPageClick,
//     annotations,
//     selectedTool,
//     handleRemoveAnnotation,
//     handleUpdateAnnotation,
//   }) => {
//     const pageRef = useRef(null);
//     const [isVisible, setIsVisible] = useState(false);
//     const [isLoaded, setIsLoaded] = useState(false); //
    

//     // Lazy load images using Intersection Observer
//     useEffect(() => {
//       const observer = new IntersectionObserver(
//         ([entry]) => {
//           if (entry.isIntersecting) {
//             setIsVisible(true);
//             observer.disconnect();
//           }
//         },
//         { threshold: 0.1 }
//       );

//       if (pageRef.current) {
//         observer.observe(pageRef.current);
//       }

//       return () => observer.disconnect();
//     }, []);

//     // Handle drawing updates (for 'draw' tool)
//     const handleMouseMove = (e) => {
//       if (selectedTool !== "draw") return;
//       const rect = pageRef.current.getBoundingClientRect();
//       const x =
//         Math.round(((e.clientX - rect.left) / rect.width) * 100 * 10) / 10;
//       const y =
//         Math.round(((e.clientY - rect.top) / rect.height) * 100 * 10) / 10;
//       handleUpdateAnnotation(pageNumber, { x, y });
//     };

//     // Render annotations
//     const renderAnnotation = (annotation) => {
//       const { id, type, position, path, text } = annotation;

//       const style = {
//         position: "absolute",
//         left: `${position.x}%`,
//         top: `${position.y}%`,
//         transform: "translate(-50%, -50%)",
//       };

//       if (type === "check") {
//         return (
//           <img
//             key={id}
//             src={checkImage}
//             alt="Check"
//             className="w-8 h-8 cursor-pointer"
//             style={style}
//             onClick={() => handleRemoveAnnotation(id)}
//           />
//         );
//       } else if (type === "cancel") {
//         return (
//           <img
//             key={id}
//             src={cancelImage}
//             alt="Cross"
//             className="w-8 h-8 cursor-pointer"
//             style={style}
//             onClick={() => handleRemoveAnnotation(id)}
//           />
//         );
//       } else if (type === "comment") {
//         return (
//           <div
//             key={id}
//             className="p-2 rounded text-xl font-semibold text-red-500 cursor-pointer select-none"
//             style={style}
//             onClick={() => handleRemoveAnnotation(id)}
//           >
//             {text}
//           </div>
//         );
//       } else if (type === "draw" && path) {
//         return (
//           <svg
//             key={id}
//             className="absolute top-0 left-0 w-full h-full pointer-events-none"
//             style={{ zIndex: 10 }}
//           >
//             <polyline
//               points={path
//                 .map((p) => `${(p.x * width) / 100},${(p.y * width) / 100}`)
//                 .join(" ")}
//               stroke="red"
//               strokeWidth="2"
//               fill="none"
//             />
//           </svg>
//         );
//       }
//       return null;
//     };

//     return (
//       <div className="relative mb-8">
//         {" "}
//         {/* Increased bottom margin for page number */}
//         <div
//           ref={pageRef}
//           className="relative bg-white shadow-md mx-auto"
//           style={{ width: `${width}px` }}
//           onClick={onPageClick}
//           onMouseMove={selectedTool === "draw" ? handleMouseMove : undefined}
//           onContextMenu={onPageClick}
//         >
//           {isVisible ? (
//             <>
//               <img
//                 src={imageUrl}
//                 alt={`Page ${pageNumber}`}
//                 style={{
//                   width: "100%",
//                   display: "block",
//                   opacity: isLoaded ? 1 : 0, // Hide image until loaded
//                 }}
//                 loading="lazy"
//                 onLoad={() => setIsLoaded(true)}
//               />
//               {!isLoaded && (
//                 <div className="absolute inset-0">
//                   <PageSkeleton width={width} />
//                 </div>
//               )}
//             </>
//           ) : (
//             <PageSkeleton width={width} pageNumber={pageNumber} />
//           )}
//           {annotations.map(renderAnnotation)}
//           {/* Page number indicator */}
//           {isLoaded && (
//             <div className="text-center py-1 text-gray-600 text-sm font-bold ">
//               Page {pageNumber}
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   }
// );

// export default SinglePage;


//?v1.2 trying drawing, [draw working] but reamove last anotation taking time....

// import { memo, useRef, useEffect, useState, useCallback } from "react";
// import checkImage from "/check.png";
// import cancelImage from "/cross.png";
// import PageSkeleton from "../Common/PageSkeleton";

// // SinglePage component for rendering individual image pages
// const SinglePage = memo(
//   ({
//     pageNumber,
//     imageUrl,
//     width,
//     onPageClick,
//     annotations,
//     selectedTool,
//     handleRemoveAnnotation,
//     handleUpdateAnnotation,
//     handleAnnotate,
//   }) => {
//     const pageRef = useRef(null);
//     const [isVisible, setIsVisible] = useState(false);
//     const [isLoaded, setIsLoaded] = useState(false);
//     const isDrawing = useRef(false); // Track drawing state
//     const currentPath = useRef([]); // Track the current drawing path
//     const [pageDimensions, setPageDimensions] = useState({ width: 0, height: 0 });
 
//     // Lazy load images using Intersection Observer
//     // useEffect(() => {
//     //   const observer = new IntersectionObserver(
//     //     ([entry]) => {
//     //       if (entry.isIntersecting) {
//     //         setIsVisible(true);
//     //         observer.disconnect();
//     //       }
//     //     },
//     //     { threshold: 0.1 }
//     //   );

//     //   if (pageRef.current) {
//     //     observer.observe(pageRef.current);
//     //   }

//     //   return () => observer.disconnect();
//     // }, []);
//         // Lazy load images and track page dimensions
//         useEffect(() => {
//           const observer = new IntersectionObserver(
//             ([entry]) => {
//               if (entry.isIntersecting) {
//                 setIsVisible(true);
//                 observer.disconnect();
//               }
//             },
//             { threshold: 0.1 }
//           );
    
//           if (pageRef.current) {
//             observer.observe(pageRef.current);
    
//             // Set initial dimensions
//             const updateDimensions = () => {
//               const rect = pageRef.current.getBoundingClientRect();
//               setPageDimensions({
//                 width: rect.width,
//                 height: rect.height,
//               });
//             };
    
//             updateDimensions();
//             window.addEventListener("resize", updateDimensions);
    
//             return () => {
//               observer.disconnect();
//               window.removeEventListener("resize", updateDimensions);
//             };
//           }
//         }, []);



//     // Update page dimensions after the image is fully loaded
//     const updatePageDimensions = useCallback(() => {
//       if (pageRef.current) {
//         const rect = pageRef.current.getBoundingClientRect();
//         setPageDimensions({
//           width: rect.width,
//           height: rect.height,
//         });
//       }
//     }, []);

//     // Lazy load images using Intersection Observer
//     useEffect(() => {
//       const observer = new IntersectionObserver(
//         ([entry]) => {
//           if (entry.isIntersecting) {
//             setIsVisible(true);
//             observer.disconnect();
//           }
//         },
//         { threshold: 0.1 }
//       );

//       if (pageRef.current) {
//         observer.observe(pageRef.current);
//       }

//       return () => observer.disconnect();
//     }, []);

//     // Update dimensions on image load and window resize
//     useEffect(() => {
//       if (isLoaded) {
//         updatePageDimensions();
//         window.addEventListener("resize", updatePageDimensions);
//       }

//       return () => {
//         window.removeEventListener("resize", updatePageDimensions);
//       };
//     }, [isLoaded, updatePageDimensions]);

//     // Convert mouse coordinates to percentages relative to the page
//     const getRelativePosition = (e) => {
//       const rect = pageRef.current.getBoundingClientRect();
//       const x = ((e.clientX - rect.left) / rect.width) * 100;
//       const y = ((e.clientY - rect.top) / rect.height) * 100;
//       return {
//         x: Math.max(0, Math.min(100, Math.round(x * 10) / 10)),
//         y: Math.max(0, Math.min(100, Math.round(y * 10) / 10)),
//       };
//     };

//     // Start drawing
//     const handleMouseDown = useCallback(
//       (e) => {
//         if (selectedTool !== "draw") return;

//         e.preventDefault();
//         isDrawing.current = true;

//         const position = getRelativePosition(e);
//         currentPath.current = [position];
//       },
//       [selectedTool]
//     );

//     // Continue drawing
//     const handleMouseMove = useCallback(
//       (e) => {
//         if (!isDrawing.current || selectedTool !== "draw") return;

//         const position = getRelativePosition(e);
//         currentPath.current.push(position);

//         // Temporary rendering of the path while drawing
//         handleAnnotate(pageNumber, { path: [...currentPath.current] });
//       },
//       [selectedTool, handleAnnotate, pageNumber]
//     );

//     // Stop drawing
//     const handleMouseUp = useCallback(() => {
//       if (!isDrawing.current || selectedTool !== "draw") return;

//       isDrawing.current = false;
//       handleAnnotate("draw", pageNumber, { path: [...currentPath.current] });
//       currentPath.current = [];
//     }, [selectedTool, handleAnnotate, pageNumber]);

//     // Render annotations
//     const renderAnnotation = (annotation) => {
//       const { id, type, position, text } = annotation;
//       console.log("annotation", annotation);
      
//       const path = position.path;
      
//       const style = {
//         position: "absolute",
//         left: `${position.x}%`,
//         top: `${position.y}%`,
//         transform: "translate(-50%, -50%)",
//       };

//       if (type === "check") {
//         return (
//           <img
//             key={id}
//             src={checkImage}
//             alt="Check"
//             className="w-6 h-6 cursor-pointer"
//             style={style}
//             onClick={() => handleRemoveAnnotation(id)}
//           />
//         );
//       } else if (type === "cancel") {
//         return (
//           <img
//             key={id}
//             src={cancelImage}
//             alt="Cross"
//             className="w-6 h-6 cursor-pointer"
//             style={style}
//             onClick={() => handleRemoveAnnotation(id)}
//           />
//         );
//       } else if (type === "comment") {


//         return (
//           <div
//             key={id}
//             className="p-2 rounded text-xl font-semibold text-red-500 cursor-pointer select-none"
//             style={style}
//             onClick={() => handleRemoveAnnotation(id)}
//           >
//             {text}
//           </div>
//         );
//       } else if (type === "draw" && path) {

//          // Convert percentage coordinates to pixel coordinates for SVG
//          const points = path.map((p) => {
//            const x = (p.x / 100) * pageDimensions.width;
//            const y = (p.y / 100) * pageDimensions.height;
//            return `${x},${y}`;
//          }).join(" ");
//          console.log("points", points);
         
//         return (
//           // <svg
//           //   key={id}
//           //   className="absolute top-0 left-0 w-full h-full pointer-events-none"
//           //   style={{ zIndex: 10 }}
//           // >
//           //   <polyline
//           //     points={path
//           //       .map((p) => `${(p.x * width) / 100},${(p.y * width) / 100}`)
//           //       .join(" ")}
//           //     stroke="red"
//           //     strokeWidth="2"
//           //     fill="none"
//           //   />
//           // </svg>
//           <svg
//           key={id}
//           className="absolute top-0 left-0 w-full h-full pointer-events-none"
//           style={{ zIndex: 10 }}
//           viewBox={`0 0 ${pageDimensions.width} ${pageDimensions.height}`}
//           preserveAspectRatio="none"
//         >
//           <polyline points={points} stroke="red" strokeWidth="2" fill="none" />
//         </svg>
//         );
//       }
//       return null;
//     };

//     return (
//       <div className="relative mb-8">
//         {" "}
//         {/* Increased bottom margin for page number */}
//         <div
//           ref={pageRef}
//           className="relative bg-white shadow-md mx-auto"
//           style={{ width: `${width}px` }}
//           onClick={onPageClick}
//           onMouseDown={selectedTool === "draw" ? handleMouseDown: undefined}
//           onMouseMove={selectedTool === "draw" ? handleMouseMove : undefined}
//           onMouseUp={selectedTool === "draw" ? handleMouseUp : undefined}// Stop drawing if the mouse leaves the page
//           onContextMenu={onPageClick}
//         >
//           {isVisible ? (
//             <>
//               <img
//                 src={imageUrl}
//                 alt={`Page ${pageNumber}`}
//                 style={{
//                   width: "100%",
//                   display: "block",
//                   opacity: isLoaded ? 1 : 0, // Hide image until loaded
//                 }}
//                 loading="lazy"
//                 onLoad={() => setIsLoaded(true)}
//               />
//               {!isLoaded && (
//                 <div className="absolute inset-0">
//                   <PageSkeleton width={width} />
//                 </div>
//               )}
//             </>
//           ) : (
//             <PageSkeleton width={width} pageNumber={pageNumber} />
//           )}
//           {annotations.map(renderAnnotation)}
//           {/* Page number indicator */}
//           {isLoaded && (
//             <div className="text-center py-1 text-gray-600 text-sm font-bold ">
//               Page {pageNumber}
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   }
// );

// export default SinglePage;



//?testing height from parent

// import { memo, useRef, useEffect, useState, useCallback } from "react";
// import checkImage from "/check.png";
// import cancelImage from "/cross.png";
// import PageSkeleton from "../Common/PageSkeleton";

// // SinglePage component for rendering individual image pages
// const SinglePage = memo(
//   ({
//     pageNumber,
//     imageUrl,
//     width,
//     height,
//     onPageClick,
//     annotations,
//     selectedTool,
//     handleRemoveAnnotation,
//     handleUpdateAnnotation,
//     handleAnnotate,
//   }) => {
//     const pageRef = useRef(null);
//     const [isVisible, setIsVisible] = useState(false);
//     const [isLoaded, setIsLoaded] = useState(false);
//     const isDrawing = useRef(false); // Track drawing state
//     const currentPath = useRef([]); // Track the current drawing path

//     const currentAnnotationId = useRef(null); // Track the current annotation ID while drawing
 
//     // Lazy load images using Intersection Observer
//     useEffect(() => {
//       const observer = new IntersectionObserver(
//         ([entry]) => {
//           if (entry.isIntersecting) {
//             setIsVisible(true);
//             observer.disconnect();
//           }
//         },
//         { threshold: 0.1 }
//       );

//       if (pageRef.current) {
//         observer.observe(pageRef.current);
//       }

//       return () => observer.disconnect();
//     }, []);

//  // Start drawing
//  const handleMouseDown = useCallback(
//   (e) => {
//     if (selectedTool !== "draw") return;

//     e.preventDefault();
//     isDrawing.current = true;

//     const rect = pageRef.current.getBoundingClientRect();
//     const x = Math.round(((e.clientX - rect.left) / rect.width) * 100 * 10) / 10;
//     const y = Math.round(((e.clientY - rect.top) / rect.height) * 100 * 10) / 10;

//     currentPath.current = [{ x, y }];
//   },
//   [selectedTool]
// );

// // Continue drawing
// const handleMouseMove = useCallback(
//   (e) => {
//     if (!isDrawing.current || selectedTool !== "draw") return;

//     const rect = pageRef.current.getBoundingClientRect();
//     const x = Math.round(((e.clientX - rect.left) / rect.width) * 100 * 10) / 10;
//     const y = Math.round(((e.clientY - rect.top) / rect.height) * 100 * 10) / 10;

//     currentPath.current.push({ x, y });
//     // Temporary rendering of the path while drawing
//     handleAnnotate("draw", pageNumber, { path: [...currentPath.current] });
//   },
//   [selectedTool, handleAnnotate, pageNumber]
// );

// // Stop drawing
// const handleMouseUp = useCallback(() => {
//   if (!isDrawing.current || selectedTool !== "draw") return;

//   isDrawing.current = false;
//   handleAnnotate("draw", pageNumber, { path: [...currentPath.current] });
//   currentPath.current = [];
// }, [selectedTool, handleAnnotate, pageNumber]);
  


//     // Render annotations
//     const renderAnnotation = (annotation) => {
//       const { id, type, position, text } = annotation;
//       console.log("annotation", annotation);
      
//       const path = position.path;
      
//       const style = {
//         position: "absolute",
//         left: `${position.x}%`,
//         top: `${position.y}%`,
//         transform: "translate(-50%, -50%)",
//       };

//       if (type === "check") {
//         return (
//           <img
//             key={id}
//             src={checkImage}
//             alt="Check"
//             className="w-6 h-6 cursor-pointer"
//             style={style}
//             onClick={() => handleRemoveAnnotation(id)}
//           />
//         );
//       } else if (type === "cancel") {
//         return (
//           <img
//             key={id}
//             src={cancelImage}
//             alt="Cross"
//             className="w-6 h-6 cursor-pointer"
//             style={style}
//             onClick={() => handleRemoveAnnotation(id)}
//           />
//         );
//       } else if (type === "comment") {


//         return (
//           <div
//             key={id}
//             className="p-2 rounded text-xl font-semibold text-red-500 cursor-pointer select-none"
//             style={style}
//             onClick={() => handleRemoveAnnotation(id)}
//           >
//             {text}
//           </div>
//         );
//       } else if (type === "draw" && path) {
         
//         return (
//           <svg
//             key={id}
//             className="absolute top-0 left-0 w-full h-full pointer-events-none"
//             style={{ zIndex: 10 }}
//             viewBox={`0 0 ${width} ${height}`} //check this , learn about it?
//             preserveAspectRatio="none"
//           >
//             <polyline
//               points={path
//                 .map((p) => `${(p.x * width) / 100},${(p.y * height) / 100}`)
//                 .join(" ")}
//               stroke="red"
//               strokeWidth="2"
//               fill="none"
//             />
//           </svg>
//         );
//       }
//       return null;
//     };

//     return (
//       <div className="relative mb-8">
//         {" "}
//         {/* Increased bottom margin for page number */}
//         <div
//           ref={pageRef}
//           className={`relative bg-white shadow-md mx-auto ${selectedTool=="draw" && 'draw-cursor'}`}
//           style={{ width: `${width}px` }}
//           onClick={onPageClick}
//           onMouseDown={selectedTool === "draw" ? handleMouseDown: undefined}
//           onMouseMove={selectedTool === "draw" ? handleMouseMove : undefined}
//           onMouseUp={selectedTool === "draw" ? handleMouseUp : undefined}// Stop drawing if the mouse leaves the page
//           onContextMenu={onPageClick}
//         >
//           {isVisible ? (
//             <>
//               <img
//                 src={imageUrl}
//                 alt={`Page ${pageNumber}`}
//                 style={{
//                   width: "100%",
//                   display: "block",
//                   opacity: isLoaded ? 1 : 0, // Hide image until loaded
//                 }}
//                 loading="lazy"
//                 onLoad={() => setIsLoaded(true)}
//               />
//               {!isLoaded && (
//                 <div className="absolute inset-0">
//                   <PageSkeleton width={width} />
//                 </div>
//               )}
//             </>
//           ) : (
//             <PageSkeleton width={width} pageNumber={pageNumber} />
//           )}
//           {annotations.map(renderAnnotation)}
//           {/* Page number indicator */}
//           {isLoaded && (
//             <div className="text-center py-1 text-gray-600 text-sm font-bold ">
//               Page {pageNumber}
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   }
// );

// export default SinglePage;

//?testing v1 separate drawing annotation (currently working)
// import { memo, useRef, useEffect, useState, useCallback } from "react";
// import checkImage from "/check.png";
// import cancelImage from "/cross.png";
// import PageSkeleton from "../Common/PageSkeleton";

// // SinglePage component for rendering individual image pages
// const SinglePage = memo(
//   ({
//     pageNumber,
//     imageUrl,
//     width,
//     height,
//     onPageClick,
//     annotations,
//     selectedTool,
//     handleRemoveAnnotation,
//     handleUpdateAnnotation,
//     handleDrawAnnotation, // New prop for handling draw annotations
//   }) => {
//     const pageRef = useRef(null);
//     const [isVisible, setIsVisible] = useState(false);
//     const [isLoaded, setIsLoaded] = useState(false);
//     const isDrawing = useRef(false); // Track drawing state
//     const currentPath = useRef([]); // Track the current drawing path
//     const currentAnnotationId = useRef(null); // Track the current annotation ID while drawing

//     // Lazy load images using Intersection Observer
//     useEffect(() => {
//       const observer = new IntersectionObserver(
//         ([entry]) => {
//           if (entry.isIntersecting) {
//             setIsVisible(true);
//             observer.disconnect();
//           }
//         },
//         { threshold: 0.1 }
//       );

//       if (pageRef.current) {
//         observer.observe(pageRef.current);
//       }

//       return () => observer.disconnect();
//     }, []);

//     // Start drawing
//     const handleMouseDown = useCallback(
//       (e) => {
//         if (selectedTool !== "draw") return;

//         e.preventDefault();
//         isDrawing.current = true;

//         const rect = pageRef.current.getBoundingClientRect();
//         const x = Math.round(((e.clientX - rect.left) / rect.width) * 100 * 10) / 10;
//         const y = Math.round(((e.clientY - rect.top) / rect.height) * 100 * 10) / 10;

//         currentPath.current = [{ x, y }];
        
//         // Create a temporary annotation ID for this drawing session
//         currentAnnotationId.current = `${pageNumber}-${Date.now()}`;
        
//         // Initialize the draw annotation with the first point
//         handleDrawAnnotation(
//           "start", 
//           currentAnnotationId.current, 
//           pageNumber, 
//           [...currentPath.current]
//         );
//       },
//       [selectedTool, pageNumber, handleDrawAnnotation]
//     );

//     // Continue drawing
//     const handleMouseMove = useCallback(
//       (e) => {
//         if (!isDrawing.current || selectedTool !== "draw") return;

//         const rect = pageRef.current.getBoundingClientRect();
//         const x = Math.round(((e.clientX - rect.left) / rect.width) * 100 * 10) / 10;
//         const y = Math.round(((e.clientY - rect.top) / rect.height) * 100 * 10) / 10;

//         currentPath.current.push({ x, y });
        
//         // Update the path in real-time
//         handleDrawAnnotation(
//           "update", 
//           currentAnnotationId.current, 
//           pageNumber, 
//           [...currentPath.current]
//         );
//       },
//       [selectedTool, handleDrawAnnotation, pageNumber]
//     );

//     // Stop drawing
//     const handleMouseUp = useCallback(() => {
//       if (!isDrawing.current || selectedTool !== "draw") return;

//       isDrawing.current = false;
      
//       // Finalize the drawing session
//       handleDrawAnnotation(
//         "end", 
//         currentAnnotationId.current, 
//         pageNumber, 
//         [...currentPath.current]
//       );
      
//       currentPath.current = [];
//       currentAnnotationId.current = null;
//     }, [selectedTool, handleDrawAnnotation, pageNumber]);

//     // Render annotations
//     const renderAnnotation = (annotation) => {
//       const { id, type, position, text } = annotation;
      
//       if (type === "check") {
//         const style = {
//           position: "absolute",
//           left: `${position.x}%`,
//           top: `${position.y}%`,
//           transform: "translate(-50%, -50%)",
//         };
        
//         return (
//           <img
//             key={id}
//             src={checkImage}
//             alt="Check"
//             className="w-6 h-6 cursor-pointer"
//             style={style}
//             onClick={() => handleRemoveAnnotation(id)}
//           />
//         );
//       } else if (type === "cancel") {
//         const style = {
//           position: "absolute",
//           left: `${position.x}%`,
//           top: `${position.y}%`,
//           transform: "translate(-50%, -50%)",
//         };
        
//         return (
//           <img
//             key={id}
//             src={cancelImage}
//             alt="Cross"
//             className="w-6 h-6 cursor-pointer"
//             style={style}
//             onClick={() => handleRemoveAnnotation(id)}
//           />
//         );
//       } else if (type === "comment") {
//         const style = {
//           position: "absolute",
//           left: `${position.x}%`,
//           top: `${position.y}%`,
//           transform: "translate(-50%, -50%)",
//         };
        
//         return (
//           <div
//             key={id}
//             className="p-2 rounded text-xl font-semibold text-red-500 cursor-pointer select-none"
//             style={style}
//             onClick={() => handleRemoveAnnotation(id)}
//           >
//             {text}
//           </div>
//         );
//       } else if (type === "draw" && position.path) {
//         return (
//           <svg
//             key={id}
//             className="absolute top-0 left-0 w-full h-full pointer-events-none"
//             style={{ zIndex: 10, cursor: 'pointer' }}
//             viewBox={`0 0 ${width} ${height}`}
//             preserveAspectRatio="none"
//             onClick={(e) => {
//               // Add click event to remove the entire line
//               e.stopPropagation();
//               handleRemoveAnnotation(id);
//             }}
//           >
//             <polyline
//               points={position.path
//                 .map((p) => `${(p.x * width) / 100},${(p.y * height) / 100}`)
//                 .join(" ")}
//               stroke="red"
//               strokeWidth="2"
//               fill="none"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleRemoveAnnotation(id);
//               }}
//             />
//           </svg>
//         );
//       }
//       return null;
//     };

//     return (
//       <div className="relative mb-8">
//         <div
//           ref={pageRef}
//           className={`relative bg-white shadow-md mx-auto ${selectedTool=="draw" && 'draw-cursor'}`}
//           style={{ width: `${width}px` }}
//           onClick={onPageClick}
//           onMouseDown={selectedTool === "draw" ? handleMouseDown : undefined}
//           onMouseMove={selectedTool === "draw" ? handleMouseMove : undefined}
//           onMouseUp={selectedTool === "draw" ? handleMouseUp : undefined}
//           onMouseLeave={selectedTool === "draw" ? handleMouseUp : undefined}
//           onContextMenu={onPageClick}
//         >
//           {isVisible ? (
//             <>
//               <img
//                 src={imageUrl}
//                 alt={`Page ${pageNumber}`}
//                 style={{
//                   width: "100%",
//                   display: "block",
//                   opacity: isLoaded ? 1 : 0, // Hide image until loaded
//                 }}
//                 loading="lazy"
//                 onLoad={() => setIsLoaded(true)}
//               />
//               {!isLoaded && (
//                 <div className="absolute inset-0">
//                   <PageSkeleton width={width} />
//                 </div>
//               )}
//             </>
//           ) : (
//             <PageSkeleton width={width} pageNumber={pageNumber} />
//           )}
//           {annotations.map(renderAnnotation)}
//           {/* Page number indicator */}
//           {isLoaded && (
//             <div className="text-center py-1 text-gray-600 text-sm font-bold ">
//               Page {pageNumber}
//             </div>
//           )}
//         </div>
//       </div>
//     );

  
//   }
// );

// export default SinglePage;

//?v2.0 (testing draw area crop)
import { memo, useRef, useEffect, useState, useCallback } from "react";
import checkImage from "/check.png";
import cancelImage from "/cross.png";
import PageSkeleton from "../Common/PageSkeleton";

const SinglePage = memo(
  ({
    pageNumber,
    imageUrl,
    width,
    height,
    onPageClick,
    annotations,
    selectedTool,
    handleRemoveAnnotation,
    handleUpdateAnnotation,
    handleDrawAnnotation,
  }) => {
    const pageRef = useRef(null);
    const imageContainerRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const isDrawing = useRef(false);
    const currentPath = useRef([]);
    const currentAnnotationId = useRef(null);

    // Lazy load images using Intersection Observer
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );

      if (pageRef.current) {
        observer.observe(pageRef.current);
      }

      return () => observer.disconnect();
    }, []);

    // Start drawing - only within image bounds
    const handleMouseDown = useCallback(
      (e) => {
        if (selectedTool !== "draw") return;

        e.preventDefault();
        isDrawing.current = true;

        // Make sure we're using the image container bounds
        const rect = imageContainerRef.current.getBoundingClientRect();
        const x = Math.round(((e.clientX - rect.left) / rect.width) * 100 * 10) / 10;
        const y = Math.round(((e.clientY - rect.top) / rect.height) * 100 * 10) / 10;

        // Only start drawing if within bounds
        if (x >= 0 && x <= 100 && y >= 0 && y <= 100) {
          currentPath.current = [{ x, y }];
          
          // Create a temporary annotation ID for this drawing session
          currentAnnotationId.current = `${pageNumber}-${Date.now()}`;
          
          // Initialize the draw annotation with the first point
          handleDrawAnnotation(
            "start", 
            currentAnnotationId.current, 
            pageNumber, 
            [...currentPath.current]
          );
        }
      },
      [selectedTool, pageNumber, handleDrawAnnotation]
    );

    // Continue drawing - constrain to image bounds
    const handleMouseMove = useCallback(
      (e) => {
        if (!isDrawing.current || selectedTool !== "draw") return;

        const rect = imageContainerRef.current.getBoundingClientRect();
        const x = Math.round(((e.clientX - rect.left) / rect.width) * 100 * 10) / 10;
        const y = Math.round(((e.clientY - rect.top) / rect.height) * 100 * 10) / 10;

        // Constrain coordinates to image area (0-100%)
        const constrainedX = Math.max(0, Math.min(100, x));
        const constrainedY = Math.max(0, Math.min(100, y));

        currentPath.current.push({ x: constrainedX, y: constrainedY });
        
        // Update the path in real-time
        handleDrawAnnotation(
          "update", 
          currentAnnotationId.current, 
          pageNumber, 
          [...currentPath.current]
        );
      },
      [selectedTool, handleDrawAnnotation, pageNumber]
    );

    // Stop drawing
    const handleMouseUp = useCallback(() => {
      if (!isDrawing.current || selectedTool !== "draw") return;

      isDrawing.current = false;
      
      if (currentPath.current.length > 1) {
        // Finalize the drawing session
        handleDrawAnnotation(
          "end", 
          currentAnnotationId.current, 
          pageNumber, 
          [...currentPath.current]
        );
      }
      
      currentPath.current = [];
      currentAnnotationId.current = null;
    }, [selectedTool, handleDrawAnnotation, pageNumber]);

    // Render annotations
    const renderAnnotation = (annotation) => {
      const { id, type, position, text } = annotation;
      
      if (type === "check") {
        const style = {
          position: "absolute",
          left: `${position.x}%`,
          top: `${position.y}%`,
          transform: "translate(-50%, -50%)",
          width: `calc(1.5rem * ${width / 800})`,  // Scale icon size based on zoom
          height: `calc(1.5rem * ${width / 800})`,
        };
        
        return (
          <img
            key={id}
            src={checkImage}
            alt="Check"
            className="w-6 h-6 cursor-pointer"
            style={style}
            onClick={() => handleRemoveAnnotation(id)}
          />
        );
      } else if (type === "cancel") {
        const style = {
          position: "absolute",
          left: `${position.x}%`,
          top: `${position.y}%`,
          transform: "translate(-50%, -50%)",
          width: `calc(1.5rem * ${width / 800})`,  // Scale icon size based on zoom
          height: `calc(1.5rem * ${width / 800})`,
        };
        
        return (
          <img
            key={id}
            src={cancelImage}
            alt="Cross"
            className="w-6 h-6 cursor-pointer"
            style={style}
            onClick={() => handleRemoveAnnotation(id)}
          />
        );
      } else if (type === "comment") {
        const style = {
          position: "absolute",
          left: `${position.x}%`,
          top: `${position.y}%`,
          transform: "translate(-50%, -50%)",
          // Scale font size based on container width
          fontSize: `calc(1rem * ${width / 800})`, // Base size adjusted by zoom ratio
        };
        
        return (
          <div
            key={id}
            className="p-2 rounded text-xl font-semibold text-red-500 cursor-pointer select-none"
            style={style}
            onClick={() => handleRemoveAnnotation(id)}
          >
            {text}
          </div>
        );
      } else if (type === "draw" && position.path) {
        return (
          <svg
            key={id}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{ zIndex: 10, cursor: 'pointer' }}
            viewBox="0 0 100 100" // Use percentage-based viewBox
            preserveAspectRatio="none"
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveAnnotation(id);
            }}
          >
            <polyline
              points={position.path
                .map((p) => `${p.x},${p.y}`)
                .join(" ")}
              stroke="red"
              strokeWidth="0.2"
              fill="none"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveAnnotation(id);
              }}
            />
          </svg>
        );
      }
      return null;
    };

    return (
      <div className="relative mb-8" ref={pageRef}>
        {/* Page container */}
        <div className="flex flex-col bg-white shadow-md mx-auto" style={{ width: `${width}px` }}>
          {/* Image container - drawing events attached here */}
          <div 
            ref={imageContainerRef}
            className={`relative ${selectedTool === "draw" ? 'draw-cursor' : ''}`}
            style={{ width: '100%', aspectRatio: '1/1.414' }} // A4 aspect ratio
            onClick={onPageClick}
            onMouseDown={selectedTool === "draw" ? handleMouseDown : undefined}
            onMouseMove={selectedTool === "draw" ? handleMouseMove : undefined}
            onMouseUp={selectedTool === "draw" ? handleMouseUp : undefined}
            onMouseLeave={selectedTool === "draw" ? handleMouseUp : undefined}
            onContextMenu={onPageClick}
          >
            {isVisible ? (
              <>
                <img
                  src={imageUrl}
                  alt={`Page ${pageNumber}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "block",
                    opacity: isLoaded ? 1 : 0,
                  }}
                  loading="lazy"
                  onLoad={() => setIsLoaded(true)}
                />
                {!isLoaded && (
                  <div className="absolute inset-0">
                    <PageSkeleton width={width} />
                  </div>
                )}
              </>
            ) : (
              <PageSkeleton width={width} pageNumber={pageNumber} />
            )}
            {/* Annotations contained within image area */}
            {annotations.map(renderAnnotation)}
          </div>
          
          {/* Page number - separate from image container */}
          {isLoaded && (
            <div className="text-center py-1 text-gray-600 text-sm font-bold">
              Page {pageNumber}
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default SinglePage;


