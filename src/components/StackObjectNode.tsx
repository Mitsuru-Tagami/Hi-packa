import React, { useRef, useState, useEffect } from 'react';
import { Group, Rect, Text, Transformer, Image } from 'react-konva';
import type { StackObject, BorderWidth } from '../types';

interface StackObjectNodeProps {
  object: StackObject;
  isSelected: boolean;
  onSelect: () => void;
  onUpdateObject: (object: StackObject) => void;
  isRunMode: boolean;
  onSwitchCard: (cardId: string) => void;
  onOpenUrl: (url: string) => void;
  executeScript: (script: string) => void;
}

// Mapping for BorderWidth to pixel values
const borderWidthMap: Record<BorderWidth, number> = {
  none: 0,
  thin: 1,
  medium: 2,
  thick: 4,
};

export const StackObjectNode: React.FC<StackObjectNodeProps> = ({ object, isSelected, onSelect, onUpdateObject, isRunMode, onSwitchCard, onOpenUrl, executeScript }) => {
  const shapeRef = useRef<any>();
  const trRef = useRef<any>();

  const [img, setImg] = useState<HTMLImageElement | undefined>(undefined);

  useEffect(() => {
    if (object.type === 'image' && object.src) {
      const newImg = new window.Image();
      newImg.src = object.src;
      newImg.onload = () => {
        setImg(newImg);
      };
      newImg.onerror = () => {
        setImg(undefined); // Clear image on error
        console.error('Failed to load image:', object.src);
      };
    } else {
      setImg(undefined);
    }
  }, [object.type, object.src]);

  useEffect(() => {
    if (isSelected) {
      // attach transformer to the node
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const { x, y, width, height, type, text, ...rest } = object;

  // Use object.borderColor if available, otherwise default to black
  const currentStrokeColor = object.borderColor || '#000000';
  // Use object.borderWidth if available, otherwise default to 'none'
  const currentStrokeWidth = borderWidthMap[object.borderWidth || 'none'];

  // Highlight color/width if selected
  const strokeColor = isSelected ? 'blue' : currentStrokeColor;
  const strokeWidth = isSelected ? 3 : currentStrokeWidth;

  // Determine fill color based on object.backgroundColor
  const fillColor = object.backgroundColor === 'transparent' ? 'rgba(0,0,0,0)' : (object.backgroundColor || '#ffffff');

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
        } else if (object.action === 'openUrl' && object.src) {
          onOpenUrl(object.src);
        } else if (object.script) {
          executeScript(object.script);
        }
      }
    } else { // Edit mode
      onSelect();
    }
  };

  let imageX = 0;
  let imageY = 0;
  let imageWidth = width;
  let imageHeight = height;

  if (object.type === 'image' && img && object.objectFit === 'contain') {
    const aspectRatio = img.width / img.height;
    const containerAspectRatio = width / height;

    if (aspectRatio > containerAspectRatio) {
      imageWidth = width;
      imageHeight = width / aspectRatio;
      imageY = (height - imageHeight) / 2;
    } else {
      imageHeight = height;
      imageWidth = height * aspectRatio;
      imageX = (width - imageWidth) / 2;
    }
  }

  return (
    <React.Fragment>
      <Group
        x={x}
        y={y}
        width={width}
        height={height}
        onClick={handleClick}
        onTap={handleClick}
        draggable={!isRunMode}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
        ref={shapeRef}
      >
        {/* Common background/border for all objects */}
        <Rect
          width={width}
          height={height}
          fill={fillColor} // Use dynamic fillColor
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
          fill={object.color || '#000'}
          textDecoration={rest.textDecoration}
        />

        {/* Render image content */}
        {object.type === 'image' && img && (
          <Image
            image={img}
            x={imageX}
            y={imageY}
            width={imageWidth}
            height={imageHeight}
          />
        )}
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