import { memo, useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import SinglePage from '../SinglePage';
import LoadingSpinner from '../../Common/LoadingSpinner';
// import checkImage from '/assets/icons/check.png';
// import cancelImage from '/cross.png';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PDFViewer = memo(
  ({ pdfUrl, annotations, selectedTool, handleAnnotate, handleRemoveAnnotation, handleUpdateAnnotation }) => {
    const [numPages, setNumPages] = useState(null);
    const [zoom, setZoom] = useState(1);
    const [containerWidth, setContainerWidth] = useState(0);
    const [commentPosition, setCommentPosition] = useState(null);
    const [commentText, setCommentText] = useState('');
    const containerRef = useRef(null);

    const annotationsByPage = useMemo(() => {
      const map = {};
      annotations.forEach((a) => {
        if (!map[a.page]) map[a.page] = [];
        map[a.page].push(a);
      });
      return map;
    }, [annotations]);

    useEffect(() => {
      const updateWidth = () => {
        if (containerRef.current) {
          setContainerWidth(containerRef.current.clientWidth * 0.95);
        }
      };
      updateWidth();
      window.addEventListener('resize', updateWidth);
      return () => window.removeEventListener('resize', updateWidth);
    }, []);

    const handleLoadSuccess = useCallback(({ numPages }) => {
      setNumPages(numPages);
    }, []);

    const handlePageClick = useCallback(
      (e, pageNumber) => {
        e.preventDefault();
        const rect = e.currentTarget.getBoundingClientRect();
        const x = Math.round(((e.clientX - rect.left) / rect.width) * 100 * 10) / 10;
        const y = Math.round(((e.clientY - rect.top) / rect.height) * 100 * 10) / 10;

        const pageAnnotations = annotationsByPage[pageNumber] || [];
        const hasAnnotation = pageAnnotations.some(
          (a) => Math.abs(a.position.x - x) < 5 && Math.abs(a.position.y - y) < 5
        );

        if (hasAnnotation) return;

        if (selectedTool === 'comment') {
          setCommentPosition({ x: e.clientX, y: e.clientY, pageNumber });
        } else if (selectedTool === 'check' || selectedTool === 'cancel') {
          handleAnnotate(selectedTool, pageNumber, { x, y });
        } else if (selectedTool === 'mouse') {
          handleAnnotate(e.type === 'contextmenu' ? 'cancel' : 'check', pageNumber, { x, y });
        } else if (selectedTool === 'draw') {
          handleAnnotate('draw', pageNumber, { x, y, path: [{ x, y }] });
        }
      },
      [selectedTool, annotationsByPage, handleAnnotate]
    );

    const handleCommentSubmit = useCallback(() => {
      if (!commentText || !commentPosition) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.round(((commentPosition.x - rect.left) / rect.width) * 100 * 10) / 10;
      const y = Math.round(((commentPosition.y - rect.top) / rect.height) * 100 * 10) / 10;
      handleAnnotate('comment', commentPosition.pageNumber, { x, y, text: commentText });
      setCommentPosition(null);
      setCommentText('');
    }, [commentText, commentPosition, handleAnnotate]);


    const pages = useMemo(
      () =>
        Array.from({ length: numPages || 0 }, (_, i) => {
          const pageNumber = i + 1;
          return (
            <SinglePage
              key={pageNumber}
              pageNumber={pageNumber}
              width={containerWidth * zoom}
              onPageClick={(e) => handlePageClick(e, pageNumber)}
              annotations={annotationsByPage[pageNumber] || []}
              selectedTool={selectedTool}
              handleRemoveAnnotation={handleRemoveAnnotation}
              handleUpdateAnnotation={handleUpdateAnnotation}
            />
          );
        }),
      [
        numPages,
        containerWidth,
        zoom,
        handlePageClick,
        annotationsByPage,
        selectedTool,
        handleRemoveAnnotation,
        handleUpdateAnnotation,
      ]
    );

    return (
      <div ref={containerRef} className="w-full h-full bg-white rounded-lg shadow-sm overflow-y-auto">
        {/* Zoom Controls */}
        <div className="sticky top-0 z-10 bg-white p-2 border-b border-gray-200 flex justify-end gap-2">
          <button
            onClick={() => setZoom((prev) => Math.max(0.5, prev - 0.1))}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
          >
            -
          </button>
          <span className="px-3 py-1 bg-gray-100 rounded text-sm">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom((prev) => Math.min(2, prev + 0.1))}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
          >
            +
          </button>
        </div>
        <Document file={pdfUrl} onLoadSuccess={handleLoadSuccess} loading={<LoadingSpinner />}>
          {pages}
        </Document>
        {commentPosition && (
          <div
            className="absolute bg-white border border-gray-200 rounded-md shadow-lg p-3 flex gap-2 z-50"
            style={{ top: commentPosition.y, left: commentPosition.x }}
          >
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit()}
              placeholder="Enter comment"
              className="px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-40"
              autoFocus
            />
            <button
              onClick={handleCommentSubmit}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            >
              Add
            </button>
            <button
              onClick={() => setCommentPosition(null)}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    );
  }
);

export default PDFViewer;

