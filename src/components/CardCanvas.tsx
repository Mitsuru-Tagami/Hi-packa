import React from 'react';
import { Stage, Layer, Rect, Text } from 'react-konva';
import { Stack } from '../types';

interface CardCanvasProps {
  stack: Stack;
}

const CardCanvas: React.FC<CardCanvasProps> = ({ stack }) => {
  // For now, just log the received data
  console.log('CardCanvas received stack:', stack);

  const currentCard = stack.cards.find(card => card.id === stack.currentCardId);

  return (
    <Stage width={window.innerWidth * 0.5} height={window.innerHeight}>
      <Layer>
        <Rect
          x={0}
          y={0}
          width={window.innerWidth * 0.5}
          height={window.innerHeight}
          fill="#f0f0f0"
        />
        <Text text={`Current Card: ${currentCard?.name}`} x={20} y={20} />
        {/* We will render the objects of the current card here in a later step */}
      </Layer>
    </Stage>
  );
};

export default CardCanvas;