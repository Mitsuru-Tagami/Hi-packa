import React, { useState, useEffect } from 'react';
import type { StackObject, BorderWidth, TextAlign, Card, Stack } from '../types';
import { t } from '../i18n';

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
  onUpdateCardName: (cardId: string, newName: string) => void;
}

// ユーティリティ関数を追加
const parseUnitValue = (value: string): number => {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
};

const PREDEFINED_CARD_SIZES = [
  { label: 'sizeIPhone8Plus', width: 414, height: 736 },
  { label: 'sizeIPhone8PlusLandscape', width: 736, height: 414 },
  { label: 'sizeIPhone12', width: 390, height: 844 },
  { label: 'sizeIPhone12Landscape', width: 844, height: 390 },
  { label: 'sizeIPad', width: 768, height: 1024 },
  { label: 'sizeDesktop', width: 1280, height: 720 },
  { label: 'sizeCustom', width: 0, height: 0 },
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
  stack,
  onUpdateCardName
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
      {/* Card Properties Section */}
      {currentCard && (
        <div style={{ marginBottom: '24px', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }}>
          <h4>{t('propertiesPanel.cardProperties')}</h4>
          
          <div style={{ marginBottom: '12px' }}>
            <label>{t('propertiesPanel.cardName')}:</label>
            <input
              type="text"
              value={localCardName}
              onChange={(e) => setLocalCardName(e.target.value)}
              onBlur={() => {
                if (currentCard) {
                  onUpdateCardName(currentCard.id, localCardName);
                }
              }}
              style={{ width: '100%', padding: '4px', marginTop: '4px' }}
            />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label>{t('propertiesPanel.sizePreset')}:</label>
            <select
              value={selectedSizeLabel}
              onChange={(e) => {
                const selectedSize = PREDEFINED_CARD_SIZES.find(size => size.label === e.target.value);
                if (selectedSize && selectedSize.width > 0) {
                  // Show warning dialog before applying changes
                  const confirmed = window.confirm(t('propertiesPanel.cardSizeChangeWarning'));
                  if (confirmed) {
                    setLocalCardWidth(selectedSize.width.toString());
                    setLocalCardHeight(selectedSize.height.toString());
                    onUpdateCardDimensions(currentCard.id, selectedSize.width, selectedSize.height);
                    setSelectedSizeLabel(e.target.value);
                  } else {
                    // Reset to current selection if user cancels
                    return;
                  }
                } else {
                  setSelectedSizeLabel(e.target.value);
                }
              }}
              style={{ width: '100%', padding: '4px', marginTop: '4px' }}
            >
              {PREDEFINED_CARD_SIZES.map(size => (
                <option key={size.label} value={size.label}>{t(`propertiesPanel.${size.label}`)}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <div style={{ flex: 1 }}>
              <label>{t('propertiesPanel.width')}:</label>
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
              <label>{t('propertiesPanel.height')}:</label>
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
                  'Are you sure you want to delete this card? This action cannot be undone.'
                );
                if (confirmed) {
                  onDeleteCard(currentCard.id);
                }
              }
            }}
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '8px',
              backgroundColor: stack.cards.length > 1 ? '#dc3545' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: stack.cards.length > 1 ? 'pointer' : 'not-allowed'
            }}
            disabled={stack.cards.length <= 1}
          >
{t('propertiesPanel.deleteCard')}
          </button>
        </div>
      )}

      {/* Object Properties Section */}
      {selectedObject ? (
        <div style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }}>
          <h4>{t('propertiesPanel.objectProperties')} ({selectedObject.type})</h4>
          
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
            <label>{t('propertiesPanel.textLabel')}:</label>
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
            <label>{t('propertiesPanel.textAlign')}:</label>
            <select
              value={localTextAlign}
              onChange={(e) => {
                const value = e.target.value as TextAlign;
                setLocalTextAlign(value);
                handlePropertyChange('textAlign', value);
              }}
              style={{ width: '100%', padding: '4px', marginTop: '4px' }}
            >
              <option value="left">{t('propertiesPanel.alignLeft')}</option>
              <option value="center">{t('propertiesPanel.alignCenter')}</option>
              <option value="right">{t('propertiesPanel.alignRight')}</option>
            </select>
          </div>

          {/* Colors */}
          <div style={{ marginBottom: '12px' }}>
            <label>{t('propertiesPanel.textColor')}:</label>
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
              {t('propertiesPanel.transparentBackground')}
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
            <label>{t('propertiesPanel.borderWidth')}:</label>
            <select
              value={localBorderWidth}
              onChange={(e) => {
                const value = e.target.value as BorderWidth;
                setLocalBorderWidth(value);
                handlePropertyChange('borderWidth', value);
              }}
              style={{ width: '100%', padding: '4px', marginTop: '4px' }}
            >
              <option value="none">{t('propertiesPanel.borderNone')}</option>
              <option value="thin">{t('propertiesPanel.borderThin')}</option>
              <option value="medium">{t('propertiesPanel.borderMedium')}</option>
              <option value="thick">{t('propertiesPanel.borderThick')}</option>
            </select>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label>{t('propertiesPanel.borderColor')}:</label>
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

          {/* Button specific properties */}
          {selectedObject.type === 'button' && (
            <>
              <div style={{ marginBottom: '12px' }}>
                <label>{t('propertiesPanel.buttonAction')}:</label>
                <select
                  value={selectedObject.action || 'none'}
                  onChange={(e) => {
                    const value = e.target.value as 'none' | 'jumpToCard' | 'jumpToCardAnchor' | 'openUrl' | 'script';
                    handlePropertyChange('action', value);
                    if (value === 'none') {
                      handlePropertyChange('jumpToCardId', null);
                      handlePropertyChange('src', '');
                    }
                  }}
                  style={{ width: '100%', padding: '4px', marginTop: '4px' }}
                >
                  <option value="none">{t('propertiesPanel.actionNone')}</option>
                  <option value="jumpToCard">{t('propertiesPanel.actionJumpToCard')}</option>
                  <option value="jumpToCardAnchor">{t('propertiesPanel.actionJumpToCardAnchor')}</option>
                  <option value="openUrl">{t('propertiesPanel.actionOpenUrl')}</option>
                  {isMagicEnabled && <option value="script">{t('propertiesPanel.actionScript')}</option>}
                </select>
              </div>

              {(selectedObject.action === 'jumpToCard' || selectedObject.action === 'jumpToCardAnchor') && (
                <div style={{ marginBottom: '12px' }}>
                  <label>{t('propertiesPanel.targetCard')}:</label>
                  <select
                    value={selectedObject.jumpToCardId || ''}
                    onChange={(e) => {
                      handlePropertyChange('jumpToCardId', e.target.value || null);
                    }}
                    style={{ width: '100%', padding: '4px', marginTop: '4px' }}
                  >
                    <option value="">{t('propertiesPanel.selectCard')}</option>
                    {stack.cards.map(card => (
                      <option key={card.id} value={card.id}>{card.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {selectedObject.action === 'openUrl' && (
                <div style={{ marginBottom: '12px' }}>
                  <label>{t('propertiesPanel.url')}:</label>
                  <input
                    type="text"
                    value={selectedObject.src || ''}
                    onChange={(e) => {
                      handlePropertyChange('src', e.target.value);
                    }}
                    placeholder={t('propertiesPanel.urlPlaceholder')}
                    style={{ width: '100%', padding: '4px', marginTop: '4px' }}
                  />
                </div>
              )}
            </>
          )}

          {/* Image specific properties */}
          {selectedObject.type === 'image' && (
            <>
              <div style={{ marginBottom: '12px' }}>
                <label>{t('propertiesPanel.imageSource')}:</label>
                <input
                  type="text"
                  value={localSrc}
                  onChange={(e) => {
                    setLocalSrc(e.target.value);
                    handlePropertyChange('src', e.target.value);
                  }}
                  placeholder={t('propertiesPanel.imagePlaceholder')}
                  style={{ width: '100%', padding: '4px', marginTop: '4px' }}
                />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label>{t('propertiesPanel.objectFit')}:</label>
                <select
                  value={localObjectFit}
                  onChange={(e) => {
                    const value = e.target.value as 'contain' | 'fill';
                    setLocalObjectFit(value);
                    handlePropertyChange('objectFit', value);
                  }}
                  style={{ width: '100%', padding: '4px', marginTop: '4px' }}
                >
                  <option value="contain">{t('propertiesPanel.objectFitContain')}</option>
                  <option value="fill">{t('propertiesPanel.objectFitFill')}</option>
                </select>
              </div>
            </>
          )}

          {/* Script Section */}
          {isMagicEnabled && (
            <div style={{ marginBottom: '12px' }}>
              <label>{t('propertiesPanel.scriptLabel')}:</label>
              <textarea
                value={localScript}
                onChange={(e) => {
                  setLocalScript(e.target.value);
                  handlePropertyChange('script', e.target.value);
                }}
                placeholder={t('propertiesPanel.scriptPlaceholder')}
                style={{ width: '100%', padding: '4px', marginTop: '4px', minHeight: '80px', fontFamily: 'monospace' }}
              />
            </div>
          )}

          {/* Delete Object Button */}
          <button
            onClick={() => onDeleteObject(selectedObject.id)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#ff4444',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {t('propertiesPanel.deleteButton')}
          </button>
        </div>
      ) : (
        <div style={{ padding: '12px', textAlign: 'center', color: '#666' }}>
          <p>{t('propertiesPanel.selectObjectMessage')}</p>
        </div>
      )}
      
    </div>
  );
};