import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import CardListPanel from './CardListPanel';
import CardCanvas from './CardCanvas';
import PropertiesPanel from './PropertiesPanel';
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
  onAddObject, // Destructure new prop
}) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <CardListPanel
            stack={stack}
            onSwitchCard={onSwitchCard}
            isRunMode={isRunMode}
            onToggleRunMode={onToggleRunMode}
            onOpenSettingsModal={onOpenSettingsModal}
          />
        </Grid>
        <Grid item xs={6}>
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
        <Grid item xs={3}>
          <PropertiesPanel
            selectedObject={selectedObject}
            onUpdateObject={onUpdateObject}
            isRunMode={isRunMode}
            isMagicEnabled={isMagicEnabled}
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
