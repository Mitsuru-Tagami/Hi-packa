import React from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import type { Stack } from '../types';
import StackObjectNode from './StackObjectNode';

interface CardCanvasProps {
  stack: Stack;
}

const CardCanvas: React.FC<CardCanvasProps> = ({ stack }) => {
  const currentCard = stack.cards.find(card => card.id === stack.currentCardId);

  return (
    <Stage width={window.innerWidth * 0.5} height={window.innerHeight}>
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
          <StackObjectNode key={obj.id} object={obj} />
        ))}
      </Layer>
    </Stage>
  );
};

export default CardCanvas;