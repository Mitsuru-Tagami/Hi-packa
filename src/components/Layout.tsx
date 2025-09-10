import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import CardListPanel from './CardListPanel';
import CardCanvas from './CardCanvas';
import { PropertiesPanel } from './PropertiesPanel';
import { SettingsModalComponent } from './SettingsModal';
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
  allowScriptingOnAllObjects: boolean; // New prop
  onSetAllowScriptingOnAllObjects: (enabled: boolean) => void; // New prop
  onAddCard: () => void; // New prop
  onUpdateCardName: (cardId: string, newName: string) => void; // New prop
  onDeleteCard: (cardId: string) => void; // New prop for card deletion
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
  allowScriptingOnAllObjects,
  onSetAllowScriptingOnAllObjects,
  onAddCard,
  onUpdateCardName, // New prop
  onDeleteCard, // New prop for card deletion
}) => {
  const currentCard = stack.cards.find(card => card.id === stack.currentCardId);

  return (
    <Box sx={{ flexGrow: 1, height: '100%' }}>
  <Grid spacing={2} sx={{ height: '100%', display: 'grid', gridTemplateColumns: '3fr 6fr 3fr' }}>
  <Grid sx={{ height: '100%', display: 'flex', flexDirection: 'column', gridColumn: '1 / span 1' }}>
          <CardListPanel
            stack={stack}
            onSwitchCard={onSwitchCard}
            isRunMode={isRunMode}
            onToggleRunMode={onToggleRunMode}
            onOpenSettingsModal={onOpenSettingsModal}
            onAddCard={onAddCard} // New prop
          />
        </Grid>
  <Grid sx={{ height: '100%', display: 'flex', flexDirection: 'column', gridColumn: '2 / span 1', position: 'relative', zIndex: 1, overflow: 'auto' }}>
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
  <Grid sx={{ height: '100%', overflow: 'auto', gridColumn: '3 / span 1', position: 'relative', zIndex: 2, pointerEvents: 'auto' }}>
          <PropertiesPanel
            stack={stack} // Pass stack prop
            selectedObject={selectedObject}
            onUpdateObject={onUpdateObject}
            isRunMode={isRunMode}
            isMagicEnabled={isMagicEnabled}
            onDeleteObject={onDeleteObject} // Pass new prop
            onUpdateCardDimensions={onUpdateCardDimensions} // Pass new prop
            currentCard={currentCard} // Pass currentCard
            allowScriptingOnAllObjects={allowScriptingOnAllObjects} // New prop
            onDeleteCard={onDeleteCard} // Pass card delete handler
          />
        </Grid>
      </Grid>
      {/* Settings Modal */}
      <SettingsModalComponent
        isOpen={isSettingsModalOpen}
        onClose={onCloseSettingsModal}
        onSetMagicEnabled={onSetMagicEnabled}
        allowScriptingOnAllObjects={allowScriptingOnAllObjects} // New prop
        onSetAllowScriptingOnAllObjects={onSetAllowScriptingOnAllObjects} // New prop
      />
    </Box>
  );
};

export default Layout;
