import type { Stack, StackObject, ObjectType, TextAlign, BorderWidth, ButtonAction } from '../types';

// プロジェクトファイルの形式
interface ProjectFile {
  version: string;
  timestamp: string;
  stack: Stack;
}

// Helper function to apply defaults to a StackObject
const applyObjectDefaults = (obj: any): StackObject => {
  const defaultTextProps = {
    fontSize: obj.fontSize || '16px',
    fontWeight: obj.fontWeight || 'normal',
    fontStyle: obj.fontStyle || 'normal',
    textDecoration: obj.textDecoration || 'none',
    fontFamily: obj.fontFamily || 'sans-serif',
  };

  const defaultImageProps = {
    src: obj.src || 'https://via.placeholder.com/150',
    width: obj.width || 150,
    height: obj.height || 150,
    objectFit: obj.objectFit || 'contain',
  };

  const defaultButtonProps = {
    action: obj.action || 'none',
    jumpToCardId: obj.jumpToCardId || null,
  };

  let defaults = {};
  if (obj.type === 'text') {
    defaults = { ...defaultTextProps };
  } else if (obj.type === 'image') {
    defaults = { ...defaultImageProps };
  } else if (obj.type === 'button') {
    defaults = { ...defaultButtonProps };
  }

  return {
    id: obj.id || `obj-${Date.now()}`,
    type: obj.type,
    x: obj.x || 0,
    y: obj.y || 0,
    width: obj.width || 100,
    height: obj.height || 50,
    text: obj.text || '', // Required
    textAlign: obj.textAlign || 'left', // Required
    borderWidth: obj.borderWidth || 'none', // Required
    script: obj.script || '', // Required
    color: obj.color || '#000000', // Default text/button color
    backgroundColor: obj.backgroundColor || 'transparent', // Default background
    borderColor: obj.borderColor || '#000000', // Default border color
    ...defaults, // Type-specific defaults
    ...obj, // Override with actual object properties
  } as StackObject; // Cast to StackObject
};

// プロジェクトをJSONファイルとして保存
export const saveProject = (stack: Stack, filename?: string): void => {
  const projectData: ProjectFile = {
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    stack: stack
  };

  const jsonString = JSON.stringify(projectData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `hipacka-project-${Date.now()}.json`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

// プロジェクトファイルを読み込み
export const loadProject = (file: File): Promise<Stack> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const projectData: ProjectFile = JSON.parse(content);
        
        // バージョン検証
        if (!projectData.version) {
          throw new Error('Invalid project file: missing version');
        }
        
        // スタックデータの検証
        if (!projectData.stack || !projectData.stack.cards) {
          throw new Error('Invalid project file: missing stack data');
        }
        
        // Apply defaults to all objects in the stack
        const processedStack: Stack = {
          ...projectData.stack,
          cards: projectData.stack.cards.map(card => ({ // Ensure card properties are copied
            ...card,
            objects: card.objects.map(applyObjectDefaults)
          }))
        };

        resolve(processedStack);
      } catch (error) {
        reject(new Error(`Failed to load project: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
};

// ファイル形式の検証
export const validateProjectFile = (file: File): boolean => {
  const validExtensions = ['.json', '.hipacka'];
  const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  
  return validExtensions.includes(fileExtension);
};