import React, { useState, useEffect } from 'react';
import type { StackObject, BorderWidth, TextAlign, Card, Stack } from '../types';

interface PropertiesPanelProps {
  selectedObject: StackObject | null;
  onUpdateObject: (object: StackObject) => void;
  isRunMode: boolean;
  isMagicEnabled: boolean;
  onDeleteObject: (objectId: string) => void;
  onUpdateCardDimensions: (cardId: string, width: number, height: number) => void;
  currentCard: Card | null;
  onDeleteCard: (cardId: string) => void;
  stack: Stack;
}

// ユーティリティ関数を追加
const parseUnitValue = (value: string): number => {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
};

const PREDEFINED_CARD_SIZES = [
  { label: 'iPhone 8 Plus (414x736)', width: 414, height: 736 },
  { label: 'iPhone 12/13 (390x844)', width: 390, height: 844 },
  { label: 'iPad (768x1024)', width: 768, height: 1024 },
  { label: 'Desktop (1280x720)', width: 1280, height: 720 },
  { label: 'Custom', width: 0, height: 0 },
];

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ 
  selectedObject, 
  onUpdateObject, 
  isRunMode, 
  isMagicEnabled, 
  onDeleteObject, 
  onUpdateCardDimensions, 
  currentCard, 
  onDeleteCard, 
  stack 
}) => {
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
  const [localBackgroundColor, setLocalBackgroundColor] = useState<string>('');
  const [localColor, setLocalColor] = useState<string>('');
  const [localSrc, setLocalSrc] = useState<string>('');
  const [localObjectFit, setLocalObjectFit] = useState<'contain' | 'fill'>('contain');
  const [isTransparentBackground, setIsTransparentBackground] = useState<boolean>(false);

  // Card関連のローカルステート
  const [localCardName, setLocalCardName] = useState<string>(currentCard?.name || '');
  const [localCardWidth, setLocalCardWidth] = useState<string>(currentCard?.width ? currentCard.width.toString() : '');
  const [localCardHeight, setLocalCardHeight] = useState<string>(currentCard?.height ? currentCard.height.toString() : '');
  const [selectedSizeLabel, setSelectedSizeLabel] = useState<string>('');

  useEffect(() => {
    if (selectedObject) {
      // Object properties initialization
      setLocalX(selectedObject.x?.toString() || '');
      setLocalY(selectedObject.y?.toString() || '');
      setLocalWidth(selectedObject.width?.toString() || '');
      setLocalHeight(selectedObject.height?.toString() || '');
      setLocalText(selectedObject.text || '');
      setLocalScript(selectedObject.script || '');
      setLocalBorderColor(selectedObject.borderColor || '');
      setLocalBorderWidth(selectedObject.borderWidth || 'none');
      setLocalTextAlign(selectedObject.textAlign || 'left');
      setLocalColor(selectedObject.color || '');
      setLocalSrc(selectedObject.src || '');
      setLocalObjectFit(selectedObject.objectFit || 'contain');

      // Initialize background color and transparency
      if (selectedObject.backgroundColor === 'transparent' || selectedObject.backgroundColor === 'rgba(0,0,0,0)') {
        setIsTransparentBackground(true);
        setLocalBackgroundColor('#ffffff'); // Default color when transparent is checked
      } else {
        setIsTransparentBackground(false);
        setLocalBackgroundColor(selectedObject.backgroundColor || '');
      }
    } else {
      // Reset all object states when no object is selected
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
      setLocalColor('');
      setLocalSrc('');
      setLocalObjectFit('contain');
      setIsTransparentBackground(false);
    }

    // Initialize card dimensions
    if (currentCard) {
      setLocalCardName(currentCard.name || '');
      setLocalCardWidth(currentCard.width.toString());
      setLocalCardHeight(currentCard.height.toString());
      
      const matchedSize = PREDEFINED_CARD_SIZES.find(
        size => size.width === currentCard.width && size.height === currentCard.height
      );
      setSelectedSizeLabel(matchedSize ? matchedSize.label : 'Custom');
    } else {
      setLocalCardName('');
      setLocalCardWidth('');
      setLocalCardHeight('');
      setSelectedSizeLabel('');
    }
  }, [selectedObject, currentCard]);

  // RunModeの場合はパネルを隠す
  if (isRunMode) {
    return null;
  }

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
      // Revert to current object value if parsing fails
      if (selectedObject) {
        switch (key) {
          case 'x': setLocalX(selectedObject.x?.toString() || ''); break;
          case 'y': setLocalY(selectedObject.y?.toString() || ''); break;
          case 'width': setLocalWidth(selectedObject.width?.toString() || ''); break;
          case 'height': setLocalHeight(selectedObject.height?.toString() || ''); break;
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

  // ここにJSXの返り値を追加する必要があります
  return (
    <div className="properties-panel">
      {/* プロパティパネルのUIをここに実装 */}
      <p>Properties Panel - UI implementation needed</p>
    </div>
  );
};