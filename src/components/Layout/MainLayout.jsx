import { useEffect } from 'react';
import Header from '../Common/Header';
import Toolbar from '../AnnotationTools/Toolbar';
import EvaluationPanel from '../EvaluationPanel/EvaluationPanel';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorComponent from '../Common/ErrorComponent';
import PDFViewer from '../PdfViewer/PdfViewer';
import ImageViewer from '../PdfViewer/ImageViewer';

function MainLayout({
  marks,
  setMarks,
  totalMarks,
  annotations,
  setAnnotations,
  isAllAnnotated,
  setIsAllAnnotated,
  selectedCopy,
  setSelectedCopy,
  copies,
  pdfUrl,
  selectedSubject,
  setSelectedSubject,
  handleMarkChange,
  handleAnnotate,
  handleRemoveAnnotation,
  handleRemoveLastAnnotation,
  handleSubmit,
  loading,
  error,
  subjectFromURL,
}) {
  useEffect(() => {
    if (subjectFromURL) {
      setSelectedSubject(subjectFromURL);
    }
  }, [subjectFromURL, setSelectedSubject]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorComponent message="Failed to load data." error={{ message: error }} />;

  return (
    <div className="grid grid-rows-[auto_1fr] h-screen">
      {/* Header */}
      <Header
        selectedCopy={selectedCopy}
        setSelectedCopy={setSelectedCopy}
        copies={copies}
        selectedSubject={selectedSubject}
        handleSubmit={handleSubmit}
      />

      {/* Main Content */}
      <div className="grid grid-cols-[5%_70%_25%] h-full overflow-hidden">
        {/* Annotation Tools */}
        <div className="flex flex-col items-center bg-white border-r border-gray-200 shadow-sm">
          <Toolbar
            onAnnotate={handleAnnotate}
            onRemoveAnnotation={handleRemoveAnnotation}
            onRemoveLastAnnotation={handleRemoveLastAnnotation}
          />
        </div>

        {/* PDF Viewer */}
        {/* <div className="bg-gray-100 overflow-y-auto px-8 py-4">
          <PDFViewer
            pdfUrl={pdfUrl}
            annotations={annotations}
            setAnnotations={setAnnotations}
            isAllAnnotated={isAllAnnotated}
            setIsAllAnnotated={setIsAllAnnotated}
            handleAnnotate={handleAnnotate}
            handleRemoveAnnotation={handleRemoveAnnotation}
          />
        </div> */}

        {/* Image Viewer */}
        <div className="bg-gray-100 overflow-y-auto px-8 py-4">
          <ImageViewer
            copyId="44054016"
            annotations={annotations}
            selectedTool={selectedTool}
            handleAnnotate={handleAnnotate}
            handleRemoveAnnotation={handleRemoveAnnotation}
            handleUpdateAnnotation={handleUpdateAnnotation}
          />
        </div>

        {/* Evaluation Panel */}
        <div className="bg-white border-l border-gray-200 p-4 flex flex-col">
          <EvaluationPanel
            marks={marks}
            setMarks={setMarks}
            totalMarks={totalMarks}
            handleMarkChange={handleMarkChange}
            annotations={annotations}
            isAllAnnotated={isAllAnnotated}
            handleSubmit={handleSubmit}
            selectedCopy={selectedCopy}
          />
        </div>
      </div>
    </div>
  );
}

export default MainLayout;