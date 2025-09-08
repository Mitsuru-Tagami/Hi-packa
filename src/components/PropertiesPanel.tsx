import React from 'react';
import Box from '@mui/material/Box';
import type { StackObject } from '../types';

interface PropertiesPanelProps {
  selectedObject: StackObject | null;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ selectedObject }) => {
  // For now, just log the received data
  console.log('PropertiesPanel received selectedObject:', selectedObject);

  return (
    <Box sx={{ border: '1px solid grey', height: '100vh' }}>
      Properties Panel
      {selectedObject && (
        <div>
          <p>Selected: {selectedObject.id}</p>
        </div>
      )}
    </Box>
  );
};

export default PropertiesPanel;
