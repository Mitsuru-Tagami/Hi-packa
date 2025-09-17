import type { Stack } from '../types';

// プロジェクトファイルの形式
interface ProjectFile {
  version: string;
  timestamp: string;
  stack: Stack;
}

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
        
        resolve(projectData.stack);
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
