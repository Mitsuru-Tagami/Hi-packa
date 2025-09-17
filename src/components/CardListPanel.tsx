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
  onSaveProject: () => void;
  onLoadProject: (file: File) => Promise<void>;
}

const CardListPanel: React.FC<CardListPanelProps> = ({
  stack,
  onSwitchCard,
  isRunMode,
  onToggleRunMode,
  onOpenSettingsModal,
  onAddCard,
  onExportHTML,
  onSaveProject,
  onLoadProject,
}) => {
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onLoadProject(file);
      // Reset the input so the same file can be selected again
      event.target.value = '';
    }
  };
  return (
    <Box sx={{ 
      borderRight: '1px solid #ddd', 
      height: '100%', 
      p: 2, 
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      <Typography variant="h6" gutterBottom>
        {t('cards')}
      </Typography>
      <Box sx={{ overflowY: 'auto', flexGrow: 1 }}>
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
      </Box>
      
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
      
      {/* Separator */}
      <Box sx={{ mt: 3, mb: 2, borderTop: '1px solid #ddd' }} />
      
      {/* Project Operations Section */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          {t('projectOperations')}
        </Typography>
        
        {/* Export HTML Button */}
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
        
        {/* Save Project Button */}
        <Box sx={{ mt: 1 }}>
          <Button
            variant="contained"
            onClick={onSaveProject}
            fullWidth
            color="secondary"
          >
            {t('saveProject')}
          </Button>
        </Box>
        
        {/* Load Project Button */}
        <Box sx={{ mt: 1 }}>
          <input
            accept=".json,.hipacka"
            style={{ display: 'none' }}
            id="load-project-file"
            type="file"
            onChange={handleFileSelect}
          />
          <label htmlFor="load-project-file">
            <Button
              variant="outlined"
              component="span"
              fullWidth
              color="secondary"
            >
              {t('loadProject')}
            </Button>
          </label>
        </Box>
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