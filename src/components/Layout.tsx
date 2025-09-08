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
  onSwitchCard: (cardId: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ stack, selectedObject, onSwitchCard }) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <CardListPanel stack={stack} onSwitchCard={onSwitchCard} />
        </Grid>
        <Grid item xs={6}>
          <CardCanvas stack={stack} />
        </Grid>
        <Grid item xs={3}>
          <PropertiesPanel selectedObject={selectedObject} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Layout;
