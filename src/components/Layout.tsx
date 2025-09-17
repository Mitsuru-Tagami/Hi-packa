import React from 'react';
import Box from '@mui/material/Box';
import CardListPanel from './CardListPanel';
import CardCanvas from './CardCanvas';
import { PropertiesPanel } from './PropertiesPanel';
import { SettingsModalComponent } from './SettingsModal';
import type { Stack, StackObject, ObjectType } from '../types';

interface LayoutProps {
  stack: Stack;
  selectedObject: StackObject | null;
  isRunMode: boolean;
  isMagicEnabled: boolean;
  isSettingsModalOpen: boolean;
  onSwitchCard: (cardId: string) => void;
  onSelectObject: (object: StackObject | null) => void;
  onUpdateObject: (object: StackObject) => void;
  onToggleRunMode: () => void;
  onOpenUrl: (url: string) => void;
  executeScript: (script: string) => void;
  onOpenSettingsModal: () => void;
  onCloseSettingsModal: () => void;
  onSetMagicEnabled: (enabled: boolean) => void;
  onAddObject: (type: ObjectType, x: number, y: number) => void;
  onDeleteObject: (objectId: string) => void;
  onUpdateCardDimensions: (cardId: string, width: number, height: number) => void;
  onAddCard: () => void;
  onUpdateCardName: (cardId: string, newName: string) => void;
  onDeleteCard: (cardId: string) => void;
  onExportHTML: () => void;
  onSaveProject: () => void;
  onLoadProject: (file: File) => Promise<void>;
}

const Layout: React.FC<LayoutProps> = ({
  stack,
  selectedObject,
  isRunMode,
  isMagicEnabled,
  isSettingsModalOpen,
  onSwitchCard,
  onSelectObject,
  onUpdateObject,
  onToggleRunMode,
  onOpenUrl,
  executeScript,
  onOpenSettingsModal,
  onCloseSettingsModal,
  onSetMagicEnabled,
  onAddObject,
  onDeleteObject,
  onUpdateCardDimensions,
  onAddCard,
  onUpdateCardName,
  onDeleteCard,
  onExportHTML,
  onSaveProject,
  onLoadProject,
}) => {
  const currentCard = stack.cards.find(card => card.id === stack.currentCardId);

  return (
    <Box sx={{ flexGrow: 1, height: '100%' }}>
      {/* CSS Gridではなく、MUIの推奨する方法を使用 */}
      <Box
        sx={{
          height: '100%',
          display: 'grid',
          gridTemplateColumns: '300px 1fr 300px', // より具体的なサイズ指定
          gap: 2,
        }}
      >
        {/* Left Panel - Card List */}
        <Box sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          overflow: 'auto'
        }}>
          <CardListPanel
            stack={stack}
            onSwitchCard={onSwitchCard}
            isRunMode={isRunMode}
            onToggleRunMode={onToggleRunMode}
            onOpenSettingsModal={onOpenSettingsModal}
            onAddCard={onAddCard}
            onExportHTML={onExportHTML}
            onSaveProject={onSaveProject}
            onLoadProject={onLoadProject}
          />
        </Box>

        {/* Center Panel - Canvas */}
        <Box sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          position: 'relative',
          zIndex: 1,
          overflow: 'auto',
          minWidth: 0 // Grid itemの縮小を許可
        }}>
          <CardCanvas
            stack={stack}
            selectedObject={selectedObject}
            onSelectObject={onSelectObject}
            onUpdateObject={onUpdateObject}
            isRunMode={isRunMode}
            onOpenUrl={onOpenUrl}
            onSwitchCard={onSwitchCard}
            executeScript={executeScript}
            onAddObject={onAddObject}
          />
        </Box>

        {/* Right Panel - Properties */}
        <Box sx={{ 
          height: '100%',
          overflow: 'auto',
          position: 'relative',
          zIndex: 2,
          pointerEvents: 'auto'
        }}>
          <PropertiesPanel
            stack={stack}
            selectedObject={selectedObject}
            onUpdateObject={onUpdateObject}
            isRunMode={isRunMode}
            isMagicEnabled={isMagicEnabled}
            onDeleteObject={onDeleteObject}
            onUpdateCardDimensions={onUpdateCardDimensions}
            currentCard={currentCard}
            onDeleteCard={onDeleteCard}
            onUpdateCardName={onUpdateCardName}
          />
        </Box>
      </Box>

      {/* Settings Modal */}
  <SettingsModalComponent
  isOpen={isSettingsModalOpen}
  onClose={onCloseSettingsModal}
  onSetMagicEnabled={onSetMagicEnabled}
  isMagicEnabled={isMagicEnabled}
/>    </Box>
  );
};

export default Layout;