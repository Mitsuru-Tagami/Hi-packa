import React, { useState, useEffect } from 'react';
import type { StackObject, BorderWidth, TextAlign, Card, Stack } from '../types';

// Remove invalid export and move these state declarations inside the PropertiesPanel component below.

interface PropertiesPanelProps {
  selectedObject: StackObject | null;
  onUpdateObject: (object: StackObject) => void;
  isRunMode: boolean;
  isMagicEnabled: boolean;
  onDeleteObject: (objectId: string) => void;
  onUpdateCardDimensions: (cardId: string, width: number, height: number) => void; // New prop
  currentCard: Card | null; // New prop
  onDeleteCard: (cardId: string) => void; // New prop for card deletion
  stack: Stack; // Stack型推奨
}

// Hide the panel completely if in run mode
export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ selectedObject, onUpdateObject, isRunMode, isMagicEnabled, onDeleteObject, onUpdateCardDimensions, currentCard, onDeleteCard, stack }) => {
  // Card関連のローカルステート
  const [localCardName, setLocalCardName] = useState<string>(currentCard?.name || '');
  const [localCardWidth, setLocalCardWidth] = useState<string>(currentCard?.width ? currentCard.width.toString() : '');
  const [localCardHeight, setLocalCardHeight] = useState<string>(currentCard?.height ? currentCard.height.toString() : '');
  const [selectedSizeLabel, setSelectedSizeLabel] = useState<string>('');

  useEffect(() => {
    if (selectedObject) {
      setLocalSrc(selectedObject.src || '');
      setLocalObjectFit(selectedObject.objectFit || 'contain');

      // Initialize background color and transparency
      if (selectedObject.backgroundColor === 'transparent' || selectedObject.backgroundColor === 'rgba(0,0,0,0)') {
        setIsTransparentBackground(true);
        setLocalBackgroundColor('#ffffff'); // Default color when transparent is checked
      } else {
        setIsTransparentBackground(false);
export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ selectedObject, onUpdateObject, isRunMode, isMagicEnabled, onDeleteObject, onUpdateCardDimensions, currentCard, onDeleteCard, stack }) => {
  // Object関連のローカルステート
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
  const [localObjectFit, setLocalObjectFit] = useState<'contain' |'fill'>('contain'); // New local state for object fit
  const [isTransparentBackground, setIsTransparentBackground] = useState<boolean>(false); // New local state for transparency

  // Card関連のローカルステート
  const [localCardName, setLocalCardName] = useState<string>(currentCard?.name || '');
  const [localCardWidth, setLocalCardWidth] = useState<string>(currentCard?.width ? currentCard.width.toString() : '');
  const [localCardHeight, setLocalCardHeight] = useState<string>(currentCard?.height ? currentCard.height.toString() : '');
  const [selectedSizeLabel, setSelectedSizeLabel] = useState<string>('');
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
}

// Remove this duplicate component definition and keep only the first, fully implemented PropertiesPanel component above.
