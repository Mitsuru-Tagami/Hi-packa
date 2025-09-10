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
import type { StackObject, BorderWidth, TextAlign, Card, Stack } from '../types';
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
  allowScriptingOnAllObjects: boolean; // New prop
  onDeleteCard: (cardId: string) => void; // New prop for card deletion
  stack: Stack; // Stack型推奨

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
        setSelectedSizeLabel(matchedSize ? matchedSize.label : 'Custom');
      } else {
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
export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ selectedObject, onUpdateObject, isRunMode, isMagicEnabled, onDeleteObject, onUpdateCardDimensions, currentCard, allowScriptingOnAllObjects, onDeleteCard, stack }) => {
  // Card関連のローカルステート
  const [localCardName, setLocalCardName] = useState<string>(currentCard?.name || '');
  const [localCardWidth, setLocalCardWidth] = useState<string>(currentCard?.width ? currentCard.width.toString() : '');
  const [localCardHeight, setLocalCardHeight] = useState<string>(currentCard?.height ? currentCard.height.toString() : '');
  const [selectedSizeLabel, setSelectedSizeLabel] = useState<string>('');
  useEffect(() => {
    setLocalCardName(currentCard?.name || '');
    setLocalCardWidth(currentCard?.width ? currentCard.width.toString() : '');
    setLocalCardHeight(currentCard?.height ? currentCard.height.toString() : '');
  }, [currentCard]);
  // ...既存の関数本体・return文...
}
