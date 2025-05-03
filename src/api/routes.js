/**
 * Centralized API route definitions
 * 
 * This file serves as a single source of truth for all API endpoints used in the application.
 * Any changes to API routes only need to be made here, making maintenance much easier.
 * 
 * Conventions:
 * - Path variables: Added via functions that accept parameters (e.g., (id) => `/api/resource/${id}`)
 * - Query parameters: Added when making the API call
 * - Request body: Added when making the API call
 */

const API_ROUTES = {
    // Authentication routes
    AUTH: {
      REGISTER: '/auth/register',
      LOGIN: '/auth/login',
      ADMIN_LOGIN: '/admin-login', //: not made yet
      CHECK: '/auth/check',
      GET_NEW_UID: '/auth/uid/new',
    },
  
    // Exam routes
    EXAMS: {
      GET_ALL: '/api/exams',
    },
    
    // Subject routes
    SUBJECTS: {
      GET_BY_EXAM_ID: (examId) => `/api/exams/${examId}/subjects`, // - Get subjects for an exam
    },
    
    // Copy routes
    COPIES: {
      GET_BY_SUBJECT: '/api/copies/subject',
      GET_BY_SUBJECT_ID: (subjectId) => `/api/copies/subject/${subjectId}`, //!not available yet
      SEARCH: '/api/copies/search',
      GET_IMAGE: '/api/copies/image',
      DOWNLOAD_PDF: (copyId) => `/api/copies/pdf/${copyId}`,
      GET_ANNOTATED: '/api/copies/annotated',
      GET_REJECTION_HISTORY: (copyId) => `/api/copies/${copyId}/rejection-history`, //: not made yet
    },
    
    // Evaluation routes
    EVALUATION: {
    //   GET_COPY: (copyId) => `/api/evaluate/${copyId}`, //: not made yet
      SAVE: '/api/evaluations',
    },
  
    // Annotation routes
    ANNOTATIONS: {
      SAVE: '/api/annotations',
      GET_BY_COPY_ID: (copyId) => `/api/annotations/${copyId}`, //get annotations by copy ID
    },
  
    // Copy management routes
    COPY_MANAGEMENT: {
      REJECT: '/api/evaluations/reject',
      UNREJECT: '/api/evaluations/unreject',
      GET_REJECTED: '/api/evaluations/rejected',
    },
  };
  
  export default API_ROUTES;