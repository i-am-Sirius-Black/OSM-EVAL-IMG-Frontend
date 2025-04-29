import { memo } from 'react';
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

const Toolbar = memo(({ selectedTool, setSelectedTool, handleRemoveLastAnnotation, handleReset }) => {
  const tools = [
    { tool: 'mouse', Icon: MouseIcon, color: 'blue', description: 'Mouse (Left: ✓, Right: ✕)' },
    { tool: 'check', Icon: DoneIcon, color: 'green', description: 'Check' },
    { tool: 'cancel', Icon: ClearIcon, color: 'red', description: 'Cross' },
    { tool: 'comment', Icon: EditNoteIcon, color: 'gray', description: 'Comment' },
    { tool: 'draw', Icon: DrawIcon, color: 'purple', description: 'Pen' },
    { tool: 'erase', Icon: DeleteIcon, color: 'red', description: 'Erase' },
    { tool: 'undo', Icon: UndoIcon, color: 'yellow', description: 'Undo Last' },
  ];
  
  

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
          onSelect={() => {
            if (tool === 'undo') {
              handleRemoveLastAnnotation();
              return;
            }
            setSelectedTool(selectedTool === tool ? null : tool);
          }}
        />
      ))}
   


        <div className="absolute bottom-0 text-center text-xs text-gray-500 mt-2">
          Zoom: <span className="font-medium">Ctrl+Scroll</span>
        </div>
    </div>
    </>
  );

});

export default Toolbar;