import React from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import type { Stack, StackObject } from '../types';
import StackObjectNode from './StackObjectNode';

interface CardCanvasProps {
  stack: Stack;
  selectedObject: StackObject | null;
  onSelectObject: (object: StackObject | null) => void;
  onUpdateObject: (object: StackObject) => void;
}

const CardCanvas: React.FC<CardCanvasProps> = ({ stack, selectedObject, onSelectObject, onUpdateObject }) => {
  const currentCard = stack.cards.find(card => card.id === stack.currentCardId);

  return (
    <Stage
      width={window.innerWidth * 0.5}
      height={window.innerHeight}
    >
      <Layer>
        {/* Canvas Background */}
        <Rect
          x={0}
          y={0}
          width={window.innerWidth * 0.5}
          height={window.innerHeight}
          fill="#f0f0f0"
          onClick={() => onSelectObject(null)}
        />
        {/* Render all objects on the current card */}
        {currentCard?.objects.map(obj => (
          <StackObjectNode
            key={obj.id}
            object={obj}
            isSelected={selectedObject?.id === obj.id}
            onSelect={() => onSelectObject(obj)}
            onUpdateObject={onUpdateObject}
          />
        ))}
      </Layer>
    </Stage>
  );
};

export default CardCanvas;
