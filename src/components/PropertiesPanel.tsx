import React, { useState, useEffect } from 'react';
import type { StackObject, BorderWidth, TextAlign, Card, Stack } from '../types';
import { t } from '../i18n';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

interface PropertiesPanelProps {
  selectedObject: StackObject | null;
  onUpdateObject: (object: StackObject) => void;
  isMagicEnabled: boolean;
  stack: Stack;
  currentCard: Card | null;
  onDeleteCard: (cardId: string) => void;
  onUpdateCardDimensions: (cardId: string, width: number, height: number) => void;
  onUpdateCardName: (cardId: string, newName: string) => void;
  onDeleteObject: (objectId: string) => void; // Added this line
}

// ユーティリティ関数を追加
const parseUnitValue = (value: string): number => {
  const num = parseFloat(value);
  return isNaN(num) ? 0 : num;
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
  isMagicEnabled,
  currentCard,
  onDeleteCard,
  onUpdateCardDimensions,
  stack,
  onUpdateCardName,
  onDeleteObject // Added this line
}) => {
  // Object関連のローカルステート
  const [localX, setLocalX] = useState<string>('');
  const [localY, setLocalY] = useState<string>('');
  const [localWidth, setLocalWidth] = useState<string>('');
  const [localHeight, setLocalHeight] = useState<string>('');
  const [localText, setLocalText] = useState<string>('');
  const [localTextAlign, setLocalTextAlign] = useState<TextAlign>('left');
  const [localColor, setLocalColor] = useState<string>('');
  const [localBackgroundColor, setLocalBackgroundColor] = useState<string>('');
  const [isTransparentBackground, setIsTransparentBackground] = useState<boolean>(false);
  const [localBorderWidth, setLocalBorderWidth] = useState<BorderWidth>('none');
  const [localBorderColor, setLocalBorderColor] = useState<string>('');
  const [localSrc, setLocalSrc] = useState<string>('');
  const [localObjectFit, setLocalObjectFit] = useState<'contain' | 'fill'>('contain');
  const [localScript, setLocalScript] = useState<string>('');

  // Card関連のローカルステート
  const [localCardName, setLocalCardName] = useState<string>('');
  const [localCardWidth, setLocalCardWidth] = useState<string>('');
  const [localCardHeight, setLocalCardHeight] = useState<string>('');
  const [selectedSizeLabel, setSelectedSizeLabel] = useState<string>('sizeCustom');

  // オブジェクトプロパティの同期
  useEffect(() => {
    if (selectedObject) {
      setLocalX(selectedObject.x.toString());
      setLocalY(selectedObject.y.toString());
      setLocalWidth(selectedObject.width.toString());
      setLocalHeight(selectedObject.height.toString());
      setLocalText(selectedObject.text || '');
      setLocalTextAlign(selectedObject.textAlign || 'left');
      setLocalColor(selectedObject.color || '');
      setIsTransparentBackground(selectedObject.backgroundColor === 'transparent');
      setLocalBackgroundColor(selectedObject.backgroundColor === 'transparent' ? '#ffffff' : selectedObject.backgroundColor || '');
      setLocalBorderWidth(selectedObject.borderWidth || 'none');
      setLocalBorderColor(selectedObject.borderColor || '');
      setLocalSrc(selectedObject.src || '');
      setLocalObjectFit(selectedObject.objectFit || 'contain');
      setLocalScript(selectedObject.script || '');
    } else {
      // オブジェクトが選択されていない場合はリセット
      setLocalX('');
      setLocalY('');
      setLocalWidth('');
      setLocalHeight('');
      setLocalText('');
      setLocalTextAlign('left');
      setLocalColor('');
      setIsTransparentBackground(false);
      setLocalBackgroundColor('');
      setLocalBorderWidth('none');
      setLocalBorderColor('');
      setLocalSrc('');
      setLocalObjectFit('contain');
      setLocalScript('');
    }
  }, [selectedObject]);

  // カードプロパティの同期
  useEffect(() => {
    if (currentCard) {
      setLocalCardName(currentCard.name);
      setLocalCardWidth(currentCard.width.toString());
      setLocalCardHeight(currentCard.height.toString());
      const currentSize = PREDEFINED_CARD_SIZES.find(size => size.width === currentCard.width && size.height === currentCard.height);
      setSelectedSizeLabel(currentSize ? currentSize.label : 'sizeCustom');
    } else {
      setLocalCardName('');
      setLocalCardWidth('');
      setLocalCardHeight('');
      setSelectedSizeLabel('sizeCustom');
    }
  }, [currentCard]);

  const handlePropertyChange = (key: keyof StackObject, value: any) => {
    if (selectedObject) {
      onUpdateObject({ ...selectedObject, [key]: value });
    }
  };

  const handleNumberInputLocalChange = (setter: React.Dispatch<React.SetStateAction<string>>, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setter(e.target.value);
  };

  const handleTransparentToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsTransparentBackground(e.target.checked);
    if (e.target.checked) {
      handlePropertyChange('backgroundColor', 'transparent');
    } else {
      handlePropertyChange('backgroundColor', localBackgroundColor === 'transparent' ? '#ffffff' : localBackgroundColor);
    }
  };

  const handleBackgroundColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalBackgroundColor(e.target.value);
    setIsTransparentBackground(false);
    handlePropertyChange('backgroundColor', e.target.value);
  };

  return (
    <Box sx={{ p: 2, height: '100%', overflowY: 'auto' }}>
      {/* Card Properties Section */}
      {currentCard && (
        <Box sx={{ mb: 3, p: 1.5, border: '1px solid #ddd', borderRadius: 1 }}>
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <TextField
              label={t('propertiesPanel.cardName')}
              variant="outlined"
              size="small"
              value={localCardName}
              onChange={(e) => setLocalCardName(e.target.value)}
              onBlur={() => {
                if (currentCard) {
                  onUpdateCardName(currentCard.id, localCardName);
                }
              }}
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }} size="small">
            <InputLabel>{t('propertiesPanel.sizePreset')}</InputLabel>
            <Select
              label={t('propertiesPanel.sizePreset')}
              value={selectedSizeLabel}
              onChange={(e) => {
                const selectedSize = PREDEFINED_CARD_SIZES.find(size => size.label === e.target.value);
                if (selectedSize && selectedSize.width > 0) {
                  // Show warning dialog before applying changes
                  if (window.confirm(t('deleteCardWarning'))) {
                    setLocalCardWidth(selectedSize.width.toString());
                    setLocalCardHeight(selectedSize.height.toString());
                    onUpdateCardDimensions(currentCard.id, selectedSize.width, selectedSize.height);
                    setSelectedSizeLabel(e.target.value);
                  }
                } else {
                  setSelectedSizeLabel(e.target.value);
                }
              }}
            >
              {PREDEFINED_CARD_SIZES.map(size => (
                <MenuItem key={size.label} value={size.label}>{t(`propertiesPanel.${size.label}`)}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label={t('propertiesPanel.width')}
              type="number"
              variant="outlined"
              size="small"
              fullWidth
              value={localCardWidth}
              onChange={(e) => setLocalCardWidth(e.target.value)}
              onBlur={() => {
                const width = parseInt(localCardWidth);
                const height = parseInt(localCardHeight);
                if (currentCard && !isNaN(width) && !isNaN(height)) {
                  onUpdateCardDimensions(currentCard.id, width, height);
                }
              }}
            />
            <TextField
              label={t('propertiesPanel.height')}
              type="number"
              variant="outlined"
              size="small"
              fullWidth
              value={localCardHeight}
              onChange={(e) => setLocalCardHeight(e.target.value)}
              onBlur={() => {
                const width = parseInt(localCardWidth);
                const height = parseInt(localCardHeight);
                if (currentCard && !isNaN(width) && !isNaN(height)) {
                  onUpdateCardDimensions(currentCard.id, width, height);
                }
              }}
            />
          </Box>

          <Button
            variant="contained"
            color="error"
            fullWidth
            onClick={() => {
              if (window.confirm(t('deleteCardWarning'))) {
                onDeleteCard(currentCard.id);
              }
            }}
            disabled={stack.cards.length <= 1}
            sx={{ mt: 1 }}
          >
            {t('propertiesPanel.deleteCard')}
          </Button>
        </Box>
      )}

      {/* Object Properties Section */}
      {selectedObject ? (
        <Box sx={{ p: 1.5, border: '1px solid #ddd', borderRadius: 1 }}>
          <h4>{{
            text: t('text'),
            image: t('imageName'),
            button: t('defaultButtonText'),
          }[selectedObject.type] || selectedObject.type}</h4>
          
          {/* Position and Size */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
            <TextField
              label={t('propertiesPanel.positionX')}
              type="number"
              variant="outlined"
              size="small"
              value={localX}
              onChange={(e) => handleNumberInputLocalChange(setLocalX, e)}
              onBlur={() => handlePropertyChange('x', parseUnitValue(localX))}
            />
            <TextField
              label={t('propertiesPanel.positionY')}
              type="number"
              variant="outlined"
              size="small"
              value={localY}
              onChange={(e) => handleNumberInputLocalChange(setLocalY, e)}
              onBlur={() => handlePropertyChange('y', parseUnitValue(localY))}
            />
            <TextField
              label={t('propertiesPanel.width')}
              type="number"
              variant="outlined"
              size="small"
              value={localWidth}
              onChange={(e) => handleNumberInputLocalChange(setLocalWidth, e)}
              onBlur={() => handlePropertyChange('width', parseUnitValue(localWidth))}
            />
            <TextField
              label={t('propertiesPanel.height')}
              type="number"
              variant="outlined"
              size="small"
              value={localHeight}
              onChange={(e) => handleNumberInputLocalChange(setLocalHeight, e)}
              onBlur={() => handlePropertyChange('height', parseUnitValue(localHeight))}
            />
          </Box>

          {/* Text Content */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <TextField
              label={t('propertiesPanel.textLabel')}
              variant="outlined"
              multiline
              rows={3}
              value={localText}
              onChange={(e) => {
                setLocalText(e.target.value);
                handlePropertyChange('text', e.target.value);
              }}
            />
          </FormControl>

          {/* Text Alignment */}
          <FormControl fullWidth sx={{ mb: 2 }} size="small">
            <InputLabel>{t('propertiesPanel.textAlign')}</InputLabel>
            <Select
              label={t('propertiesPanel.textAlign')}
              value={localTextAlign}
              onChange={(e) => {
                const value = e.target.value as TextAlign;
                setLocalTextAlign(value);
                handlePropertyChange('textAlign', value);
              }}
            >
              <MenuItem value="left">{t('propertiesPanel.alignLeft')}</MenuItem>
              <MenuItem value="center">{t('propertiesPanel.alignCenter')}</MenuItem>
              <MenuItem value="right">{t('propertiesPanel.alignRight')}</MenuItem>
            </Select>
          </FormControl>

          {/* Colors */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <TextField
              label={t('propertiesPanel.textColor')}
              variant="outlined"
              type="color"
              size="small"
              value={localColor || '#000000'}
              onChange={(e) => {
                setLocalColor(e.target.value);
                handlePropertyChange('color', e.target.value);
              }}
              fullWidth
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isTransparentBackground}
                  onChange={handleTransparentToggle}
                />
              }
              label={t('propertiesPanel.transparentBackground')}
            />
            {!isTransparentBackground && (
              <TextField
                label={t('propertiesPanel.backgroundColor')}
                variant="outlined"
                type="color"
                size="small"
                value={localBackgroundColor || '#ffffff'}
                onChange={handleBackgroundColorChange}
                fullWidth
              />
            )}
          </FormControl>

          {/* Border */}
          <FormControl fullWidth sx={{ mb: 2 }} size="small">
            <InputLabel>{t('propertiesPanel.borderWidth')}</InputLabel>
            <Select
              label={t('propertiesPanel.borderWidth')}
              value={localBorderWidth}
              onChange={(e) => {
                const value = e.target.value as BorderWidth;
                setLocalBorderWidth(value);
                handlePropertyChange('borderWidth', value);
              }}
            >
              <MenuItem value="none">{t('propertiesPanel.borderNone')}</MenuItem>
              <MenuItem value="thin">{t('propertiesPanel.borderThin')}</MenuItem>
              <MenuItem value="medium">{t('propertiesPanel.borderMedium')}</MenuItem>
              <MenuItem value="thick">{t('propertiesPanel.borderThick')}</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <TextField
              label={t('propertiesPanel.borderColor')}
              variant="outlined"
              type="color"
              size="small"
              value={localBorderColor || '#000000'}
              onChange={(e) => {
                setLocalBorderColor(e.target.value);
                handlePropertyChange('borderColor', e.target.value);
              }}
              fullWidth
            />
          </FormControl>

          {/* Button specific properties */}
          {selectedObject.type === 'button' && (
            <Box sx={{ mt: 2 }}>
              <FormControl fullWidth sx={{ mb: 2 }} size="small">
                <InputLabel>{t('propertiesPanel.buttonAction')}</InputLabel>
                <Select
                  label={t('propertiesPanel.buttonAction')}
                  value={selectedObject.action || 'none'}
                  onChange={(e) => {
                    const value = e.target.value as 'none' | 'jumpToCard' | 'jumpToCardAnchor' | 'openUrl' | 'script';
                    handlePropertyChange('action', value);
                    if (value === 'none') {
                      handlePropertyChange('jumpToCardId', null);
                      handlePropertyChange('src', '');
                    }
                  }}
                >
                  <MenuItem value="none">{t('propertiesPanel.actionNone')}</MenuItem>
                  <MenuItem value="jumpToCard">{t('propertiesPanel.actionJumpToCard')}</MenuItem>
                  <MenuItem value="jumpToCardAnchor">{t('propertiesPanel.actionJumpToCardAnchor')}</MenuItem>
                  <MenuItem value="openUrl">{t('propertiesPanel.actionOpenUrl')}</MenuItem>
                  {isMagicEnabled && <MenuItem value="script">{t('propertiesPanel.actionScript')}</MenuItem>}
                </Select>
              </FormControl>

              {(selectedObject.action === 'jumpToCard' || selectedObject.action === 'jumpToCardAnchor') && (
                <FormControl fullWidth sx={{ mb: 2 }} size="small">
                  <InputLabel>{t('propertiesPanel.targetCard')}</InputLabel>
                  <Select
                    label={t('propertiesPanel.targetCard')}
                    value={selectedObject.jumpToCardId || ''}
                    onChange={(e) => {
                      handlePropertyChange('jumpToCardId', e.target.value || null);
                    }}
                  >
                    <MenuItem value="">{t('propertiesPanel.selectCard')}</MenuItem>
                    {stack.cards.map(card => (
                      <MenuItem key={card.id} value={card.id}>{card.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {selectedObject.action === 'openUrl' && (
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <TextField
                    label={t('propertiesPanel.url')}
                    variant="outlined"
                    size="small"
                    value={selectedObject.src || ''}
                    onChange={(e) => {
                      handlePropertyChange('src', e.target.value);
                    }}
                    placeholder={t('propertiesPanel.urlPlaceholder')}
                  />
                </FormControl>
              )}
            </Box>
          )}

          {/* Image specific properties */}
          {selectedObject.type === 'image' && (
            <Box sx={{ mt: 2 }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <TextField
                  label={t('propertiesPanel.imageSource')}
                  variant="outlined"
                  size="small"
                  value={localSrc}
                  onChange={(e) => {
                    setLocalSrc(e.target.value);
                    handlePropertyChange('src', e.target.value);
                  }}
                  placeholder={t('propertiesPanel.imagePlaceholder')}
                />
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }} size="small">
                <InputLabel>{t('propertiesPanel.objectFit')}</InputLabel>
                <Select
                  label={t('propertiesPanel.objectFit')}
                  value={localObjectFit}
                  onChange={(e) => {
                    const value = e.target.value as 'contain' | 'fill';
                    setLocalObjectFit(value);
                    handlePropertyChange('objectFit', value);
                  }}
                >
                  <MenuItem value="contain">{t('propertiesPanel.objectFitContain')}</MenuItem>
                  <MenuItem value="fill">{t('propertiesPanel.objectFitFill')}</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}

          {/* Script Section */}
          {isMagicEnabled && (
            <FormControl fullWidth sx={{ mb: 2 }}>
              <TextField
                label={t('propertiesPanel.scriptLabel')}
                variant="outlined"
                multiline
                rows={4}
                value={localScript}
                onChange={(e) => {
                  setLocalScript(e.target.value);
                  handlePropertyChange('script', e.target.value);
                }}
                placeholder={t('propertiesPanel.scriptPlaceholder')}
                InputProps={{
                  style: { fontFamily: 'monospace' }
                }}
              />
            </FormControl>
          )}

          {/* Delete Object Button */}
          <Button
            variant="contained"
            color="error"
            fullWidth
            onClick={() => onDeleteObject(selectedObject.id)}
            sx={{ mt: 2 }}
          >
            {t('propertiesPanel.deleteButton')}
          </Button>
        </Box>
      ) : (
        <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
          <p>{t('propertiesPanel.selectObjectMessage')}</p>
        </Box>
      )}
    </Box>
  );
};

export default PropertiesPanel;
