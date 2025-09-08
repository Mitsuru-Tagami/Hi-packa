import React, { useState } from 'react';
import Layout from './components/Layout';
import { initialStack } from './initialData';
import type { Stack, StackObject } from './types';

function App() {
  const [stack, setStack] = useState<Stack>(initialStack);
  const [selectedObject, setSelectedObject] = useState<StackObject | null>(null);

  const handleSwitchCard = (cardId: string) => {
    // When switching cards, also deselect any selected object
    setSelectedObject(null);
    setStack(prevStack => ({
      ...prevStack,
      currentCardId: cardId,
    }));
  };

  return (
    <Layout
      stack={stack}
      selectedObject={selectedObject}
      onSwitchCard={handleSwitchCard}
    />
  );
}

export default App;
