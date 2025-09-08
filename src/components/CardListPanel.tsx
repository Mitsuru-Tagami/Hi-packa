import React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import type { Stack } from '../types';

interface CardListPanelProps {
  stack: Stack;
  onSwitchCard: (cardId: string) => void;
}

const CardListPanel: React.FC<CardListPanelProps> = ({ stack, onSwitchCard }) => {
  return (
    <Box sx={{ borderRight: '1px solid #ddd', height: '100vh' }}>
      <List component="nav">
        {stack.cards.map((card, index) => (
          <ListItemButton
            key={card.id}
            selected={card.id === stack.currentCardId}
            onClick={() => onSwitchCard(card.id)}
          >
            <ListItemText primary={`${index + 1}. ${card.name}`} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};

export default CardListPanel;