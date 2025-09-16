import React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import type { Stack } from '../types';
import { t } from '../i18n'; // Import translation function

interface CardListPanelProps {
  stack: Stack;
  onSwitchCard: (cardId: string) => void;
  isRunMode: boolean;
  onToggleRunMode: () => void;
  onOpenSettingsModal: () => void;
  onAddCard: () => void;
  onExportHTML: () => void;
}

const CardListPanel: React.FC<CardListPanelProps> = ({
  stack,
  onSwitchCard,
  isRunMode,
  onToggleRunMode,
  onOpenSettingsModal,
  onAddCard,
  onExportHTML,
}) => {
  return (
    <Box sx={{ borderRight: '1px solid #ddd', height: '100vh', p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {t('cards')}
      </Typography>
      <List component="nav">
        {stack.cards.map((card, index) => (
          <ListItemButton
            key={card.id}
            selected={card.id === stack.currentCardId}
            onClick={() => onSwitchCard(card.id)}
            disabled={isRunMode}
          >
            <ListItemText primary={`${index + 1}. ${card.name}`} />
          </ListItemButton>
        ))}
      </List>
      
      {/* Add Card Button - moved here from properties panel */}
      <Box sx={{ mt: 2 }}>
        <Button
          variant="contained"
          onClick={onAddCard}
          fullWidth
          color="primary"
        >
          {t('addCardButton')}
        </Button>
      </Box>
      
      {/* Export HTML Button - moved here from properties panel */}
      <Box sx={{ mt: 1 }}>
        <Button
          variant="contained"
          onClick={onExportHTML}
          fullWidth
          color="success"
        >
          {t('exportHTML')}
        </Button>
      </Box>
      
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          {t('mode')}
        </Typography>
        <Button
          variant="contained"
          onClick={onToggleRunMode}
          fullWidth
        >
          {isRunMode ? t('editMode') : t('runMode')}
        </Button>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Button
          variant="outlined"
          onClick={onOpenSettingsModal}
          fullWidth
        >
          {t('settings')}
        </Button>
      </Box>
    </Box>
  );
};

export default CardListPanel;
