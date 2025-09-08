import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import CardListPanel from './CardListPanel';
import CardCanvas from './CardCanvas';
import { PropertiesPanel } from './PropertiesPanel';
import SettingsModal from './SettingsModal';
import type { Stack, StackObject, ObjectType } from '../types'; // Import ObjectType

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
  onAddObject: (type: ObjectType, x: number, y: number) => void; // New prop
  onDeleteObject: (objectId: string) => void; // New prop
  onUpdateCardDimensions: (cardId: string, width: number, height: number) => void; // New prop
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
  onAddObject, // Add this line
  onDeleteObject,
  onUpdateCardDimensions, // Add this line
}) => {
  const currentCard = stack.cards.find(card => card.id === stack.currentCardId);

  return (
    <Box sx={{ flexGrow: 1, height: '100%' }}>
      <Grid container spacing={2} sx={{ height: '100%' }}>
        <Grid item xs={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <CardListPanel
            stack={stack}
            onSwitchCard={onSwitchCard}
            isRunMode={isRunMode}
            onToggleRunMode={onToggleRunMode}
            onOpenSettingsModal={onOpenSettingsModal}
          />
        </Grid>
        <Grid item xs={6} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <CardCanvas
            stack={stack}
            selectedObject={selectedObject}
            onSelectObject={onSelectObject}
            onUpdateObject={onUpdateObject}
            isRunMode={isRunMode}
            onOpenUrl={onOpenUrl}
            onSwitchCard={onSwitchCard}
            executeScript={executeScript}
            onAddObject={onAddObject} // Pass to CardCanvas
          />
        </Grid>
        <Grid item xs={3} sx={{ height: '100%', overflow: 'auto' }}>
          <PropertiesPanel
            selectedObject={selectedObject}
            onUpdateObject={onUpdateObject}
            isRunMode={isRunMode}
            isMagicEnabled={isMagicEnabled}
            onDeleteObject={onDeleteObject} // Pass new prop
            onUpdateCardDimensions={onUpdateCardDimensions} // Pass new prop
            currentCard={currentCard} // Pass currentCard
          />
        </Grid>
      </Grid>
      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={onCloseSettingsModal}
        onSetMagicEnabled={onSetMagicEnabled}
      />
    </Box>
  );
};

export default Layout;
