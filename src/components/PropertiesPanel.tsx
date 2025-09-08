import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel'; // Import FormControlLabel
import Switch from '@mui/material/Switch'; // Import Switch
import type { StackObject, BorderWidth, TextAlign } from '../types';
import { parseUnitValue } from '../utils';

interface PropertiesPanelProps {
  selectedObject: StackObject | null;
  onUpdateObject: (object: StackObject) => void;
  isRunMode: boolean;
  isMagicEnabled: boolean;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ selectedObject, onUpdateObject, isRunMode, isMagicEnabled }) => {
  // Local state to manage input field values
  const [localX, setLocalX] = useState<string>('');
  const [localY, setLocalY] = useState<string>('');
  const [localWidth, setLocalWidth] = useState<string>('');
  const [localHeight, setLocalHeight] = useState<string>('');
  const [localText, setLocalText] = useState<string>('');
  const [localScript, setLocalScript] = useState<string>('');
  const [localBorderColor, setLocalBorderColor] = useState<string>('');
  const [localBorderWidth, setLocalBorderWidth] = useState<BorderWidth>('none');
  const [localTextAlign, setLocalTextAlign] = useState<TextAlign>('left');
  const [localBackgroundColor, setLocalBackgroundColor] = useState<string>(''); // New local state for background color
  const [isTransparentBackground, setIsTransparentBackground] = useState<boolean>(false); // New local state for transparency

  // Update local state when selectedObject changes
  useEffect(() => {
    if (selectedObject) {
      setLocalX(selectedObject.x.toFixed(2));
      setLocalY(selectedObject.y.toFixed(2));
      setLocalWidth(selectedObject.width.toFixed(2));
      setLocalHeight(selectedObject.height.toFixed(2));
      setLocalText(selectedObject.text);
      setLocalScript(selectedObject.script || '');
      setLocalBorderColor(selectedObject.borderColor || '#000000');
      setLocalBorderWidth(selectedObject.borderWidth || 'none');
      setLocalTextAlign(selectedObject.textAlign || 'left');

      // Initialize background color and transparency
      if (selectedObject.backgroundColor === 'transparent' || selectedObject.backgroundColor === 'rgba(0,0,0,0)') {
        setIsTransparentBackground(true);
        setLocalBackgroundColor('#ffffff'); // Default color when transparent is checked
      } else {
        setIsTransparentBackground(false);
        setLocalBackgroundColor(selectedObject.backgroundColor || '#ffffff'); // Default to white if not set
      }
    } else {
      // Clear local state if no object is selected
      setLocalX('');
      setLocalY('');
      setLocalWidth('');
      setLocalHeight('');
      setLocalText('');
      setLocalScript('');
      setLocalBorderColor('');
      setLocalBorderWidth('none');
      setLocalTextAlign('left');
      setLocalBackgroundColor('');
      setIsTransparentBackground(false);
    }
  }, [selectedObject]);

  const handlePropertyChange = (key: keyof StackObject, value: any) => {
    if (selectedObject) {
      onUpdateObject({
        ...selectedObject,
        [key]: value,
      });
    }
  };

  const handleNumberInputLocalChange = (setter: React.Dispatch<React.SetStateAction<string>>, e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
  };

  const handleNumberInputBlur = (key: keyof StackObject, rawValue: string) => {
    const pixelValue = parseUnitValue(rawValue);

    if (!isNaN(pixelValue)) {
      handlePropertyChange(key, pixelValue);
    } else {
      if (selectedObject) {
        switch (key) {
          case 'x': setLocalX(selectedObject.x.toFixed(2)); break;
          case 'y': setLocalY(selectedObject.y.toFixed(2)); break;
          case 'width': setLocalWidth(selectedObject.width.toFixed(2)); break;
          case 'height': setLocalHeight(selectedObject.height.toFixed(2)); break;
        }
      }
    }
  };

  const handleBackgroundColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalBackgroundColor(e.target.value);
    handlePropertyChange('backgroundColor', e.target.value);
    setIsTransparentBackground(false); // Uncheck transparent if color is picked
  };

  const handleTransparentToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setIsTransparentBackground(isChecked);
    if (isChecked) {
      handlePropertyChange('backgroundColor', 'transparent');
    } else {
      // Revert to last selected color or default if transparent is unchecked
      handlePropertyChange('backgroundColor', localBackgroundColor || '#ffffff');
    }
  };

  // Hide the panel completely if in run mode
  if (isRunMode) {
    return null;
  }

  return (
    <Box sx={{ borderLeft: '1px solid #ddd', p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Properties Panel
      </Typography>
      {selectedObject ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="subtitle1">
            Selected Object: {selectedObject.id} ({selectedObject.type})
          </Typography>
          <TextField
            label="Text"
            value={localText}
            onChange={(e) => setLocalText(e.target.value)}
            onBlur={(e) => handlePropertyChange('text', e.target.value)}
            fullWidth
            size="small"
          />
          {/* Text Align */}
          {(selectedObject.type === 'text' || selectedObject.type === 'button') && (
            <FormControl fullWidth size="small">
              <InputLabel>Text Align</InputLabel>
              <Select
                value={localTextAlign}
                label="Text Align"
                onChange={(e) => {
                  setLocalTextAlign(e.target.value as TextAlign);
                  handlePropertyChange('textAlign', e.target.value as TextAlign);
                }}
              >
                <MenuItem value="left">Left</MenuItem>
                <MenuItem value="center">Center</MenuItem>
                <MenuItem value="right">Right</MenuItem>
                <MenuItem value="justify">Justify</MenuItem>
              </Select>
            </FormControl>
          )}

          <TextField
            label="X"
            value={localX}
            onChange={(e) => handleNumberInputLocalChange(setLocalX, e as React.ChangeEvent<HTMLInputElement>)}
            onBlur={(e) => handleNumberInputBlur('x', e.target.value)}
            fullWidth
            size="small"
            InputProps={{
              endAdornment: <InputAdornment position="end">px</InputAdornment>,
            }}
          />
          <TextField
            label="Y"
            value={localY}
            onChange={(e) => handleNumberInputLocalChange(setLocalY, e as React.ChangeEvent<HTMLInputElement>)}
            onBlur={(e) => handleNumberInputBlur('y', e.target.value)}
            fullWidth
            size="small"
            InputProps={{
              endAdornment: <InputAdornment position="end">px</InputAdornment>,
            }}
          />
          <TextField
            label="Width"
            value={localWidth}
            onChange={(e) => handleNumberInputLocalChange(setLocalWidth, e as React.ChangeEvent<HTMLInputElement>)}
            onBlur={(e) => handleNumberInputBlur('width', e.target.value)}
            fullWidth
            size="small"
            InputProps={{
              endAdornment: <InputAdornment position="end">px</InputAdornment>,
            }}
          />
          <TextField
            label="Height"
            value={localHeight}
            onChange={(e) => handleNumberInputLocalChange(setLocalHeight, e as React.ChangeEvent<HTMLInputElement>)}
            onBlur={(e) => handleNumberInputBlur('height', e.target.value)}
            fullWidth
            size="small"
            InputProps={{
              endAdornment: <InputAdornment position="end">px</InputAdornment>,
            }}
          />
          {/* Background Color */}
          <TextField
            label="Background Color"
            type="color"
            value={localBackgroundColor}
            onChange={handleBackgroundColorChange}
            fullWidth
            size="small"
            disabled={isTransparentBackground} // Disable if transparent is checked
          />
          <FormControlLabel
            control={
              <Switch
                checked={isTransparentBackground}
                onChange={handleTransparentToggle}
              />
            }
            label="Transparent Background"
          />
          {/* Border Color */}
          <TextField
            label="Border Color"
            type="color"
            value={localBorderColor}
            onChange={(e) => setLocalBorderColor(e.target.value)}
            onBlur={(e) => handlePropertyChange('borderColor', e.target.value)}
            fullWidth
            size="small"
          />
          {/* Border Width */}
          <FormControl fullWidth size="small">
            <InputLabel>Border Width</InputLabel>
            <Select
              value={localBorderWidth}
              label="Border Width"
              onChange={(e) => {
                setLocalBorderWidth(e.target.value as BorderWidth);
                handlePropertyChange('borderWidth', e.target.value as BorderWidth);
              }}
            >
              <MenuItem value="none">None</MenuItem>
              <MenuItem value="thin">Thin</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="thick">Thick</MenuItem>
            </Select>
          </FormControl>

          {/* Script field */}
          {selectedObject.type === 'button' && (
            <TextField
              label="Script (JavaScript)"
              multiline
              rows={4}
              value={localScript}
              onChange={(e) => setLocalScript(e.target.value)}
              onBlur={(e) => handlePropertyChange('script', e.target.value)}
              fullWidth
              size="small"
              placeholder="Enter JavaScript code here..."
              disabled={!isMagicEnabled} // Disable if magic is not enabled
            />
          )}
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary">
          Select an object on the canvas to view its properties.
        </Typography>
      )}
    </Box>
  );
};

export default PropertiesPanel;