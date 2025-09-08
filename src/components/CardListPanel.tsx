import React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button'; // Import Button
import Typography from '@mui/material/Typography'; // Import Typography for section titles
import type { Stack } from '../types';

interface CardListPanelProps {
  stack: Stack;
  onSwitchCard: (cardId: string) => void;
  isRunMode: boolean; // New prop
  onToggleRunMode: () => void; // New prop
}

const CardListPanel: React.FC<CardListPanelProps> = ({ stack, onSwitchCard, isRunMode, onToggleRunMode }) => {
  return (
    <Box sx={{ borderRight: '1px solid #ddd', height: '100vh', p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Cards
      </Typography>
      <List component="nav">
        {stack.cards.map((card, index) => (
          <ListItemButton
            key={card.id}
            selected={card.id === stack.currentCardId}
            onClick={() => onSwitchCard(card.id)}
            disabled={isRunMode} // Disable card switching in run mode
          >
            <ListItemText primary={`${index + 1}. ${card.name}`} />
          </ListItemButton>
        ))}
      </List>
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Mode
        </Typography>
        <Button
          variant="contained"
          onClick={onToggleRunMode}
          fullWidth
        >
          {isRunMode ? 'Edit Mode' : 'Run Mode'}
        </Button>
      </Box>
      {/* Add other controls like "Export HTML" here later */}
    </Box>
  );
};

export default CardListPanel;
