// import { useState } from 'react';
// import CloseIcon from '@mui/icons-material/Close';


// function ToolButton({ tool, Icon, color, description, isSelected, onSelect }) {
//   const [showTooltip, setShowTooltip] = useState(false);

//   return (
//     <div className="relative">
//       <button
//         onClick={onSelect}
//         onMouseEnter={() => setShowTooltip(true)}
//         onMouseLeave={() => setShowTooltip(false)}
//         className={`w-10 h-10 flex items-center justify-center rounded-full bg-${color}-500 hover:bg-${color}-600 active:bg-${color}-700 text-white transition-transform duration-200 shadow-md ${
//           isSelected && tool !== 'undo' ? `ring-2 ring-offset-2 ring-${color}-400 scale-95` : ''
//         }`}
//       >
//         <Icon fontSize="small" />
//       </button>
//       {isSelected && tool !== 'undo' && (
//         <button
//           onClick={() => onSelect()}
//           className="absolute -top-1 -right-1 w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-400 shadow-sm"
//         >
//           <CloseIcon style={{ fontSize: '12px' }} />
//         </button>
//       )}
//       {showTooltip && (
//         <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-lg z-10">
//           {description}
//           <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-800 rotate-45" />
//         </div>
//       )}
//     </div>
//   );
// }

// export default ToolButton;






import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';

function ToolButton({ tool, Icon, color, description, isSelected, onSelect }) {
  const [showTooltip, setShowTooltip] = useState(false);

  // Map color props to Tailwind classes
  const colorClasses = {
    blue: {
      bg: 'bg-blue-500',
      hover: 'hover:bg-blue-600',
      active: 'active:bg-blue-700',
      ring: 'ring-blue-400'
    },
    green: {
      bg: 'bg-green-500',
      hover: 'hover:bg-green-600',
      active: 'active:bg-green-700',
      ring: 'ring-green-400'
    },
    red: {
      bg: 'bg-red-500',
      hover: 'hover:bg-red-600',
      active: 'active:bg-red-700',
      ring: 'ring-red-400'
    },
    gray: {
      bg: 'bg-gray-500',
      hover: 'hover:bg-gray-600',
      active: 'active:bg-gray-700',
      ring: 'ring-gray-400'
    },
    purple: {
      bg: 'bg-purple-500',
      hover: 'hover:bg-purple-600',
      active: 'active:bg-purple-700',
      ring: 'ring-purple-400'
    },
    yellow: {
      bg: 'bg-yellow-500',
      hover: 'hover:bg-yellow-600',
      active: 'active:bg-yellow-700',
      ring: 'ring-yellow-400'
    }
  };

  // Default to blue if color not found
  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <div className="relative">
      <button
        onClick={onSelect}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`w-10 h-10 flex items-center justify-center rounded-full ${colors.bg} ${colors.hover} ${colors.active} text-white transition-transform duration-200 shadow-md ${
          isSelected && tool !== 'undo' ? `ring-2 ring-offset-2 ${colors.ring} scale-95` : ''
        }`}
      >
        <Icon fontSize="small" />
      </button>
      {isSelected && tool !== 'undo' && (
        <button
          onClick={() => onSelect()}
          className="absolute -top-1 -right-1 w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-400 shadow-sm"
        >
          <CloseIcon style={{ fontSize: '12px' }} />
        </button>
      )}
      {showTooltip && (
        <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-lg z-10">
          {description}
          <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-800 rotate-45" />
        </div>
      )}
    </div>
  );
}

export default ToolButton;