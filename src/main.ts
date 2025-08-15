import './style.css';
import interact from 'interactjs';
import i18next, { t } from './i18n';

// --- タイプ定義 ---
type ObjectType = 'button' | 'text' | 'image';
type TextAlign = 'left' | 'center' | 'right';
type BorderWidth = 'none' | 'thin' | 'medium' | 'thick';
type ButtonAction = 'none' | 'jumpToCard';

const borderWidthMap: Record<BorderWidth, string> = {
  none: '0px',
  thin: '1px',
  medium: '2px',
  thick: '4px',
};

type StackObject = {
  id: string;
  type: ObjectType;
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  textAlign: TextAlign;
  borderWidth: BorderWidth;
  script: string;
  action?: ButtonAction;
  jumpToCardId?: string | null;
  src?: string;
  objectFit?: 'contain' | 'fill';
  // New text formatting properties
  fontSize?: string;
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
  textDecoration?: 'none' | 'underline';
  color?: string;
  fontFamily?: string;
};

type Card = {
  id: string;
  name: string;
  objects: StackObject[];
};

type Stack = {
  cards: Card[];
  currentCardId: string | null;
};

// --- アプリケーションの状態 ---
let isMagicEnabled = false;
let isRunMode = false;

const app = document.querySelector<HTMLDivElement>('#app')!;
const cardListPanel = document.createElement('div');
cardListPanel.id = 'card-list-panel';
const mainContent = document.createElement('div');
mainContent.id = 'main-content';
const propertiesPanel = document.createElement('div');
propertiesPanel.id = 'properties-panel';
const canvas = document.createElement('div');
canvas.id = 'card-canvas';

mainContent.appendChild(canvas);
app.appendChild(cardListPanel);
app.appendChild(mainContent);
app.appendChild(propertiesPanel);

const gameCardId = 'card-janken-main';
const winCardId = 'card-janken-win';
const loseCardId = 'card-janken-lose';

// This is the script that will be shared by the three choice buttons.
// We pass the player's choice as an argument.
const playJankenScript = (playerChoice: 'rock' | 'paper' | 'scissors') => `
  const choices = ['rock', 'paper', 'scissors'];
  const computerChoice = choices[Math.floor(Math.random() * 3)];

  const getOutcome = (p, c) => {
    if (p === c) return 'draw';
    if ((p === 'rock' && c === 'scissors') || (p === 'scissors' && c === 'paper') || (p === 'paper' && c === 'rock')) return 'win';
    return 'lose';
  };

  const outcome = getOutcome('${playerChoice}', computerChoice);

  if (outcome === 'win') {
    switchCard('${winCardId}');
  } else if (outcome === 'lose') {
    switchCard('${loseCardId}');
  } else {
    const currentCard = stack.cards.find(c => c.id === stack.currentCardId);
    const resultText = currentCard.objects.find(o => o.id === 'obj-janken-result');
    if (resultText) {
      const choiceMap = {rock: 'ぐー', paper: 'ぱー', scissors: 'ちょき'};
      resultText.text = 'あいこ！ (相手: ' + choiceMap[computerChoice] + ')';
      // Clear the text after a while
      setTimeout(() => {
        if (resultText.text.startsWith('あいこ')) { // Only clear if it's still the draw message
          resultText.text = '';
          renderAll();
        }
      }, 1500);
      renderAll();
    }
  }
`;

const stack: Stack = {
  cards: [
    // 1. Main Game Card
    {
      id: gameCardId,
      name: 'じゃんけんゲーム',
      objects: [
        {
          id: 'obj-janken-title',
          type: 'text',
          x: 57, y: 80, width: 300, height: 50,
          text: 'じゃんけん勝負！',
          textAlign: 'center',
          fontSize: '32px',
          fontWeight: 'bold',
          borderWidth: 'none',
          script: '',
          color: '#333333',
        },
        {
          id: 'obj-janken-prompt',
          type: 'text',
          x: 107, y: 150, width: 200, height: 30,
          text: '手を選んでね',
          textAlign: 'center',
          fontSize: '20px',
          borderWidth: 'none',
          script: '',
          color: '#333333',
        },
        {
          id: 'obj-janken-rock',
          type: 'button',
          x: 107, y: 220, width: 200, height: 60,
          text: 'ぐー ✊',
          textAlign: 'center',
          fontSize: '24px',
          borderWidth: 'medium',
          script: playJankenScript('rock'),
        },
        {
          id: 'obj-janken-scissors',
          type: 'button',
          x: 107, y: 300, width: 200, height: 60,
          text: 'ちょき ✌️',
          textAlign: 'center',
          fontSize: '24px',
          borderWidth: 'medium',
          script: playJankenScript('scissors'),
        },
        {
          id: 'obj-janken-paper',
          type: 'button',
          x: 107, y: 380, width: 200, height: 60,
          text: 'ぱー ✋',
          textAlign: 'center',
          fontSize: '24px',
          borderWidth: 'medium',
          script: playJankenScript('paper'),
        },
        {
          id: 'obj-janken-result',
          type: 'text',
          x: 57, y: 500, width: 300, height: 40,
          text: '',
          textAlign: 'center',
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#4a90e2',
          borderWidth: 'none',
          script: '',
        },
      ],
    },
    // 2. Win Card
    {
      id: winCardId,
      name: '勝ち!',
      objects: [
        {
          id: 'obj-win-title',
          type: 'text',
          x: 57, y: 150, width: 300, height: 80,
          text: 'あなたの勝ち!',
          textAlign: 'center',
          fontSize: '48px',
          fontWeight: 'bold',
          color: '#4a90e2',
          borderWidth: 'none',
          script: '',
        },
        {
          id: 'obj-win-reward',
          type: 'text',
          x: 57, y: 250, width: 300, height: 100,
          text: 'おめでとう!\nこれがご褒美カードよ！\n( ´ ▽ ` )ﾉ',
          textAlign: 'center',
          fontSize: '24px',
          borderWidth: 'thin',
          script: '',
        },
        {
          id: 'obj-win-restart',
          type: 'button',
          x: 107, y: 450, width: 200, height: 60,
          text: 'もう一度遊ぶ',
          textAlign: 'center',
          fontSize: '20px',
          borderWidth: 'thin',
          action: 'jumpToCard',
          jumpToCardId: gameCardId,
          script: '',
        },
      ],
    },
    // 3. Lose Card
    {
      id: loseCardId,
      name: '負け...', 
      objects: [
        {
          id: 'obj-lose-title',
          type: 'text',
          x: 57, y: 200, width: 300, height: 80,
          text: 'あなたの負け…',
          textAlign: 'center',
          fontSize: '48px',
          fontWeight: 'bold',
          color: '#e03131',
          borderWidth: 'none',
          script: '',
        },
        {
          id: 'obj-lose-restart',
          type: 'button',
          x: 107, y: 400, width: 200, height: 60,
          text: 'もう一度挑戦する',
          textAlign: 'center',
          fontSize: '20px',
          borderWidth: 'thin',
          action: 'jumpToCard',
          jumpToCardId: gameCardId,
          script: '',
        },
      ],
    },
  ],
  currentCardId: gameCardId,
};

let selectedObject: StackObject | null = null;

// --- ヘルパー ---
const getCurrentCard = (): Card | undefined => stack.cards.find(c => c.id === stack.currentCardId);

// --- レンダリング ---
const renderAll = () => {
  document.body.classList.toggle('run-mode-active', isRunMode);
  renderCardList();
  renderCanvas();
  updatePropertiesPanel(selectedObject);
};

const renderCardList = () => {
  cardListPanel.innerHTML = '';

  // Render card list items and add button only in edit mode
  if (!isRunMode) {
    const container = document.createElement('div');
    container.id = 'card-list-container';
    stack.cards.forEach((card, index) => {
      const item = document.createElement('div');
      item.className = 'card-list-item';
      item.textContent = `${index + 1}. ${card.name}`;
      if (card.id === stack.currentCardId) item.classList.add('is-active');
      item.addEventListener('click', () => switchCard(card.id));
      container.appendChild(item);
    });
    cardListPanel.appendChild(container);

    const addBtn = document.createElement('button');
    addBtn.id = 'add-card-btn';
    addBtn.textContent = t('addNewCard');
    addBtn.addEventListener('click', addNewCard);
    cardListPanel.appendChild(addBtn);
  }

  // Footer Controls (always visible)
  const footer = document.createElement('div');
  footer.id = 'footer-controls';

  const settingsBtn = document.createElement('button');
  settingsBtn.textContent = t('settings');
  settingsBtn.onclick = () => { (document.querySelector('.modal-overlay') as HTMLElement)!.style.display = 'flex'; };

  const runModeBtn = document.createElement('button');
  runModeBtn.textContent = isRunMode ? t('editMode') : t('runMode');
  runModeBtn.onclick = () => { isRunMode = !isRunMode; renderAll(); };

  const exportHtmlBtn = document.createElement('button');
  exportHtmlBtn.textContent = t('exportHtml');
  exportHtmlBtn.onclick = exportToHtml;

  const enBtn = document.createElement('button');
  enBtn.textContent = 'English';
  enBtn.onclick = () => { i18next.changeLanguage('en').then(renderAll); };
  const jaBtn = document.createElement('button');
  jaBtn.textContent = '日本語';
  jaBtn.onclick = () => { i18next.changeLanguage('ja').then(renderAll); };

  footer.appendChild(settingsBtn);
  footer.appendChild(runModeBtn);
  footer.appendChild(exportHtmlBtn);
  footer.appendChild(enBtn);
  footer.appendChild(jaBtn);
  cardListPanel.appendChild(footer);
};

const renderCanvas = () => {
  canvas.innerHTML = '';
  const currentCard = getCurrentCard();
  if (!currentCard) return;
  currentCard.objects.forEach(obj => {
    const el = createDOMElement(obj);
    canvas.appendChild(el);
    makeInteractive(el, obj);
  });
};

const createDOMElement = (obj: StackObject): HTMLElement => {
  let element: HTMLElement;
  if (obj.type === 'button') {
    element = document.createElement('button') as HTMLElement;
  } else if (obj.type === 'image') { // Add image handling
    element = document.createElement('img') as HTMLImageElement;
    (element as HTMLImageElement).src = obj.src || '';
    element.style.objectFit = obj.objectFit || 'contain'; // Apply objectFit style
  } else {
    element = document.createElement('div') as HTMLElement;
    // Apply new text formatting styles
    if (obj.type === 'text') {
      if (obj.fontSize) element.style.fontSize = obj.fontSize;
      if (obj.fontWeight) element.style.fontWeight = obj.fontWeight;
      if (obj.fontStyle) element.style.fontStyle = obj.fontStyle;
      if (obj.textDecoration) element.style.textDecoration = obj.textDecoration;
      if (obj.color) element.style.color = obj.color;
      if (obj.fontFamily) element.style.fontFamily = obj.fontFamily; // Add this line
    }
  }
  element.textContent = obj.text;
  element.classList.add('stack-object');
  element.style.left = obj.x + 'px';
  element.style.top = obj.y + 'px';
  element.style.width = obj.width + 'px';
  element.style.height = obj.height + 'px';
  element.style.textAlign = obj.textAlign;
  element.style.borderStyle = 'solid';
  element.style.borderWidth = borderWidthMap[obj.borderWidth];
  element.setAttribute('data-id', obj.id);
  if (obj.id === selectedObject?.id && !isRunMode) element.classList.add('is-selected');

  // Handle click action in run mode
  element.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isRunMode) {
      if (obj.type === 'button') {
        if (obj.action === 'jumpToCard' && obj.jumpToCardId) {
          switchCard(obj.jumpToCardId);
        } else if (obj.script) {
          try {
            eval(obj.script);
          } catch (error: unknown) {
            console.error('Script execution error:', error as Error);
            alert(`Script error: ${(error as Error).message}`);
          }
        }
      }
    } else { // Edit mode
      selectObject(obj);
    }
  });
  return element;
};

// --- カード管理 ---
const switchCard = (cardId: string) => {
  selectedObject = null;
  stack.currentCardId = cardId;
  renderAll();
};

const addNewCard = () => {
  const newCardId = `card-${Date.now()}`;
  const newCard: Card = { id: newCardId, name: t('newCardName', { number: stack.cards.length + 1 }), objects: [] };
  stack.cards.push(newCard);
  switchCard(newCardId);
};

const exportToHtml = () => {
  const currentStack = JSON.parse(JSON.stringify(stack)); // Deep copy to avoid modifying original stack
  const stackDataString = JSON.stringify(currentStack, null, 2); // Store stringified data in a variable

  const htmlContent = `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exported Hi-Packa Stack</title>
    <style>
        body { margin: 0; overflow: hidden; font-family: sans-serif; }
        #exported-canvas {
            position: relative;
            width: 414px; /* Fixed to portrait */
            height: 736px; /* Fixed to portrait */
            border: 1px solid #ccc;
            margin: 20px auto;
            background-color: #f0f0f0;
            overflow: hidden;
            border-radius: 20px;
        }
        .stack-object {
            position: absolute;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 5px;
            word-break: break-all;
            white-space: pre-wrap;
        }
        button.stack-object {
            padding: 0; /* Reset padding for buttons */
        }
        /* Border styles */
        .border-none { border-width: 0px !important; }
        .border-thin { border-width: 1px !important; }
        .border-medium { border-width: 2px !important; }
        .border-thick { border-width: 4px !important; }
    </style>
</head>
<body>
    <div id="exported-canvas"></div>

    <script>
        const stackData = ${stackDataString};
        let currentCardId = stackData.currentCardId;
        const exportedCanvas = document.getElementById('exported-canvas');

        const borderWidthMap = {
            none: '0px',
            thin: '1px',
            medium: '2px',
            thick: '4px',
        };
        
        // We need a way to switch cards and re-render
        const switchCard = (cardId) => {
            currentCardId = cardId;
            renderCard(currentCardId);
        };

        const renderCard = (cardId) => {
            exportedCanvas.innerHTML = '';
            const currentCard = stackData.cards.find(c => c.id === cardId);
            if (!currentCard) return;

            currentCard.objects.forEach(obj => {
                let element;
                if (obj.type === 'button') {
                    element = document.createElement('button');
                } else {
                    // For text and image, we'll use a div
                    element = document.createElement('div');
                }
                
                // Common styles
                element.textContent = obj.text;
                element.classList.add('stack-object');
                element.style.left = obj.x + 'px';
                element.style.top = obj.y + 'px';
                element.style.width = obj.width + 'px';
                element.style.height = obj.height + 'px';
                element.style.textAlign = obj.textAlign;
                element.style.borderStyle = 'solid';
                element.style.borderWidth = borderWidthMap[obj.borderWidth];
                element.style.borderColor = '#333';

                // Type-specific styles
                if (obj.type === 'text') {
                    if (obj.fontSize) element.style.fontSize = obj.fontSize;
                    if (obj.fontWeight) element.style.fontWeight = obj.fontWeight;
                    if (obj.fontStyle) element.style.fontStyle = obj.fontStyle;
                    if (obj.textDecoration) element.style.textDecoration = obj.textDecoration;
                    if (obj.color) element.style.color = obj.color;
                    if (obj.fontFamily) element.style.fontFamily = obj.fontFamily;
                }

                if (obj.type === 'button') {
                    element.addEventListener('click', () => {
                        if (obj.action === 'jumpToCard' && obj.jumpToCardId) {
                            switchCard(obj.jumpToCardId);
                        } else if (obj.script) {
                            try {
                                // WARNING: eval is dangerous. This is the core of Hi-Packa's functionality.
                                // The script needs access to a global renderAll and switchCard function.
                                // We define a limited scope for safety.
                                const renderAll = () => renderCard(currentCardId);
                                eval(obj.script);
                            } catch (error) {
                                console.error('Script execution error:', error);
                                alert('Script error: ' + error.message);
                            }
                        }
                    });
                }
                exportedCanvas.appendChild(element);
            });
        };

        // Initial render
        renderCard(currentCardId);
    </script>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'hi-packa-exported.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const deleteCurrentCard = () => {
  if (stack.cards.length <= 1) {
    alert(t('lastCardWarning'));
    return;
  }
  const currentCard = getCurrentCard();
  if (!currentCard) return;
  if (window.confirm(t('deleteCardConfirmation', { cardName: currentCard.name })))
 {
    const currentIndex = stack.cards.findIndex(c => c.id === currentCard.id);
    stack.cards.splice(currentIndex, 1);
    const nextIndex = Math.max(0, currentIndex - 1);
    switchCard(stack.cards[nextIndex].id);
  }
};

// --- オブジェクト削除 ---
const deleteObject = (objToDelete: StackObject) => {
  const currentCard = getCurrentCard();
  if (!currentCard) return;

  if (window.confirm(t('deleteObjectConfirmation', { objectType: t(objToDelete.type) })))
 {
    currentCard.objects = currentCard.objects.filter(obj => obj.id !== objToDelete.id);
    selectedObject = null; // Deselect the object after deletion
    renderAll(); // Re-render everything to reflect changes
  }
};

// --- プロパティパネル ---
const updatePropertiesPanel = (obj: StackObject | null) => {
  propertiesPanel.innerHTML = '';
  if (isRunMode) {
    propertiesPanel.style.display = 'none';
    return;
  } else {
    propertiesPanel.style.display = 'block';
  }

  const createPropInput = (label: string, value: string | number, onUpdate: (newValue: string) => void, type = 'text') => {
    const group = document.createElement('div');
    group.className = 'prop-group';
    const labelEl = document.createElement('label');
    labelEl.textContent = label;
    const inputEl = document.createElement('input');
    inputEl.type = type;
    inputEl.value = String(value);
    inputEl.addEventListener('input', () => onUpdate(inputEl.value));
    group.appendChild(labelEl);
    group.appendChild(inputEl);
    propertiesPanel.appendChild(group);
  };

  const createPropSelect = (label: string, value: string, options: {value: string, text: string}[], onUpdate: (newValue: string) => void) => {
    const group = document.createElement('div');
    group.className = 'prop-group';
    const labelEl = document.createElement('label');
    labelEl.textContent = label;
    const selectEl = document.createElement('select');
    options.forEach(opt => {
      const optionEl = document.createElement('option');
      optionEl.value = opt.value;
      optionEl.textContent = opt.text;
      selectEl.appendChild(optionEl);
    });
    selectEl.value = value;
    selectEl.addEventListener('change', () => onUpdate(selectEl.value));
    group.appendChild(labelEl);
    group.appendChild(selectEl);
    propertiesPanel.appendChild(group);
  };

  const createPropTextarea = (label: string, value: string, onUpdate: (newValue: string) => void) => {
    const group = document.createElement('div');
    group.className = 'prop-group';
    const labelEl = document.createElement('label');
    labelEl.textContent = label;
    const textareaEl = document.createElement('textarea');
    textareaEl.value = value;
    textareaEl.addEventListener('input', () => onUpdate(textareaEl.value));
    group.appendChild(labelEl);
    group.appendChild(textareaEl);
    propertiesPanel.appendChild(group);
  };

  if (!obj) {
    const currentCard = getCurrentCard();
    if (!currentCard) return;
    const title = document.createElement('h3');
    title.textContent = t('cardProperties');
    propertiesPanel.appendChild(title);
    createPropInput(t('cardName'), currentCard.name, (newValue) => {
      currentCard.name = newValue;
      renderCardList();
    });
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = t('deleteCard');
    deleteBtn.className = 'delete-btn';
    deleteBtn.addEventListener('click', deleteCurrentCard);
    propertiesPanel.appendChild(deleteBtn);
    return;
  }

  const title = document.createElement('h3');
  title.textContent = t('objectProperties', { type: obj.type });
  propertiesPanel.appendChild(title);

  if (obj.type === 'text') {
    createPropTextarea(t('text'), obj.text, (newValue) => { obj.text = newValue; renderCanvas(); });
  } else if (obj.type === 'image') { // For image objects, use 'imageName'
    createPropInput(t('imageName'), obj.text, (newValue) => { obj.text = newValue; renderCanvas(); });
  } else { // For button objects, keep it as input
    createPropInput(t('text'), obj.text, (newValue) => { obj.text = newValue; renderCanvas(); });
  }

  if (obj.type === 'text' || obj.type === 'button') {
    createPropSelect(t('textAlign'), obj.textAlign, 
      [{value: 'left', text: t('alignLeft')}, {value: 'center', text: t('alignCenter')}, {value: 'right', text: t('alignRight')}],
      (newValue) => { obj.textAlign = newValue as TextAlign; renderCanvas(); });
  }

  createPropSelect(t('borderWidth'), obj.borderWidth, 
    [{value: 'none', text: t('borderNone')}, {value: 'thin', text: t('borderThin')}, {value: 'medium', text: t('borderMedium')}, {value: 'thick', text: t('borderThick')}],
    (newValue) => { obj.borderWidth = newValue as BorderWidth; renderCanvas(); });

  // Add new text formatting controls for text objects
  if (obj.type === 'text') {
    createPropInput(t('fontSize'), obj.fontSize || '16px', (newValue) => { obj.fontSize = newValue; renderCanvas(); }, 'text');
    createPropSelect(t('fontWeight'), obj.fontWeight || 'normal',
      [{value: 'normal', text: t('fontWeightNormal')}, {value: 'bold', text: t('fontWeightBold')}],
      (newValue) => { obj.fontWeight = newValue as 'normal' | 'bold'; renderCanvas(); });
    createPropSelect(t('fontStyle'), obj.fontStyle || 'normal',
      [{value: 'normal', text: t('fontStyleNormal')}, {value: 'italic', text: t('fontStyleItalic')}],
      (newValue) => { obj.fontStyle = newValue as 'normal' | 'italic'; renderCanvas(); });
    createPropSelect(t('textDecoration'), obj.textDecoration || 'none',
      [{value: 'none', text: t('textDecorationNone')}, {value: 'underline', text: t('textDecorationUnderline')}],
      (newValue) => { obj.textDecoration = newValue as 'none' | 'underline'; renderCanvas(); });
    createPropInput(t('color'), obj.color || '#333333', (newValue) => { obj.color = newValue; renderCanvas(); }, 'color'); // Use type 'color' for color picker

    // Add font family select
    const fontOptions = [
      { value: 'sans-serif', text: 'Sans-serif (Default)' },
      { value: 'serif', text: 'Serif' },
      { value: 'monospace', text: 'Monospace' },
      { value: 'cursive', text: 'Cursive' },
      { value: 'fantasy', text: 'Fantasy' },
      { value: 'Arial, sans-serif', text: 'Arial' },
      { value: 'Verdana, sans-serif', text: 'Verdana' },
      { value: 'Helvetica, sans-serif', text: 'Helvetica' },
      { value: 'Tahoma, sans-serif', text: 'Tahoma' },
      { value: 'Trebuchet MS, sans-serif', text: 'Trebuchet MS' },
      { value: 'Times New Roman, serif', text: 'Times New Roman' },
      { value: 'Georgia, serif', text: 'Georgia' },
      { value: 'Palatino Linotype, Palatino, serif', text: 'Palatino Linotype' },
      { value: 'Courier New, monospace', text: 'Courier New' },
      { value: 'Lucida Console, monospace', text: 'Lucida Console' },
    ];
    createPropSelect(t('fontFamily'), obj.fontFamily || 'sans-serif', fontOptions, (newValue) => { obj.fontFamily = newValue; renderCanvas(); });
  }

  if (obj.type === 'image') { // Add image properties
    createPropInput(t('imageSource'), obj.src || '', (newValue) => { obj.src = newValue; renderCanvas(); });
    // Add objectFit select
    createPropSelect(t('objectFit'), obj.objectFit || 'contain',
      [{value: 'contain', text: t('objectFitContain')}, {value: 'fill', text: t('objectFitFill')}],
      (newValue) => { obj.objectFit = newValue as 'contain' | 'fill'; renderCanvas(); });
  }

  if (obj.type === 'button') {
    const actionOptions = [{ value: 'none', text: t('actionNone') }, { value: 'jumpToCard', text: t('actionGoToCard') }];
    createPropSelect(t('action'), obj.action || 'none', actionOptions, (newValue) => {
      obj.action = newValue as ButtonAction;
      if (newValue !== 'jumpToCard') obj.jumpToCardId = null;
      updatePropertiesPanel(obj);
    });
    if (obj.action === 'jumpToCard') {
      const cardOptions = stack.cards.map((card, index) => ({ value: card.id, text: `${index + 1}. ${card.name}` }));
      createPropSelect(t('destination'), obj.jumpToCardId || '', cardOptions, (newValue) => { obj.jumpToCardId = newValue; });
    }
  }

  createPropInput(t('x'), Math.round(obj.x), (newValue) => { obj.x = Number(newValue); renderCanvas(); }, 'number');
  createPropInput(t('y'), Math.round(obj.y), (newValue) => { obj.y = Number(newValue); renderCanvas(); }, 'number');
  createPropInput(t('width'), Math.round(obj.width), (newValue) => { obj.width = Number(newValue); renderCanvas(); }, 'number');
  createPropInput(t('height'), Math.round(obj.height), (newValue) => { obj.height = Number(newValue); renderCanvas(); }, 'number');

  const scriptGroup = document.createElement('div');
  scriptGroup.className = 'prop-group';
  const scriptLabel = document.createElement('label');
  scriptLabel.textContent = t('scriptOnClick');
  const scriptTextarea = document.createElement('textarea');
  scriptTextarea.value = obj.script;
  scriptTextarea.className = 'script-area';
  scriptTextarea.placeholder = t('magicPlaceholder');
  scriptTextarea.disabled = !isMagicEnabled;
  scriptTextarea.addEventListener('input', () => { obj.script = scriptTextarea.value; });
  scriptGroup.appendChild(scriptLabel);
  scriptGroup.appendChild(scriptTextarea);

  // AI Helper Link
  const aiHelperLink = document.createElement('a');
  aiHelperLink.href = t('aiHelperLink');
  aiHelperLink.textContent = t('aiHelperText');
  aiHelperLink.target = '_blank'; // Open in new tab
  aiHelperLink.style.display = 'block';
  aiHelperLink.style.marginTop = '5px';
  aiHelperLink.style.fontSize = '0.8em';
  aiHelperLink.style.color = '#88aaff';
  aiHelperLink.style.textDecoration = 'underline';
  scriptGroup.appendChild(aiHelperLink);

  propertiesPanel.appendChild(scriptGroup);

  // --- オブジェクト削除ボタン ---
  const deleteObjectBtn = document.createElement('button');
  deleteObjectBtn.textContent = t('deleteObject'); // Will need to add this to i18n
  deleteObjectBtn.className = 'delete-btn'; // Use the same class as deleteCardBtn for styling
  deleteObjectBtn.addEventListener('click', () => deleteObject(obj!));
  propertiesPanel.appendChild(deleteObjectBtn);
};

// --- オブジェクト選択 ---
const deselectAllObjects = () => {
  selectedObject = null;
  renderCanvas();
  updatePropertiesPanel(null);
};

const selectObject = (targetObject: StackObject) => {
  if (isRunMode) return; // Disable selection in run mode
  selectedObject = targetObject;
  renderCanvas();
  updatePropertiesPanel(targetObject);
};

canvas.addEventListener('click', deselectAllObjects);

// --- オブジェクト操作 ---
const createObject = (x: number, y: number, type: ObjectType) => {
  const currentCard = getCurrentCard();
  if (!currentCard) return;
  const newObject: StackObject = {
    id: `obj-${Date.now()}`,
    type,
    x, y, width: 100, height: 50,
    text: type === 'button' ? t('defaultButtonText') : t('defaultTextBoxText'),
    textAlign: 'left',
    borderWidth: 'thin',
    script: '',
    action: 'none',
    jumpToCardId: null,
    // Add new properties for text objects
    ...(type === 'text' && {
      fontSize: '16px',
      fontWeight: 'normal',
      fontStyle: 'normal',
      textDecoration: 'none',
      color: '#333333', // Default text color
      fontFamily: 'sans-serif', // Default font family
    }),
    // Add new properties for image objects
    ...(type === 'image' && {
      src: 'https://via.placeholder.com/150', // Default placeholder image
      width: 150,
      height: 150,
      objectFit: 'contain', // Default object-fit for images
    }),
  };
  currentCard.objects.push(newObject);
  selectObject(newObject);
};

const makeInteractive = (element: HTMLElement, stackObject: StackObject) => {
  interact(element)
    .draggable({
      enabled: !isRunMode, // Disable dragging in run mode
      listeners: {
        move(event) {
          stackObject.x += event.dx;
          stackObject.y += event.dy;
          element.style.left = stackObject.x + 'px';
          element.style.top = stackObject.y + 'px';
        },
        end() { updatePropertiesPanel(stackObject); }
      },
    })
    .resizable({
      edges: { left: true, right: true, bottom: true, top: true },
      enabled: !isRunMode, // Disable resizing in run mode
      listeners: {
        move(event) {
          stackObject.width = event.rect.width;
          stackObject.height = event.rect.height;
          stackObject.x += event.deltaRect.left;
          stackObject.y += event.deltaRect.top;
          Object.assign(element.style, {
            width: stackObject.width + 'px', height: stackObject.height + 'px',
            left: stackObject.x + 'px', top: stackObject.y + 'px',
          });
        },
        end() { updatePropertiesPanel(stackObject); }
      },
    });
};

// --- コンテキストメニュー ---
let contextMenu: HTMLDivElement | null = null;
const removeContextMenu = () => {
  if (contextMenu) contextMenu.remove();
  contextMenu = null;
};
window.addEventListener('click', removeContextMenu);
canvas.addEventListener('contextmenu', (e) => {
  if (isRunMode) { e.preventDefault(); return; } // Disable context menu in run mode
  e.preventDefault();
  removeContextMenu();
  const canvasRect = canvas.getBoundingClientRect();
  const x = e.clientX - canvasRect.left;
  const y = e.clientY - canvasRect.top;
  contextMenu = document.createElement('div');
  contextMenu.className = 'context-menu';
  contextMenu.style.left = `${e.clientX}px`;
  contextMenu.style.top = `${e.clientY}px`;
  const menuItems = [
    { label: t('contextMenuAddButton'), type: 'button' as ObjectType },
    { label: t('contextMenuAddText'), type: 'text' as ObjectType },
    { label: t('contextMenuAddImage'), type: 'image' as ObjectType }, // Add this line
  ];
  menuItems.forEach(itemInfo => {
    const item = document.createElement('div');
    item.className = 'context-menu-item';
    item.textContent = itemInfo.label;
    item.addEventListener('click', () => {
      createObject(x, y, itemInfo.type);
      removeContextMenu();
    });
    contextMenu!.appendChild(item);
  });
  document.body.appendChild(contextMenu);
});

// --- Settings Modal ---
const modalOverlay = document.createElement('div');
modalOverlay.className = 'modal-overlay';
const modalContent = document.createElement('div');
modalContent.className = 'modal-content';

const closeModal = () => { modalOverlay.style.display = 'none'; };

const closeBtn = document.createElement('button');
closeBtn.className = 'modal-close-btn';
closeBtn.innerHTML = '&times;';
closeBtn.onclick = closeModal;

const modalTitle = document.createElement('h3');
modalTitle.textContent = t('settings');

const magicLabel = document.createElement('label');
magicLabel.textContent = t('enterMagicWord');
magicLabel.style.display = 'block';
magicLabel.style.marginBottom = '10px';

const magicInput = document.createElement('input');
magicInput.type = 'password';
magicInput.style.paddingRight = '30px'; // Add padding for the icon
magicInput.onkeyup = (e) => {
  if (e.key === 'Enter' && magicInput.value === 'Magic') {
    isMagicEnabled = true;
    magicInput.value = '';
    closeModal();
    updatePropertiesPanel(selectedObject);
    alert(t('magicEnabled'));
  }
};

const magicInputContainer = document.createElement('div');
magicInputContainer.style.position = 'relative';
magicInputContainer.style.display = 'flex';
magicInputContainer.style.alignItems = 'center';

const toggleVisibilityBtn = document.createElement('span');
toggleVisibilityBtn.className = 'password-toggle-icon';
toggleVisibilityBtn.textContent = '👁️';
toggleVisibilityBtn.onclick = () => {
  if (magicInput.type === 'password') {
    magicInput.type = 'text';
    toggleVisibilityBtn.textContent = '🔒';
  } else {
    magicInput.type = 'password';
    toggleVisibilityBtn.textContent = '👁️';
  }
};

magicInputContainer.appendChild(magicInput);
magicInputContainer.appendChild(toggleVisibilityBtn);

modalContent.appendChild(closeBtn);
modalContent.appendChild(modalTitle);
modalContent.appendChild(magicLabel);
modalContent.appendChild(magicInputContainer);
modalOverlay.appendChild(modalContent);
app.appendChild(modalOverlay);

// --- 初期描画 ---
i18next.loadLanguages(['en', 'ja'], () => {
  renderAll();
});
