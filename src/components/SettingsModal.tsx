import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton'; // Import IconButton
import InputAdornment from '@mui/material/InputAdornment'; // Import InputAdornment
import Visibility from '@mui/icons-material/Visibility'; // Import Visibility icon
import VisibilityOff from '@mui/icons-material/VisibilityOff'; // Import VisibilityOff icon

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSetMagicEnabled: (enabled: boolean) => void;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSetMagicEnabled }) => {
  const [magicInput, setMagicInput] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility
  const MAGIC_WORD = 'Magic'; // Define the magic word

  const handleUnlock = () => {
    if (magicInput === MAGIC_WORD) {
      onSetMagicEnabled(true);
      onClose();
      alert('魔法が解き放たれました！'); // Changed alert message
    } else {
      setError('Incorrect magic word.');
    }
  };

  const handleClose = () => {
    setError(''); // Clear error on close
    setMagicInput(''); // Clear input on close
    setShowPassword(false); // Reset password visibility on close
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
          Settings
        </Typography>
        <Typography id="settings-modal-description" sx={{ mt: 2 }}>
          Enter the magic word to unlock advanced scripting features.
        </Typography>
        <TextField
          label="Magic Word"
          type={showPassword ? 'text' : 'password'} // Toggle type based on showPassword
          fullWidth
          margin="normal"
          value={magicInput}
          onChange={(e) => {
            setMagicInput(e.target.value);
            setError(''); // Clear error on input change
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleUnlock();
            }
          }}
          InputProps={{ // Add InputProps for adornment
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
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
            Cancel
          </Button>
          <Button variant="contained" onClick={handleUnlock}>
            Unlock
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default SettingsModal;