import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import CardListPanel from './CardListPanel';
import CardCanvas from './CardCanvas';
import PropertiesPanel from './PropertiesPanel';
import type { Stack, StackObject } from '../types';

interface LayoutProps {
  stack: Stack;
  selectedObject: StackObject | null;
  isRunMode: boolean;
  onSwitchCard: (cardId: string) => void;
  onSelectObject: (object: StackObject | null) => void;
  onUpdateObject: (object: StackObject) => void;
  onToggleRunMode: () => void;
  onOpenUrl: (url: string) => void; // New prop
}

const Layout: React.FC<LayoutProps> = ({ stack, selectedObject, isRunMode, onSwitchCard, onSelectObject, onUpdateObject, onToggleRunMode, onOpenUrl }) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <CardListPanel stack={stack} onSwitchCard={onSwitchCard} isRunMode={isRunMode} onToggleRunMode={onToggleRunMode} />
        </Grid>
        <Grid item xs={6}>
          <CardCanvas
            stack={stack}
            selectedObject={selectedObject}
            onSelectObject={onSelectObject}
            onUpdateObject={onUpdateObject}
            isRunMode={isRunMode}
            onOpenUrl={onOpenUrl} // Pass onOpenUrl to CardCanvas
          />
        </Grid>
        <Grid item xs={3}>
          <PropertiesPanel selectedObject={selectedObject} onUpdateObject={onUpdateObject} isRunMode={isRunMode} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Layout;