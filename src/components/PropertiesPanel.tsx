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
import Button from '@mui/material/Button'; // Import Button
import type { StackObject, BorderWidth, TextAlign, Card } from '../types';
import { parseUnitValue } from '../utils';
import { t } from '../i18n';

interface PropertiesPanelProps {
  selectedObject: StackObject | null;
  onUpdateObject: (object: StackObject) => void;
  isRunMode: boolean;
  isMagicEnabled: boolean;
  onDeleteObject: (objectId: string) => void;
  onUpdateCardDimensions: (cardId: string, width: number, height: number) => void; // New prop
  currentCard: Card | null; // New prop
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ selectedObject, onUpdateObject, isRunMode, isMagicEnabled, onDeleteObject, onUpdateCardDimensions, currentCard }) => {
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
  const [localColor, setLocalColor] = useState<string>(''); // New local state for text color
  const [localSrc, setLocalSrc] = useState<string>(''); // New local state for image source
  const [localObjectFit, setLocalObjectFit] = useState<'contain' | 'fill'>('contain'); // New local state for object fit
  const [isTransparentBackground, setIsTransparentBackground] = useState<boolean>(false); // New local state for transparency
  const [localCardWidth, setLocalCardWidth] = useState<string>(''); // New local state for card width
  const [localCardHeight, setLocalCardHeight] = useState<string>(''); // New local state for card height
  const [selectedSizeLabel, setSelectedSizeLabel] = useState<string>(''); // New state for selected predefined size

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
      setLocalColor(selectedObject.color || '#000000'); // Default to black if not set
      setLocalSrc(selectedObject.src || '');
      setLocalObjectFit(selectedObject.objectFit || 'contain');

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
      // Initialize card dimensions
      if (currentCard) {
                setLocalCardHeight(currentCard.height.toString());
                const matchedSize = PREDEFINED_CARD_SIZES.find(
                  size => size.width === currentCard.width && size.height === currentCard.height
                );
                setSelectedSizeLabel(matchedSize ? matchedSize.label : 'Custom');      } else {
        setLocalCardWidth('');
        setLocalCardHeight('');
      }
    }
  }, [selectedObject, currentCard]);

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

  const PREDEFINED_CARD_SIZES = [
    { label: 'iPhone 8 Plus (414x736)', width: 414, height: 736 },
    { label: 'iPhone 12/13 (390x844)', width: 390, height: 844 },
    { label: 'iPad (768x1024)', width: 768, height: 1024 },
    { label: 'Desktop (1280x720)', width: 1280, height: 720 },
    { label: 'Custom', width: 0, height: 0 }, // Placeholder for custom input
  ];
  
  // Hide the panel completely if in run mode
  if (isRunMode) {
    return null;
  }
  return (
    <Box sx={{ borderLeft: '1px solid #ddd', p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {t('propertiesPanel.title')}
      </Typography>
      {selectedObject ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="subtitle1">
            {t('propertiesPanel.selectedObjectLabel', { id: selectedObject.id, type: selectedObject.type })}
          </Typography>
          <TextField
            label={selectedObject.type === 'text' || selectedObject.type === 'button'
                ? t('propertiesPanel.textLabel')
                : t('propertiesPanel.labelLabel')}
            value={localText}
            onChange={(e) => setLocalText(e.target.value)}
            onBlur={(e) => handlePropertyChange('text', e.target.value)}
            fullWidth
            size="small"
          />
          {/* Text Align */}
          {(selectedObject.type === 'text' || selectedObject.type === 'button') && (
            <FormControl fullWidth size="small">
              <InputLabel>{t('propertiesPanel.textAlign')}</InputLabel>
              <Select
                value={localTextAlign}
                label={t('propertiesPanel.textAlign')}
                onChange={(e) => {
                  setLocalTextAlign(e.target.value as TextAlign);
                  handlePropertyChange('textAlign', e.target.value as TextAlign);
                }}
              >
                <MenuItem value="left">{t('propertiesPanel.alignLeft')}</MenuItem>
                <MenuItem value="center">{t('propertiesPanel.alignCenter')}</MenuItem>
                <MenuItem value="right">{t('propertiesPanel.alignRight')}</MenuItem>
                <MenuItem value="justify">{t('propertiesPanel.alignJustify')}</MenuItem>
              </Select>
            </FormControl>
          )}

          {/* Text Color */}
          {(selectedObject.type === 'text' || selectedObject.type === 'button') && (
            <TextField
              label={t('propertiesPanel.textColor')}
              type="color"
              value={localColor}
              onChange={(e) => {
                setLocalColor(e.target.value);
                handlePropertyChange('color', e.target.value);
              }}
              fullWidth
              size="small"
            />
          )}

          <TextField
            label={t('propertiesPanel.positionX')}
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
            label={t('propertiesPanel.positionY')}
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
            label={t('propertiesPanel.width')}
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
            label={t('propertiesPanel.height')}
            value={localHeight}
            onChange={(e) => handleNumberInputLocalChange(setLocalHeight, e as React.ChangeEvent<HTMLInputElement>)}
            onBlur={(e) => handleNumberInputBlur('height', e.target.value)}
            fullWidth
            size="small"
            InputProps={{
              endAdornment: <InputAdornment position="end">px</InputAdornment>,
            }}
          />

          {/* Image Properties */}
          {selectedObject.type === 'image' && (
            <>
              <TextField
                label="Image Source (URL)"
                value={localSrc}
                onChange={(e) => setLocalSrc(e.target.value)}
                onBlur={(e) => handlePropertyChange('src', e.target.value)}
                fullWidth
                size="small"
              />
              <FormControl fullWidth size="small">
                <InputLabel>Object Fit</InputLabel>
                <Select
                  value={localObjectFit}
                  label="Object Fit"
                  onChange={(e) => {
                    setLocalObjectFit(e.target.value as 'contain' | 'fill');
                    handlePropertyChange('objectFit', e.target.value as 'contain' | 'fill');
                  }}
                >
                  <MenuItem value="contain">Contain</MenuItem>
                  <MenuItem value="fill">Fill</MenuItem>
                </Select>
              </FormControl>
            </>
          )}

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

          {/* Delete Button */}
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              if (selectedObject && window.confirm(t('propertiesPanel.deleteConfirmation', { type: selectedObject.type, id: selectedObject.id }))) {
                onDeleteObject(selectedObject.id);
              }
            }}
            sx={{ mt: 3 }} // Margin top for spacing
            className="delete-btn" // Apply the CSS class
          >
            {t('propertiesPanel.deleteButton')}
          </Button>
        </Box>
      ) : (
        // UI for card properties when no object is selected
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="subtitle1">
            Card Properties: {currentCard?.name} ({currentCard?.id})
          </Typography>

          <FormControl fullWidth margin="normal">
            <InputLabel id="card-size-select-label">Card Size</InputLabel>
            <Select
              labelId="card-size-select-label"
              value={selectedSizeLabel}
              label="Card Size"
              onChange={(e) => {
                const newLabel = e.target.value;
                setSelectedSizeLabel(newLabel);
                if (newLabel === 'Custom') {
                  // User will manually enter width/height if Custom is selected
                  // For now, do nothing, or clear inputs if desired
                } else {
                  const selectedSize = PREDEFINED_CARD_SIZES.find(size => size.label === newLabel);
                  if (selectedSize && currentCard) {
                    onUpdateCardDimensions(currentCard.id, selectedSize.width, selectedSize.height);
                  }
                }
              }}
            >
              {PREDEFINED_CARD_SIZES.map((size) => (
                <MenuItem key={size.label} value={size.label}>
                  {size.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Show manual input fields only if 'Custom' is selected */}
          {selectedSizeLabel === 'Custom' && (
            <>
              <TextField
                label="Custom Width"
                value={localCardWidth}
                onChange={(e) => setLocalCardWidth(e.target.value)}
                onBlur={(e) => {
                  if (currentCard) {
                    const newWidth = parseInt(e.target.value);
                    if (!isNaN(newWidth)) {
                      onUpdateCardDimensions(currentCard.id, newWidth, currentCard.height);
                    } else {
                      setLocalCardWidth(currentCard.width.toString()); // Revert on invalid input
                    }
                  }
                }}
                fullWidth
                size="small"
                InputProps={{
                  endAdornment: <InputAdornment position="end">px</InputAdornment>,
                }}
              />
              <TextField
                label="Custom Height"
                value={localCardHeight}
                onChange={(e) => setLocalCardHeight(e.target.value)}
                onBlur={(e) => {
                  if (currentCard) {
                    const newHeight = parseInt(e.target.value);
                    if (!isNaN(newHeight)) {
                      onUpdateCardDimensions(currentCard.id, currentCard.width, newHeight);
                    } else {
                      setLocalCardHeight(currentCard.height.toString()); // Revert on invalid input
                    }
                  }
                }}
                fullWidth
                size="small"
                InputProps={{
                  endAdornment: <InputAdornment position="end">px</InputAdornment>,
                }}
              />
            </>
          )}
        </Box>
      )}
    </Box>
  );
};