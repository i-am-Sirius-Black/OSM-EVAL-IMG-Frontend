export default function formatDateTime(isoString, format = 'datetime') {
  const date = new Date(isoString);
  
  const dateOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };
  
  const timeOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };

  switch (format.toLowerCase()) {
    case 'date':
      return date.toLocaleDateString('en-US', dateOptions); // "May 20, 2025"
    case 'time':
      return date.toLocaleTimeString('en-US', timeOptions); // "5:50 AM"
    case 'datetime':
    default:
      return `${date.toLocaleDateString('en-US', dateOptions)}, ${date.toLocaleTimeString('en-US', timeOptions)}`; // "May 20, 2025, 5:50 AM"
  }
}