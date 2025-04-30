import { memo, useState } from 'react';
import ToolButton from './ToolButton';
import {
  Mouse as MouseIcon,
  Done as DoneIcon,
  Clear as ClearIcon,
  EditNote as EditNoteIcon,
  Delete as DeleteIcon,
  Undo as UndoIcon,
} from '@mui/icons-material';
import DrawIcon from '@mui/icons-material/Draw';
import AutoFixHighSharpIcon from '@mui/icons-material/AutoFixHighSharp';
import ResetConfirmationModal from './Modal/ResetConfirmationModal';

const Toolbar = memo(({ selectedTool, setSelectedTool, handleRemoveLastAnnotation, handleReset }) => {
  const [showResetModal, setShowResetModal] = useState(false);
 
  const tools = [
    { tool: 'mouse', Icon: MouseIcon, color: 'blue', description: 'Mouse (Left: ✓, Right: ✕)' },
    { tool: 'check', Icon: DoneIcon, color: 'green', description: 'Check' },
    { tool: 'cancel', Icon: ClearIcon, color: 'red', description: 'Cross' },
    { tool: 'comment', Icon: EditNoteIcon, color: 'gray', description: 'Comment' },
    { tool: 'draw', Icon: DrawIcon, color: 'purple', description: 'Pen' },
    { tool: 'erase', Icon: DeleteIcon, color: 'deleteRed', description: 'Del' },
    { tool: 'undo', Icon: UndoIcon, color: 'yellow', description: 'Undo Last' },
    { tool: 'reset', Icon: AutoFixHighSharpIcon, color: 'pink', description: 'Reset All' },
  ];
  
  const handleToolClick = (tool) => {
    if (tool === 'undo') {
      handleRemoveLastAnnotation();
      return;
    }
    
    if (tool === 'reset') {
      setShowResetModal(true);
      return;
    }
    
    setSelectedTool(selectedTool === tool ? null : tool);
  };


  const handleConfirmReset = () => {
    handleReset();
    setShowResetModal(false);
    setSelectedTool(null); // Unselect the tool after reset
  };
  
  const handleCancelReset = () => {
    setShowResetModal(false);
    setSelectedTool(null); // Unselect the tool if canceled
  };

  return (
    <>
    <div className="flex flex-col items-center gap-3 z-11 mt-10">
      {tools.map(({ tool, Icon, color, description }) => (
        <ToolButton
          key={tool}
          tool={tool}
          Icon={Icon}
          color={color}
          description={description}
          isSelected={selectedTool === tool}
          onSelect={() => handleToolClick(tool)}
        />
      ))}

        <div className="absolute bottom-0 text-center text-xs text-gray-500 mt-2">
          Zoom: <span className="font-medium">Ctrl+Scroll</span>
        </div>
    </div>
    <ResetConfirmationModal 
        isOpen={showResetModal}
        onClose={handleCancelReset}
        onConfirm={handleConfirmReset}
      />
    </>
  );

});

export default Toolbar;