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
  element: HTMLElement;
};

// --- アプリケーションの状態 ---
const app = document.querySelector<HTMLDivElement>('#app')!;
const mainContent = document.createElement('div');
mainContent.id = 'main-content';
const propertiesPanel = document.createElement('div');
propertiesPanel.id = 'properties-panel';
const canvas = document.createElement('div');
canvas.id = 'card-canvas';
mainContent.appendChild(canvas);
app.appendChild(mainContent);
app.appendChild(propertiesPanel);

const cardObjects: StackObject[] = [];
let selectedObject: StackObject | null = null;

// --- プロパティパネル更新 ---
const updatePropertiesPanel = (obj: StackObject | null) => {
  propertiesPanel.innerHTML = '';

  if (!obj) {
    propertiesPanel.innerHTML = '<h3>Properties</h3><p>No object selected.</p>';
    return;
  }

  const title = document.createElement('h3');
  title.textContent = `Properties: ${obj.type}`;
  propertiesPanel.appendChild(title);

  // --- Helper Functions for creating inputs ---
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

  // --- Create fields ---
  createPropInput('Text', obj.text, (newValue) => {
    obj.text = newValue;
    obj.element.textContent = newValue;
  });

  if (obj.type === 'text' || obj.type === 'button') {
    createPropSelect('Text Align', obj.textAlign, ['left', 'center', 'right'], (newValue) => {
      obj.textAlign = newValue;
      obj.element.style.textAlign = newValue;
    });
    createPropSelect('Border Width', obj.borderWidth, ['none', 'thin', 'medium', 'thick'], (newValue) => {
      obj.borderWidth = newValue;
      obj.element.style.borderWidth = borderWidthMap[newValue];
    });
  }

  createPropInput('X', Math.round(obj.x), (newValue) => {
    obj.x = Number(newValue);
    obj.element.style.left = `${obj.x}px`;
  });

  createPropInput('Y', Math.round(obj.y), (newValue) => {
    obj.y = Number(newValue);
    obj.element.style.top = `${obj.y}px`;
  });

  createPropInput('Width', Math.round(obj.width), (newValue) => {
    obj.width = Number(newValue);
    obj.element.style.width = `${obj.width}px`;
  });

  createPropInput('Height', Math.round(obj.height), (newValue) => {
    obj.height = Number(newValue);
    obj.element.style.height = `${obj.height}px`;
  });

  createPropTextarea('Script (onclick)', obj.script, (newValue) => {
    obj.script = newValue;
  });
};

// --- Object Selection ---
const deselectAllObjects = () => {
  selectedObject = null;
  cardObjects.forEach(obj => obj.element.classList.remove('is-selected'));
  updatePropertiesPanel(null);
};

const selectObject = (targetObject: StackObject) => {
  deselectAllObjects();
  selectedObject = targetObject;
  targetObject.element.classList.add('is-selected');
  updatePropertiesPanel(targetObject);
};

canvas.addEventListener('click', deselectAllObjects);

// --- Object Creation & Interaction ---
const createObject = (x: number, y: number, type: ObjectType) => {
  const id = `obj-${Date.now()}`;
  const defaultBorderWidth: BorderWidth = type === 'button' ? 'thin' : 'thin';

  let element: HTMLElement;
  let initialText = '';

  if (type === 'button') {
    const button = document.createElement('button');
    button.textContent = 'Button';
    initialText = 'Button';
    element = button;
  } else {
    const text = document.createElement('div');
    text.textContent = 'Text Box';
    text.className = 'text-object';
    initialText = 'Text Box';
    element = text;
  }

  element.classList.add('stack-object');
  element.style.left = `${x}px`;
  element.style.top = `${y}px`;
  element.style.width = '100px';
  element.style.height = '50px';
  element.style.textAlign = 'left';
  element.style.borderStyle = 'solid';
  element.style.borderWidth = borderWidthMap[defaultBorderWidth];
  element.setAttribute('data-id', id);

  const newObject: StackObject = {
    id, type, x, y, width: 100, height: 50, text: initialText,
    textAlign: 'left', borderWidth: defaultBorderWidth, script: '', element,
  };

  element.addEventListener('click', (e) => {
    e.stopPropagation();
    selectObject(newObject);
  });

  cardObjects.push(newObject);
  canvas.appendChild(element);
  makeInteractive(newObject);
  selectObject(newObject);
};

const makeInteractive = (stackObject: StackObject) => {
  interact(stackObject.element)
    .on('down', (event) => {
      selectObject(stackObject);
      event.stopPropagation();
    })
    .draggable({
      listeners: {
        move(event) {
          stackObject.x += event.dx;
          stackObject.y += event.dy;
          event.target.style.left = `${stackObject.x}px`;
          event.target.style.top = `${stackObject.y}px`;
          updatePropertiesPanel(stackObject);
        },
      },
      inertia: true,
    })
    .resizable({
      edges: { left: true, right: true, bottom: true, top: true },
      listeners: {
        move(event) {
          stackObject.width = event.rect.width;
          stackObject.height = event.rect.height;
          stackObject.x += event.deltaRect.left;
          stackObject.y += event.deltaRect.top;
          Object.assign(event.target.style, {
            width: `${stackObject.width}px`, height: `${stackObject.height}px`,
            left: `${stackObject.x}px`, top: `${stackObject.y}px`,
          });
          updatePropertiesPanel(stackObject);
        },
      },
      inertia: true,
    });
};

// --- Context Menu ---
let contextMenu: HTMLDivElement | null = null;
const removeContextMenu = () => {
  if (contextMenu) {
    contextMenu.remove();
    contextMenu = null;
  }
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

// Initial Panel State
updatePropertiesPanel(null);
