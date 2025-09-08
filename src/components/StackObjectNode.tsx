import React, { useRef, useEffect } from 'react';
import { Group, Rect, Text, Transformer } from 'react-konva';
import type { StackObject } from '../types';

interface StackObjectNodeProps {
  object: StackObject;
  isSelected: boolean;
  onSelect: () => void;
  onUpdateObject: (object: StackObject) => void;
  isRunMode: boolean;
  onSwitchCard: (cardId: string) => void;
  onOpenUrl: (url: string) => void;
}

const StackObjectNode: React.FC<StackObjectNodeProps> = ({ object, isSelected, onSelect, onUpdateObject, isRunMode, onSwitchCard, onOpenUrl }) => {
  const shapeRef = useRef<any>();
  const trRef = useRef<any>();

  useEffect(() => {
    if (isSelected) {
      // attach transformer to the node
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const { x, y, width, height, type, text, ...rest } = object;

  const strokeColor = isSelected ? 'blue' : '#000000';
  const strokeWidth = isSelected ? 3 : 1;

  const handleDragEnd = (e: any) => {
    onUpdateObject({
      ...object,
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  const handleTransformEnd = (e: any) => {
    const node = shapeRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    node.scaleX(1);
    node.scaleY(1);

    onUpdateObject({
      ...object,
      x: node.x(),
      y: node.y(),
      width: Math.max(5, node.width() * scaleX),
      height: Math.max(5, node.height() * scaleY),
    });
  };

  const handleClick = () => {
    if (isRunMode) {
      if (object.type === 'button') {
        if (object.action === 'jumpToCard' && object.jumpToCardId) {
          onSwitchCard(object.jumpToCardId);
        } else if (object.action === 'openUrl' && object.src) { // Assuming object.src can be a URL for buttons
          onOpenUrl(object.src);
        } else if (object.script) {
          // This will be handled in the next sub-task (custom script execution)
          console.log('Custom script execution triggered:', object.script);
        }
      }
    } else { // Edit mode
      onSelect();
    }
  };

  return (
    <React.Fragment>
      <Group
        x={x}
        y={y}
        width={width}
        height={height}
        onClick={handleClick} // Use the new handleClick
        onTap={handleClick} // Use the new handleClick
        draggable={!isRunMode} // Only draggable in edit mode
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
        ref={shapeRef}
      >
        {/* Common background/border for all objects */}
        <Rect
          width={width}
          height={height}
          fill="#ffffff"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
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
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};

export default StackObjectNode;