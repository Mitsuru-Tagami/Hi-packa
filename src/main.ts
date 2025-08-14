import './style.css';
import interact from 'interactjs';

// --- タイプ定義 ---
type ObjectType = 'button' | 'text';
type TextAlign = 'left' | 'center' | 'right';
type BorderWidth = 'none' | 'thin' | 'medium' | 'thick';

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

const firstCardId = `card-${Date.now()}`;
const stack: Stack = {
  cards: [{ id: firstCardId, name: 'Card 1', objects: [] }],
  currentCardId: firstCardId,
};

let selectedObject: StackObject | null = null;

// --- ヘルパー ---
const getCurrentCard = (): Card | undefined => stack.cards.find(c => c.id === stack.currentCardId);

// --- レンダリング ---
const renderAll = () => {
  renderCardList();
  renderCanvas();
  updatePropertiesPanel(null);
};

const renderCardList = () => {
  cardListPanel.innerHTML = '';
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
  addBtn.textContent = '+ New Card';
  addBtn.addEventListener('click', addNewCard);
  cardListPanel.appendChild(addBtn);
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
    element = document.createElement('button');
  } else {
    element = document.createElement('div');
    element.className = 'text-object';
  }
  element.textContent = obj.text;
  element.classList.add('stack-object');
  element.style.left = `${obj.x}px`;
  element.style.top = `${obj.y}px`;
  element.style.width = `${obj.width}px`;
  element.style.height = `${obj.height}px`;
  element.style.textAlign = obj.textAlign;
  element.style.borderStyle = 'solid';
  element.style.borderWidth = borderWidthMap[obj.borderWidth];
  element.setAttribute('data-id', obj.id);
  if (obj.id === selectedObject?.id) {
    element.classList.add('is-selected');
  }
  element.addEventListener('click', (e) => {
    e.stopPropagation();
    selectObject(obj);
  });
  return element;
};

// --- カード管理 ---
const switchCard = (cardId: string) => {
  stack.currentCardId = cardId;
  renderAll();
};

const addNewCard = () => {
  const newCardId = `card-${Date.now()}`;
  const newCard: Card = { id: newCardId, name: `Card ${stack.cards.length + 1}`, objects: [] };
  stack.cards.push(newCard);
  switchCard(newCardId);
};

// --- プロパティパネル ---
const updatePropertiesPanel = (obj: StackObject | null) => {
  propertiesPanel.innerHTML = '';
  if (!obj) {
    propertiesPanel.innerHTML = '<h3>Properties</h3><p>No object selected.</p>';
    return;
  }
  const title = document.createElement('h3');
  title.textContent = `Properties: ${obj.type}`;
  propertiesPanel.appendChild(title);

  const createPropInput = (label: string, value: string | number, onUpdate: (newValue: any) => void) => {
    const group = document.createElement('div');
    group.className = 'prop-group';
    const labelEl = document.createElement('label');
    labelEl.textContent = label;
    const inputEl = document.createElement('input');
    inputEl.value = String(value);
    inputEl.addEventListener('input', () => onUpdate(inputEl.value));
    group.appendChild(labelEl);
    group.appendChild(inputEl);
    propertiesPanel.appendChild(group);
  };

  const createPropSelect = (label: string, value: string, options: string[], onUpdate: (newValue: any) => void) => {
    const group = document.createElement('div');
    group.className = 'prop-group';
    const labelEl = document.createElement('label');
    labelEl.textContent = label;
    const selectEl = document.createElement('select');
    options.forEach(opt => {
      const optionEl = document.createElement('option');
      optionEl.value = opt;
      optionEl.textContent = opt.charAt(0).toUpperCase() + opt.slice(1);
      selectEl.appendChild(optionEl);
    });
    selectEl.value = value;
    selectEl.addEventListener('change', () => onUpdate(selectEl.value));
    group.appendChild(labelEl);
    group.appendChild(selectEl);
    propertiesPanel.appendChild(group);
  };

  const createPropTextarea = (label: string, value: string, onUpdate: (newValue: any) => void) => {
    const group = document.createElement('div');
    group.className = 'prop-group';
    const labelEl = document.createElement('label');
    labelEl.textContent = label;
    const textareaEl = document.createElement('textarea');
    textareaEl.value = value;
    textareaEl.className = 'script-area';
    textareaEl.placeholder = "To edit, type 'Magic'...";
    textareaEl.disabled = true;
    textareaEl.addEventListener('input', () => onUpdate(textareaEl.value));
    group.appendChild(labelEl);
    group.appendChild(textareaEl);
    propertiesPanel.appendChild(group);
  };

  createPropInput('Text', obj.text, (newValue) => {
    obj.text = newValue;
    renderCanvas();
  });

  if (obj.type === 'text' || obj.type === 'button') {
    createPropSelect('Text Align', obj.textAlign, ['left', 'center', 'right'], (newValue) => {
      obj.textAlign = newValue;
      renderCanvas();
    });
    createPropSelect('Border Width', obj.borderWidth, ['none', 'thin', 'medium', 'thick'], (newValue) => {
      obj.borderWidth = newValue;
      renderCanvas();
    });
  }

  createPropInput('X', Math.round(obj.x), (newValue) => {
    obj.x = Number(newValue);
    renderCanvas();
  });
  createPropInput('Y', Math.round(obj.y), (newValue) => {
    obj.y = Number(newValue);
    renderCanvas();
  });
  createPropInput('Width', Math.round(obj.width), (newValue) => {
    obj.width = Number(newValue);
    renderCanvas();
  });
  createPropInput('Height', Math.round(obj.height), (newValue) => {
    obj.height = Number(newValue);
    renderCanvas();
  });
  createPropTextarea('Script (onclick)', obj.script, (newValue) => { obj.script = newValue; });
};

// --- オブジェクト選択 ---
const deselectAllObjects = () => {
  selectedObject = null;
  renderCanvas();
  updatePropertiesPanel(null);
};

const selectObject = (targetObject: StackObject) => {
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
    text: type === 'button' ? 'Button' : 'Text Box',
    textAlign: 'left',
    borderWidth: 'thin',
    script: '',
  };
  currentCard.objects.push(newObject);
  selectObject(newObject);
};

const makeInteractive = (element: HTMLElement, stackObject: StackObject) => {
  interact(element)
    .draggable({
      listeners: {
        move(event) {
          stackObject.x += event.dx;
          stackObject.y += event.dy;
          element.style.left = `${stackObject.x}px`;
          element.style.top = `${stackObject.y}px`;
        },
        end() { updatePropertiesPanel(stackObject); }
      },
    })
    .resizable({
      edges: { left: true, right: true, bottom: true, top: true },
      listeners: {
        move(event) {
          stackObject.width = event.rect.width;
          stackObject.height = event.rect.height;
          stackObject.x += event.deltaRect.left;
          stackObject.y += event.deltaRect.top;
          Object.assign(element.style, {
            width: `${stackObject.width}px`, height: `${stackObject.height}px`,
            left: `${stackObject.x}px`, top: `${stackObject.y}px`,
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
  e.preventDefault();
  removeContextMenu();
  const canvasRect = canvas.getBoundingClientRect();
  const x = e.clientX - canvasRect.left;
  const y = e.clientY - canvasRect.top;
  contextMenu = document.createElement('div');
  contextMenu.className = 'context-menu';
  contextMenu.style.left = `${e.clientX}px`;
  contextMenu.style.top = `${e.clientY}px`;
  const menuItems: { label: string; type: ObjectType }[] = [
    { label: 'ボタンを追加', type: 'button' },
    { label: 'テキストを追加', type: 'text' },
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

// --- 初期描画 ---
renderAll();
