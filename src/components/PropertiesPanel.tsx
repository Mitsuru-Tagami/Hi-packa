import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import type { StackObject } from '../types';
import { parseUnitValue } from '../utils';

interface PropertiesPanelProps {
  selectedObject: StackObject | null;
  onUpdateObject: (object: StackObject) => void;
  isRunMode: boolean;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ selectedObject, onUpdateObject, isRunMode }) => {
  // Local state to manage input field values
  const [localX, setLocalX] = useState<string>('');
  const [localY, setLocalY] = useState<string>('');
  const [localWidth, setLocalWidth] = useState<string>('');
  const [localHeight, setLocalHeight] = useState<string>('');
  const [localText, setLocalText] = useState<string>(''); // For text field
  const [localScript, setLocalScript] = useState<string>(''); // For script field

  // Update local state when selectedObject changes
  useEffect(() => {
    if (selectedObject) {
      setLocalX(selectedObject.x.toFixed(2));
      setLocalY(selectedObject.y.toFixed(2));
      setLocalWidth(selectedObject.width.toFixed(2));
      setLocalHeight(selectedObject.height.toFixed(2));
      setLocalText(selectedObject.text);
      setLocalScript(selectedObject.script || ''); // Initialize script
    } else {
      // Clear local state if no object is selected
      setLocalX('');
      setLocalY('');
      setLocalWidth('');
      setLocalHeight('');
      setLocalText('');
      setLocalScript('');
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
    setter(e.target.value); // Update local state immediately
  };

  const handleNumberInputBlur = (key: keyof StackObject, rawValue: string) => {
    const pixelValue = parseUnitValue(rawValue);

    if (!isNaN(pixelValue)) {
      handlePropertyChange(key, pixelValue);
    } else {
      // If invalid input on blur, revert to the last valid value from selectedObject
      // This ensures the input field doesn't stay with invalid text
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

  // Hide the panel completely if in run mode
  if (isRunMode) {
    return null;
  }

  return (
    <Box sx={{ borderLeft: '1px solid #ddd', height: '100vh', p: 2 }}>
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
            onChange={(e) => setLocalText(e.target.value)} // Update local text state
            onBlur={(e) => handlePropertyChange('text', e.target.value)} // Update global on blur
            fullWidth
            size="small"
          />
          <TextField
            label="X"
            value={localX} // Use local state for value
            onChange={(e) => handleNumberInputLocalChange(setLocalX, e as React.ChangeEvent<HTMLInputElement>)}
            onBlur={(e) => handleNumberInputBlur('x', e.target.value)} // Update global on blur
            fullWidth
            size="small"
            InputProps={{
              endAdornment: <InputAdornment position="end">px</InputAdornment>,
            }}
          />
          <TextField
            label="Y"
            value={localY} // Use local state for value
            onChange={(e) => handleNumberInputLocalChange(setLocalY, e as React.ChangeEvent<HTMLInputElement>)}
            onBlur={(e) => handleNumberInputBlur('y', e.target.value)} // Update global on blur
            fullWidth
            size="small"
            InputProps={{
              endAdornment: <InputAdornment position="end">px</InputAdornment>,
            }}
          />
          <TextField
            label="Width"
            value={localWidth} // Use local state for value
            onChange={(e) => handleNumberInputLocalChange(setLocalWidth, e as React.ChangeEvent<HTMLInputElement>)}
            onBlur={(e) => handleNumberInputBlur('width', e.target.value)} // Update global on blur
            fullWidth
            size="small"
            InputProps={{
              endAdornment: <InputAdornment position="end">px</InputAdornment>,
            }}
          />
          <TextField
            label="Height"
            value={localHeight} // Use local state for value
            onChange={(e) => handleNumberInputLocalChange(setLocalHeight, e as React.ChangeEvent<HTMLInputElement>)}
            onBlur={(e) => handleNumberInputBlur('height', e.target.value)} // Update global on blur
            fullWidth
            size="small"
            InputProps={{
              endAdornment: <InputAdornment position="end">px</InputAdornment>,
            }}
          />
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