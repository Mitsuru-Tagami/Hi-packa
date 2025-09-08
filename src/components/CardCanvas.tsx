import React, { useState } from 'react'; // Import useState
import { Stage, Layer, Rect } from 'react-konva';
import type { Stack, StackObject, ObjectType } from '../types'; // Import ObjectType
import { StackObjectNode } from './StackObjectNode';
import Menu from '@mui/material/Menu'; // Import Menu
import MenuItem from '@mui/material/MenuItem'; // Import MenuItem

interface CardCanvasProps {
  stack: Stack;
  selectedObject: StackObject | null;
  onSelectObject: (object: StackObject | null) => void;
  onUpdateObject: (object: StackObject) => void;
  isRunMode: boolean;
  onSwitchCard: (cardId: string) => void;
  onOpenUrl: (url: string) => void;
  executeScript: (script: string) => void;
  onAddObject: (type: ObjectType, x: number, y: number) => void; // New prop
}

const CardCanvas: React.FC<CardCanvasProps> = ({
  stack,
  selectedObject,
  onSelectObject,
  onUpdateObject,
  isRunMode,
  onSwitchCard,
  onOpenUrl,
  executeScript,
  onAddObject, // Destructure new prop
}) => {
  const currentCard = stack.cards.find(card => card.id === stack.currentCardId);

  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number } | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // For MUI Menu anchor

  const handleContextMenu = (e: any) => {
    e.evt.preventDefault(); // Prevent default browser context menu
    if (isRunMode) return; // Disable context menu in run mode

    // Get click position relative to the stage
    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();
    setContextMenuPos({ x: pointerPosition.x, y: pointerPosition.y });

    // Set anchor for MUI Menu
    setAnchorEl(e.evt.currentTarget); // Use currentTarget for the element that the event listener was attached to
  };

  const handleCloseContextMenu = () => {
    setContextMenuPos(null);
    setAnchorEl(null);
  };

  const handleAddObjectMenuItem = (type: ObjectType) => {
    if (contextMenuPos) {
      onAddObject(type, contextMenuPos.x, contextMenuPos.y);
    }
    handleCloseContextMenu();
  };

  return (
    <React.Fragment>
      <Stage
        width={window.innerWidth * 0.5}
        height={window.innerHeight}
        onContextMenu={handleContextMenu} // Add context menu handler
      >
        <Layer>
          {/* Canvas Background */}
          <Rect
            x={0}
            y={0}
            width={window.innerWidth * 0.5}
            height={window.innerHeight}
            fill="#f0f0f0"
            onClick={() => !isRunMode && onSelectObject(null)}
          />
          {/* Render all objects on the current card */}
          {currentCard?.objects.map(obj => (
            <StackObjectNode
              key={obj.id}
              object={obj}
              isSelected={!isRunMode && selectedObject?.id === obj.id}
              onSelect={() => !isRunMode && onSelectObject(obj)}
              onUpdateObject={onUpdateObject}
              isRunMode={isRunMode}
              onSwitchCard={onSwitchCard}
              onOpenUrl={onOpenUrl}
              executeScript={executeScript}
            />
          ))}
        </Layer>
      </Stage>
      {/* Material-UI Context Menu */}
      <Menu
        open={Boolean(anchorEl)} // Open if anchorEl is not null
        onClose={handleCloseContextMenu}
        anchorReference="anchorPosition"
        anchorPosition={ // Use contextMenuPos for positioning
          contextMenuPos ? { top: contextMenuPos.y, left: contextMenuPos.x } : undefined
        }
      >
        <MenuItem onClick={() => handleAddObjectMenuItem('button')}>Add Button</MenuItem>
        <MenuItem onClick={() => handleAddObjectMenuItem('text')}>Add Text Box</MenuItem>
        <MenuItem onClick={() => handleAddObjectMenuItem('image')}>Add Image</MenuItem>
      </Menu>
    </React.Fragment>
  );
};

export default CardCanvas;