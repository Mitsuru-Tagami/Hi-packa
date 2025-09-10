import React, { useRef, useState, useEffect, useCallback } from 'react';
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

// ユーティリティ関数
const parseFontSize = (fontSize: string | undefined): number => {
  if (!fontSize) return 16;
  const parsed = parseInt(fontSize.replace(/px|em|rem|pt/, ''), 10);
  return isNaN(parsed) ? 16 : Math.max(8, parsed); // 最小8px
};

const calculateImageDimensions = (
  img: HTMLImageElement,
  containerWidth: number,
  containerHeight: number,
  objectFit: 'contain' | 'fill' = 'contain'
): { x: number; y: number; width: number; height: number } => {
  if (objectFit === 'fill') {
    return { x: 0, y: 0, width: containerWidth, height: containerHeight };
  }

  // contain mode
  const aspectRatio = img.width / img.height;
  const containerAspectRatio = containerWidth / containerHeight;

  if (aspectRatio > containerAspectRatio) {
    const imageWidth = containerWidth;
    const imageHeight = containerWidth / aspectRatio;
    return {
      x: 0,
      y: (containerHeight - imageHeight) / 2,
      width: imageWidth,
      height: imageHeight,
    };
  } else {
    const imageHeight = containerHeight;
    const imageWidth = containerHeight * aspectRatio;
    return {
      x: (containerWidth - imageWidth) / 2,
      y: 0,
      width: imageWidth,
      height: imageHeight,
    };
  }
};

export const StackObjectNode: React.FC<StackObjectNodeProps> = ({ 
  object, 
  isSelected, 
  onSelect, 
  onUpdateObject, 
  isRunMode, 
  onSwitchCard, 
  onOpenUrl, 
  executeScript 
}) => {
  const shapeRef = useRef<any>();
  const trRef = useRef<any>();
  const [img, setImg] = useState<HTMLImageElement | undefined>(undefined);

  // Image loading effect with cleanup
  useEffect(() => {
    if (object.type !== 'image' || !object.src) {
      setImg(undefined);
      return;
    }

    const newImg = new window.Image();
    let isCancelled = false;

    const handleLoad = () => {
      if (!isCancelled) {
        setImg(newImg);
      }
    };

    const handleError = () => {
      if (!isCancelled) {
        setImg(undefined);
        console.error('Failed to load image:', object.src);
      }
    };

    newImg.onload = handleLoad;
    newImg.onerror = handleError;
    newImg.src = object.src;

    // Cleanup function
    return () => {
      isCancelled = true;
      newImg.onload = null;
      newImg.onerror = null;
    };
  }, [object.type, object.src]);

  // Transformer effect
  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  const handleDragEnd = useCallback((e: any) => {
    onUpdateObject({
      ...object,
      x: e.target.x(),
      y: e.target.y(),
    });
  }, [object, onUpdateObject]);

  const handleTransformEnd = useCallback((e: any) => {
    const node = shapeRef.current;
    if (!node) return;

    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    // Reset scale
    node.scaleX(1);
    node.scaleY(1);

    onUpdateObject({
      ...object,
      x: node.x(),
      y: node.y(),
      width: Math.max(5, node.width() * scaleX),
      height: Math.max(5, node.height() * scaleY),
    });
  }, [object, onUpdateObject]);

  const handleClick = useCallback(() => {
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
    } else {
      onSelect();
    }
  }, [
    isRunMode,
    object.type,
    object.action,
    object.jumpToCardId,
    object.src,
    object.script,
    onSwitchCard,
    onOpenUrl,
    executeScript,
    onSelect,
  ]);

  // Destructure with proper typing
  const { x, y, width, height, type, text } = object;

  // Style calculations
  const currentStrokeColor = object.borderColor || '#000000';
  const currentStrokeWidth = borderWidthMap[object.borderWidth || 'none'];
  const strokeColor = isSelected ? 'blue' : currentStrokeColor;
  const strokeWidth = isSelected ? 3 : currentStrokeWidth;
  const fillColor = object.backgroundColor === 'transparent' ? 'rgba(0,0,0,0)' : (object.backgroundColor || '#ffffff');

  // Image dimensions calculation
  const imageDimensions = img && object.type === 'image'
    ? calculateImageDimensions(img, width, height, object.objectFit)
    : { x: 0, y: 0, width, height };

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
        {/* Background/border rectangle */}
        <Rect
          width={width}
          height={height}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />

        {/* Text content - for buttons and text boxes */}
        {text && (
          <Text
            text={text}
            width={width}
            height={height}
            align={object.textAlign || 'left'}
            verticalAlign="middle"
            padding={5}
            fontSize={parseFontSize(object.fontSize)}
            fontStyle={object.fontStyle}
            fontFamily={object.fontFamily || 'sans-serif'}
            fill={object.color || '#000000'}
            textDecoration={object.textDecoration}
          />
        )}

        {/* Image content */}
        {object.type === 'image' && img && (
          <Image
            image={img}
            x={imageDimensions.x}
            y={imageDimensions.y}
            width={imageDimensions.width}
            height={imageDimensions.height}
          />
        )}
      </Group>

      {/* Transformer for selected objects */}
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            // Limit minimum resize dimensions
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