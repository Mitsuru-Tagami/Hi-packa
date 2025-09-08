import React from 'react';
import { Group, Rect, Text } from 'react-konva';
import type { StackObject } from '../types';

interface StackObjectNodeProps {
  object: StackObject;
}

const StackObjectNode: React.FC<StackObjectNodeProps> = ({ object }) => {
  const { x, y, width, height, type, text, ...rest } = object;

  // A Group will contain all parts of an object
  return (
    <Group x={x} y={y}>
      {/* Common background/border for all objects */}
      <Rect
        width={width}
        height={height}
        fill="#ffffff"
        stroke="#000000"
        strokeWidth={1} // Simplified for now
      />
      {/* Render text content, common for buttons and text boxes */}
      <Text
        text={text}
        width={width}
        height={height}
        align={rest.textAlign}
        verticalAlign="middle"
        padding={5}
        fontSize={Number(rest.fontSize?.replace('px', '')) || 16}
        fontStyle={rest.fontStyle}
        fontFamily={rest.fontFamily || 'sans-serif'}
        fill={rest.color || '#000'}
        textDecoration={rest.textDecoration}
      />
      {/* We can add type-specific renderings here later (e.g., for images) */}
    </Group>
  );
};

export default StackObjectNode;
