import React, { lazy, Suspense } from 'react';
import Box from '@mui/material/Box';
import CardListPanel from './CardListPanel';
import CardCanvas from './CardCanvas';

// Dynamically import heavy components
const PropertiesPanel = lazy(() => import('./PropertiesPanel').then(module => ({ default: module.PropertiesPanel })));
const SettingsModal = lazy(() => import('./SettingsModal').then(module => ({ default: module.SettingsModalComponent })));

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
    <Box sx={{ display: 'flex', height: '100vh' }}>
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

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <CardCanvas
          stack={stack}
          selectedObject={selectedObject}
          onSelectObject={onSelectObject}
          onUpdateObject={onUpdateObject}
          isRunMode={isRunMode}
          onSwitchCard={onSwitchCard}
          onOpenUrl={onOpenUrl}
          executeScript={executeScript}
          onAddObject={onAddObject}
          onDeleteObject={onDeleteObject}
        />
      </Box>

      <Box
        sx={{
          width: 300,
          borderLeft: '1px solid #ddd',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto'
        }}>
        <Suspense fallback={<div>Loading...</div>}>
          <PropertiesPanel
            stack={stack}
            selectedObject={selectedObject}
            onUpdateObject={onUpdateObject}
            isMagicEnabled={isMagicEnabled}
            currentCard={currentCard}
            onDeleteCard={onDeleteCard}
            onUpdateCardDimensions={onUpdateCardDimensions}
            onUpdateCardName={onUpdateCardName}
            onDeleteObject={onDeleteObject}
          />
        </Suspense>
      </Box>

      <Suspense fallback={null}>
        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={onCloseSettingsModal}
          onSetMagicEnabled={onSetMagicEnabled}
          isMagicEnabled={isMagicEnabled}
        />
      </Suspense>
    </Box>
  );
};

export default Layout;