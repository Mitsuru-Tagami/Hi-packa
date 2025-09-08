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

  const handleSelectObject = (object: StackObject | null) => {
    setSelectedObject(object);
  };

  const handleUpdateObject = (updatedObject: StackObject) => {
    setStack(prevStack => {
      const newCards = prevStack.cards.map(card => {
        if (card.id === prevStack.currentCardId) {
          return {
            ...card,
            objects: card.objects.map(obj =>
              obj.id === updatedObject.id ? updatedObject : obj
            ),
          };
        }
        return card;
      });
      return {
        ...prevStack,
        cards: newCards,
      };
    });
    // If the updated object was the selected one, keep it selected with updated properties
    if (selectedObject?.id === updatedObject.id) {
      setSelectedObject(updatedObject);
    }
  };

  return (
    <Layout
      stack={stack}
      selectedObject={selectedObject}
      onSwitchCard={handleSwitchCard}
      onSelectObject={handleSelectObject}
      onUpdateObject={handleUpdateObject}
    />
  );
}

export default App;
