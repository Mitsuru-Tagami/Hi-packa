import React, { useState } from 'react'; // Import useState
import { Stage, Layer, Rect } from 'react-konva';
import type { Stack, StackObject, ObjectType } from '../types'; // Import ObjectType
import { StackObjectNode } from './StackObjectNode';
import Menu from '@mui/material/Menu'; // Import Menu
import MenuItem from '@mui/material/MenuItem'; // Import MenuItem
import { t } from '../i18n';

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
  onDeleteObject: (objectId: string) => void; // Added this line
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
  onAddObject,
  onDeleteObject,
}) => {
  // デバッグ: 初期値確認
  console.log('CardCanvas stack.currentCardId:', stack.currentCardId);
  console.log('CardCanvas stack.cards:', stack.cards);
  if (stack.cards.length > 0) {
    const debugCard = stack.cards.find(card => card.id === stack.currentCardId);
    if (debugCard) {
      console.log('currentCard.width:', debugCard.width);
      console.log('currentCard.height:', debugCard.height);
    }
  }
  console.log('isRunMode:', isRunMode);
  // 現在のカードを取得
  const currentCard = stack.cards.find(card => card.id === stack.currentCardId);
  // 拡大縮小・スクロール用state
  const [stageScale, setStageScale] = useState<number>(1);
  // Grid中央領域のサイズ取得（仮: windowサイズの60%を中央領域とみなす）
  const centralWidth = window.innerWidth * 0.6;
  const centralHeight = window.innerHeight;
  const [stagePos, setStagePos] = useState<{ x: number; y: number }>(() => ({
    x: (centralWidth / 2) - ((currentCard?.width || 414) / 2),
    y: (centralHeight / 2) - ((currentCard?.height || 736) / 2),
  }));
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  // ホイールでズーム
  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    const scaleBy = 1.1;
    const oldScale = stageScale;
    const pointer = e.target.getStage().getPointerPosition();
    if (!pointer) return;
    const mousePointTo = {
      x: (pointer.x - stagePos.x) / oldScale,
      y: (pointer.y - stagePos.y) / oldScale,
    };
    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    setStageScale(newScale);
    setStagePos({
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    });
  };

  // ドラッグでスクロール
  const handleMouseDown = (e: any) => {
    setIsDragging(true);
    setDragStart({ x: e.evt.clientX, y: e.evt.clientY });
  };
  const handleMouseMove = (e: any) => {
    if (!isDragging || !dragStart) return;
    const dx = e.evt.clientX - dragStart.x;
    const dy = e.evt.clientY - dragStart.y;
    setStagePos(prev => ({ x: prev.x + dx, y: prev.y + dy }));
    setDragStart({ x: e.evt.clientX, y: e.evt.clientY });
  };
  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
  };

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

  if (!currentCard) {
    return <div>カードがありません</div>;
  }
  return (
    <React.Fragment>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <Stage
          width={window.innerWidth * 0.6}
          height={window.innerHeight}
          scale={{ x: stageScale, y: stageScale }}
          x={stagePos.x}
          y={stagePos.y}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onContextMenu={handleContextMenu}
          style={{ cursor: isDragging ? 'grab' : 'default' }}
        >
          <Layer>
            {/* Canvas Background */}
            <Rect
              x={0}
              y={0}
              width={currentCard.width}
              height={currentCard.height}
              fill="#f0f0f0"
              onClick={() => !isRunMode && onSelectObject(null)}
            />
            {/* Render all objects on the current card */}
            {currentCard.objects.map(obj => (
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
                onDeleteObject={onDeleteObject} // Added this line
              />
            ))}
          </Layer>
        </Stage>
        {/* 拡大縮小ボタンUI */}
        <div style={{ position: 'absolute', right: 24, bottom: 24, display: 'flex', flexDirection: 'column', gap: 8, zIndex: 10 }}>
          <button style={{ fontSize: '1.5rem', width: 40, height: 40 }} onClick={() => setStageScale(s => Math.min(s * 1.2, 5))}>＋</button>
          <button style={{ fontSize: '1.5rem', width: 40, height: 40 }} onClick={() => setStageScale(s => Math.max(s / 1.2, 0.2))}>－</button>
        </div>
      </div>
      {/* Material-UI Context Menu */}
      <Menu
        open={Boolean(anchorEl)} // Open if anchorEl is not null
        onClose={handleCloseContextMenu}
        anchorReference="anchorPosition"
        anchorPosition={ // Use contextMenuPos for positioning
          contextMenuPos ? { top: contextMenuPos.y, left: contextMenuPos.x } : undefined
        }
      >
        <MenuItem onClick={() => handleAddObjectMenuItem('button')}>{t('contextMenu.addButton')}</MenuItem>
        <MenuItem onClick={() => handleAddObjectMenuItem('text')}>{t('contextMenu.addTextBox')}</MenuItem>
        <MenuItem onClick={() => handleAddObjectMenuItem('image')}>{t('contextMenu.addImage')}</MenuItem>
      </Menu>
    </React.Fragment>
  );
};

export default CardCanvas;