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

  return (
    <div style={{ padding: '16px', height: '100%', overflow: 'auto' }}>
      <h3>Properties</h3>
      
      {/* Card Properties Section */}
      {currentCard && (
        <div style={{ marginBottom: '24px', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }}>
          <h4>Card Properties</h4>
          
          <div style={{ marginBottom: '12px' }}>
            <label>Card Name:</label>
            <input
              type="text"
              value={localCardName}
              onChange={(e) => setLocalCardName(e.target.value)}
              onBlur={() => {
                if (currentCard) {
                  // onUpdateCardName(currentCard.id, localCardName);
                }
              }}
              style={{ width: '100%', padding: '4px', marginTop: '4px' }}
            />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label>Size Preset:</label>
            <select
              value={selectedSizeLabel}
              onChange={(e) => {
                const selectedSize = PREDEFINED_CARD_SIZES.find(size => size.label === e.target.value);
                if (selectedSize && selectedSize.width > 0) {
                  setLocalCardWidth(selectedSize.width.toString());
                  setLocalCardHeight(selectedSize.height.toString());
                  onUpdateCardDimensions(currentCard.id, selectedSize.width, selectedSize.height);
                }
                setSelectedSizeLabel(e.target.value);
              }}
              style={{ width: '100%', padding: '4px', marginTop: '4px' }}
            >
              {PREDEFINED_CARD_SIZES.map(size => (
                <option key={size.label} value={size.label}>{size.label}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <div style={{ flex: 1 }}>
              <label>Width:</label>
              <input
                type="number"
                value={localCardWidth}
                onChange={(e) => setLocalCardWidth(e.target.value)}
                onBlur={() => {
                  const width = parseInt(localCardWidth);
                  const height = parseInt(localCardHeight);
                  if (!isNaN(width) && !isNaN(height)) {
                    onUpdateCardDimensions(currentCard.id, width, height);
                  }
                }}
                style={{ width: '100%', padding: '4px', marginTop: '4px' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label>Height:</label>
              <input
                type="number"
                value={localCardHeight}
                onChange={(e) => setLocalCardHeight(e.target.value)}
                onBlur={() => {
                  const width = parseInt(localCardWidth);
                  const height = parseInt(localCardHeight);
                  if (!isNaN(width) && !isNaN(height)) {
                    onUpdateCardDimensions(currentCard.id, width, height);
                  }
                }}
                style={{ width: '100%', padding: '4px', marginTop: '4px' }}
              />
            </div>
          </div>

          <button
            onClick={() => {
              if (stack.cards.length > 1) {
                const confirmed = window.confirm(
                  'カードを削除すると取り消しがききません。\n' +
                  'このカード内のすべてのオブジェクト（ボタン、テキスト、画像）も一緒に削除されます。\n\n' +
                  '本当に削除しますか？'
                );
                if (confirmed) {
                  onDeleteCard(currentCard.id);
                }
              }
            }}
            disabled={stack.cards.length <= 1}
            style={{
              padding: '8px 16px',
              backgroundColor: stack.cards.length > 1 ? '#ff4444' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: stack.cards.length > 1 ? 'pointer' : 'not-allowed'
            }}
          >
            Delete Card
          </button>
        </div>
      )}

      {/* Object Properties Section */}
      {selectedObject ? (
        <div style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }}>
          <h4>Object Properties ({selectedObject.type})</h4>
          
          {/* Position and Size */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
            <div>
              <label>X:</label>
              <input
                type="number"
                value={localX}
                onChange={(e) => handleNumberInputLocalChange(setLocalX, e)}
                onBlur={() => handleNumberInputBlur('x', localX)}
                style={{ width: '100%', padding: '4px', marginTop: '4px' }}
              />
            </div>
            <div>
              <label>Y:</label>
              <input
                type="number"
                value={localY}
                onChange={(e) => handleNumberInputLocalChange(setLocalY, e)}
                onBlur={() => handleNumberInputBlur('y', localY)}
                style={{ width: '100%', padding: '4px', marginTop: '4px' }}
              />
            </div>
            <div>
              <label>Width:</label>
              <input
                type="number"
                value={localWidth}
                onChange={(e) => handleNumberInputLocalChange(setLocalWidth, e)}
                onBlur={() => handleNumberInputBlur('width', localWidth)}
                style={{ width: '100%', padding: '4px', marginTop: '4px' }}
              />
            </div>
            <div>
              <label>Height:</label>
              <input
                type="number"
                value={localHeight}
                onChange={(e) => handleNumberInputLocalChange(setLocalHeight, e)}
                onBlur={() => handleNumberInputBlur('height', localHeight)}
                style={{ width: '100%', padding: '4px', marginTop: '4px' }}
              />
            </div>
          </div>

          {/* Text Content */}
          <div style={{ marginBottom: '12px' }}>
            <label>Text:</label>
            <textarea
              value={localText}
              onChange={(e) => {
                setLocalText(e.target.value);
                handlePropertyChange('text', e.target.value);
              }}
              style={{ width: '100%', padding: '4px', marginTop: '4px', minHeight: '60px' }}
            />
          </div>

          {/* Text Alignment */}
          <div style={{ marginBottom: '12px' }}>
            <label>Text Align:</label>
            <select
              value={localTextAlign}
              onChange={(e) => {
                const value = e.target.value as TextAlign;
                setLocalTextAlign(value);
                handlePropertyChange('textAlign', value);
              }}
              style={{ width: '100%', padding: '4px', marginTop: '4px' }}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>

          {/* Colors */}
          <div style={{ marginBottom: '12px' }}>
            <label>Text Color:</label>
            <input
              type="color"
              value={localColor || '#000000'}
              onChange={(e) => {
                setLocalColor(e.target.value);
                handlePropertyChange('color', e.target.value);
              }}
              style={{ width: '100%', padding: '4px', marginTop: '4px' }}
            />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label>
              <input
                type="checkbox"
                checked={isTransparentBackground}
                onChange={handleTransparentToggle}
                style={{ marginRight: '8px' }}
              />
              Transparent Background
            </label>
            {!isTransparentBackground && (
              <input
                type="color"
                value={localBackgroundColor || '#ffffff'}
                onChange={handleBackgroundColorChange}
                style={{ width: '100%', padding: '4px', marginTop: '4px' }}
              />
            )}
          </div>

          {/* Border */}
          <div style={{ marginBottom: '12px' }}>
            <label>Border Width:</label>
            <select
              value={localBorderWidth}
              onChange={(e) => {
                const value = e.target.value as BorderWidth;
                setLocalBorderWidth(value);
                handlePropertyChange('borderWidth', value);
              }}
              style={{ width: '100%', padding: '4px', marginTop: '4px' }}
            >
              <option value="none">None</option>
              <option value="thin">Thin</option>
              <option value="medium">Medium</option>
              <option value="thick">Thick</option>
            </select>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label>Border Color:</label>
            <input
              type="color"
              value={localBorderColor || '#000000'}
              onChange={(e) => {
                setLocalBorderColor(e.target.value);
                handlePropertyChange('borderColor', e.target.value);
              }}
              style={{ width: '100%', padding: '4px', marginTop: '4px' }}
            />
          </div>

          {/* Image specific properties */}
          {selectedObject.type === 'image' && (
            <>
              <div style={{ marginBottom: '12px' }}>
                <label>Image Source:</label>
                <input
                  type="text"
                  value={localSrc}
                  onChange={(e) => {
                    setLocalSrc(e.target.value);
                    handlePropertyChange('src', e.target.value);
                  }}
                  placeholder="Enter image URL"
                  style={{ width: '100%', padding: '4px', marginTop: '4px' }}
                />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label>Object Fit:</label>
                <select
                  value={localObjectFit}
                  onChange={(e) => {
                    const value = e.target.value as 'contain' | 'fill';
                    setLocalObjectFit(value);
                    handlePropertyChange('objectFit', value);
                  }}
                  style={{ width: '100%', padding: '4px', marginTop: '4px' }}
                >
                  <option value="contain">Contain</option>
                  <option value="fill">Fill</option>
                </select>
              </div>
            </>
          )}

          {/* Script Section */}
          {isMagicEnabled && (
            <div style={{ marginBottom: '12px' }}>
              <label>Script:</label>
              <textarea
                value={localScript}
                onChange={(e) => {
                  setLocalScript(e.target.value);
                  handlePropertyChange('script', e.target.value);
                }}
                placeholder="Enter JavaScript code here..."
                style={{ width: '100%', padding: '4px', marginTop: '4px', minHeight: '80px', fontFamily: 'monospace' }}
              />
            </div>
          )}

          {/* Delete Object Button */}
          <button
            onClick={() => {
              const objectTypeText = selectedObject.type === 'button' ? 'ボタン' : 
                                   selectedObject.type === 'text' ? 'テキスト' : 
                                   selectedObject.type === 'image' ? '画像' : 'オブジェクト';
              
              const confirmed = window.confirm(
                `${objectTypeText}を削除すると取り消しがききません。\n\n` +
                '本当に削除しますか？'
              );
              
              if (confirmed) {
                onDeleteObject(selectedObject.id);
              }
            }}
            style={{
              padding: '8px 16px',
              backgroundColor: '#ff4444',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Delete Object
          </button>
        </div>
      ) : (
        <div style={{ padding: '12px', textAlign: 'center', color: '#666' }}>
          <p>Select an object to edit its properties</p>
        </div>
      )}
    </div>
  );
};