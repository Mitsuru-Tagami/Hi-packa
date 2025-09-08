import React from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import type { Stack, StackObject } from '../types';
import StackObjectNode from './StackObjectNode';

interface CardCanvasProps {
  stack: Stack;
  selectedObject: StackObject | null;
  onSelectObject: (object: StackObject | null) => void;
  onUpdateObject: (object: StackObject) => void;
  isRunMode: boolean;
  onSwitchCard: (cardId: string) => void; // Add onSwitchCard to props
  onOpenUrl: (url: string) => void;
}

const CardCanvas: React.FC<CardCanvasProps> = ({ stack, selectedObject, onSelectObject, onUpdateObject, isRunMode, onSwitchCard, onOpenUrl }) => {
  const currentCard = stack.cards.find(card => card.id === stack.currentCardId);

  const handleCanvasClick = (e: any) => {
    // Deselect object if clicking on the canvas background, only in edit mode
    if (!isRunMode && e.target === e.target.getStage()) {
      onSelectObject(null);
    }
  };

  return (
    <Stage
      width={window.innerWidth * 0.5}
      height={window.innerHeight}
      onClick={handleCanvasClick}
    >
      <Layer>
        {/* Canvas Background */}
        <Rect
          x={0}
          y={0}
          width={window.innerWidth * 0.5}
          height={window.innerHeight}
          fill="#f0f0f0"
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
            onSwitchCard={onSwitchCard} // Corrected: Pass onSwitchCard from props
            onOpenUrl={onOpenUrl}
          />
        ))}
      </Layer>
    </Stage>
  );
};

export default CardCanvas;
