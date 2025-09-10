import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Select from '@mui/material/Select';
import type { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import i18next, { t } from '../i18n';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSetMagicEnabled: (enabled: boolean) => void;
  isMagicEnabled?: boolean; // 現在のmagic状態を取得するためのオプショナルprop
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 550,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onSetMagicEnabled,
  isMagicEnabled = false, // デフォルト値を設定
}) => {
  const [magicInput, setMagicInput] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(i18next.language);
  
  const MAGIC_WORD = 'magic';

  const handleUnlock = () => {
    if (magicInput === MAGIC_WORD) {
      onSetMagicEnabled(true);
      alert(t('settingsModal.unlockedAlert'));
      setTimeout(() => {
        onClose();
      }, 100);
    } else {
      setError(t('settingsModal.incorrectMagicWord'));
    }
  };

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    const newLang = event.target.value;
    i18next.changeLanguage(newLang);
    setSelectedLanguage(newLang);
  };

  const handleClose = () => {
    setError('');
    setMagicInput('');
    setShowPassword(false);
    onClose();
  };

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="settings-modal-title"
      aria-describedby="settings-modal-description"
    >
      <Box sx={style}>
        <Typography id="settings-modal-title" variant="h6" component="h2" gutterBottom>
          {t('settingsModal.title')}
        </Typography>

        {/* Language Selector */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="language-select-label">{t('settingsModal.language')}</InputLabel>
          <Select
            labelId="language-select-label"
            value={selectedLanguage}
            label={t('settingsModal.language')}
            onChange={handleLanguageChange}
          >
            <MenuItem value="ja">{t('settingsModal.languageJa')}</MenuItem>
            <MenuItem value="en">{t('settingsModal.languageEn')}</MenuItem>
          </Select>
        </FormControl>

        {/* Allow Scripting on All Objects Toggle - 修正版 */}
        <FormControlLabel
          sx={{ mt: 2, display: 'block' }}
          control={
            <Switch
              disabled={!isMagicEnabled}
            />
          }
          label={
            <Typography sx={{ color: 'rgba(0, 0, 0, 0.87)' }}>
              {t('settingsModal.allowScriptingOnAllObjects')}
            </Typography>
          }
        />

        <Typography id="settings-modal-description" sx={{ mt: 2 }}>
          {t('settingsModal.magicWordPrompt')}
        </Typography>
        
        <TextField
          label={t('settingsModal.magicWordLabel')}
          type={showPassword ? 'text' : 'password'}
          fullWidth
          margin="normal"
          value={magicInput}
          onChange={(e) => {
            setMagicInput(e.target.value);
            setError('');
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleUnlock();
            }
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={t('settingsModal.togglePasswordVisibility')}
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {error && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {error}
          </Alert>
        )}
        
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button variant="outlined" onClick={handleClose}>
            {t('settingsModal.cancelButton')}
          </Button>
          <Button variant="contained" onClick={handleUnlock}>
            {t('settingsModal.unlockButton')}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export const SettingsModalComponent = SettingsModal;