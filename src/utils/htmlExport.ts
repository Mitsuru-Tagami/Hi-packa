import type { Stack, StackObject } from '../types';

// Note: imageToBase64 function removed as it's not currently used
// Can be re-added when file upload functionality is implemented

// Note: URL to base64 conversion will be implemented when needed

// Note: processObjectImages function removed for now
// Image base64 conversion will be implemented when needed

/**
 * Generate CSS styles for an object
 */
const generateObjectStyles = (obj: StackObject): string => {
  const styles: string[] = [
    `position: absolute`,
    `left: ${obj.x}px`,
    `top: ${obj.y}px`,
    `width: ${obj.width}px`,
    `height: ${obj.height}px`,
  ];

  // Background and border
  if (obj.backgroundColor && obj.backgroundColor !== 'transparent') {
    styles.push(`background-color: ${obj.backgroundColor}`);
  }
  
  if (obj.borderColor && obj.borderWidth && obj.borderWidth !== 'none') {
    const borderWidthMap = { thin: '1px', medium: '2px', thick: '4px' };
    styles.push(`border: ${borderWidthMap[obj.borderWidth]} solid ${obj.borderColor}`);
  }

  // Text styles
  if (obj.fontFamily) styles.push(`font-family: ${obj.fontFamily}`);
  if (obj.fontSize) styles.push(`font-size: ${obj.fontSize}`);
  if (obj.color) styles.push(`color: ${obj.color}`);
  if (obj.fontStyle) styles.push(`font-style: ${obj.fontStyle}`);
  if (obj.textDecoration) styles.push(`text-decoration: ${obj.textDecoration}`);
  if (obj.textAlign) styles.push(`text-align: ${obj.textAlign}`);

  // Display and layout
  styles.push(`display: flex`);
  styles.push(`align-items: center`);
  styles.push(`justify-content: ${obj.textAlign === 'center' ? 'center' : obj.textAlign === 'right' ? 'flex-end' : 'flex-start'}`);
  styles.push(`padding: 5px`);
  styles.push(`box-sizing: border-box`);
  styles.push(`cursor: ${obj.type === 'button' ? 'pointer' : 'default'}`);

  return styles.join('; ');
};

/**
 * Generate HTML for a single object
 */
const generateObjectHTML = (obj: StackObject): string => {
  const styles = generateObjectStyles(obj);
  const objId = `obj_${obj.id}`;
  
  let content = '';
  let tag = 'div';
  let attributes = `id="${objId}" style="${styles}"`;

  switch (obj.type) {
    case 'button':
      tag = 'button';
      content = obj.text || 'Button';
      if (obj.action === 'jumpToCard' && obj.jumpToCardId) {
        attributes += ` onclick="switchToCard('${obj.jumpToCardId}')"`;
      } else if (obj.action === 'openUrl' && obj.src) {
        attributes += ` onclick="window.open('${obj.src}', '_blank')"`;
      } else if (obj.script) {
        const escapedScript = obj.script.replace(/'/g, "\\'").replace(/\n/g, '\\n');
        attributes += ` onclick="executeScript('${escapedScript}')"`;
      }
      break;
      
    case 'text':
      content = obj.text || '';
      break;
      
    case 'image':
      if (obj.src) {
        tag = 'img';
        const objectFit = obj.objectFit || 'contain';
        attributes += ` src="${obj.src}" alt="${obj.alt || ''}" style="${styles}; object-fit: ${objectFit};"`;
        content = '';
      }
      break;
  }

  return `<${tag} ${attributes}>${content}</${tag}>`;
};

/**
 * Generate HTML for a card
 */
const generateCardHTML = (card: any, objects: StackObject[]): string => {
  const cardObjects = objects;
  const objectsHTML = cardObjects.map(obj => generateObjectHTML(obj)).join('\n    ');
  
  const cardStyles = [
    'position: relative',
    `width: ${card.width}px`,
    `height: ${card.height}px`,
    `background-color: ${card.backgroundColor || '#ffffff'}`,
    'margin: 0 auto',
    'border: 1px solid #ccc',
    'overflow: hidden'
  ].join('; ');

  return `
  <div id="card_${card.id}" class="card" style="${cardStyles}; display: none;">
    ${objectsHTML}
  </div>`;
};

/**
 * Generate the complete HTML document
 */
export const exportToHTML = async (stack: Stack): Promise<string> => {
  // Process all objects to convert images to base64
  const allObjects: StackObject[] = [];
  stack.cards.forEach(card => {
    if (card.objects) {
      allObjects.push(...card.objects);
    }
  });
  
  // Generate cards HTML
  const cardsHTML = stack.cards.map(card => {
    const cardObjects = card.objects || [];
    return generateCardHTML(card, cardObjects);
  }).join('\n');

  // Generate cards list for navigation
  const cardsList = stack.cards.map(card => 
    `    <button onclick="switchToCard('${card.id}')">${card.name}</button>`
  ).join('\n');

  const currentCardId = stack.currentCardId || (stack.cards.length > 0 ? stack.cards[0].id : '');

  const htmlTemplate = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hi-packa Export</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 20px;
      background-color: #f5f5f5;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .header {
      text-align: center;
      margin-bottom: 20px;
    }
    
    .navigation {
      text-align: center;
      margin-bottom: 20px;
    }
    
    .navigation button {
      margin: 0 5px;
      padding: 8px 16px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .navigation button:hover {
      background: #0056b3;
    }
    
    .navigation button.active {
      background: #28a745;
    }
    
    .card-container {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
    }
    
    .card {
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      border-radius: 8px;
    }
    
    .footer {
      text-align: center;
      color: #666;
      font-size: 12px;
      margin-top: 40px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Hi-packa Export</h1>
    </div>
    
    <div class="navigation">
${cardsList}
    </div>
    
    <div class="card-container">
${cardsHTML}
    </div>
    
    <div class="footer">
      Created with Hi-packa (CardWeaver)
    </div>
  </div>

  <script>
    let currentCardId = '${currentCardId}';
    
    function switchToCard(cardId) {
      // Hide all cards
      const cards = document.querySelectorAll('.card');
      cards.forEach(card => card.style.display = 'none');
      
      // Show target card
      const targetCard = document.getElementById('card_' + cardId);
      if (targetCard) {
        targetCard.style.display = 'block';
        currentCardId = cardId;
        
        // Update navigation buttons
        const buttons = document.querySelectorAll('.navigation button');
        buttons.forEach(btn => btn.classList.remove('active'));
        
        const activeButton = Array.from(buttons).find(btn => 
          btn.onclick.toString().includes(cardId)
        );
        if (activeButton) {
          activeButton.classList.add('active');
        }
      }
    }
    
    function executeScript(script) {
      try {
        // Create a safe execution context
        const func = new Function('switchToCard', script);
        func(switchToCard);
      } catch (error) {
        console.error('Script execution error:', error);
        alert('Script execution error: ' + error.message);
      }
    }
    
    // Initialize - show first card
    if (currentCardId) {
      switchToCard(currentCardId);
    }
  </script>
</body>
</html>`;

  return htmlTemplate;
};

/**
 * Download the HTML file
 */
export const downloadHTML = (htmlContent: string, filename: string = 'hi-packa-export.html') => {
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};
