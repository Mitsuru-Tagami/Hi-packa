import React from 'react';
import Box from '@mui/material/Box';
import { Stack } from '../types';

interface CardListPanelProps {
  stack: Stack;
}

const CardListPanel: React.FC<CardListPanelProps> = ({ stack }) => {
  // For now, just log the received data
  console.log('CardListPanel received stack:', stack);

  return (
    <Box sx={{ border: '1px solid grey', height: '100vh' }}>
      Card List Panel
      {/* We will render the list of cards here in the next step */}
    </Box>
  );
};

export default CardListPanel;