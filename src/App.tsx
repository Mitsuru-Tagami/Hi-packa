import React, { useState } from 'react';
import Layout from './components/Layout';
import { initialStack } from './initialData';
import type { Stack, StackObject, ObjectType } from './types';

function App() {
  const [stack, setStack] = useState<Stack>(initialStack);
  const [selectedObject, setSelectedObject] = useState<StackObject | null>(null);
  const [isRunMode, setIsRunMode] = useState<boolean>(false);
  const [isMagicEnabled, setIsMagicEnabled] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);

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

  const toggleRunMode = () => {
    setIsRunMode(prev => !prev);
    // When entering run mode, deselect any object
    if (!isRunMode) {
      setSelectedObject(null);
    }
  };

  const handleOpenUrl = (url: string) => {
    window.open(url, '_blank');
  };

  const executeScript = (script: string) => {
    try {
      const context = {
        stack: stack,
        switchCard: handleSwitchCard,
        openUrl: handleOpenUrl,
        updateObjectText: (objectId: string, newText: string) => {
          setStack(prevStack => {
            const currentCard = prevStack.cards.find(c => c.id === prevStack.currentCardId);
            if (!currentCard) return prevStack;

            const updatedObjects = currentCard.objects.map(obj => {
              if (obj.id === objectId && obj.type === 'text') {
                return { ...obj, text: newText };
              }
              return obj;
            });
            return {
              ...prevStack,
              cards: prevStack.cards.map(card =>
                card.id === prevStack.currentCardId ? { ...card, objects: updatedObjects } : card
              ),
            };
          });
        },
        renderAll: () => { /* No direct renderAll in React, state changes trigger it */ },
        setTimeout: (callback: Function, delay: number) => setTimeout(callback, delay),
        Math: { random: Math.random, floor: Math.floor },
      };

      const scriptFunction = new Function('context', `
        with (context) {
          ${script}
        }
      `);
      scriptFunction(context);
    } catch (error: unknown) {
      console.error('Script execution error:', error as Error);
      alert(`Script error: ${(error as Error).message}`);
    }
  };

  const openSettingsModal = () => {
    setIsSettingsModalOpen(true);
  };

  const closeSettingsModal = () => {
    setIsSettingsModalOpen(false);
  };

  const handleAddObject = (type: ObjectType, x: number, y: number) => {
    setStack(prevStack => {
      const currentCard = prevStack.cards.find(c => c.id === prevStack.currentCardId);
      if (!currentCard) return prevStack;

      const newObject: StackObject = {
        id: `obj-${Date.now()}`,
        type,
        x, y, width: 100, height: 50,
        text: type === 'button' ? 'New Button' : 'New Text Box',
        textAlign: 'center',
        borderWidth: 'thin',
        script: '',
        action: 'none',
        jumpToCardId: null,
        color: '#000000',
        // Add new properties for text objects
        ...(type === 'text' && {
          fontSize: '16px',
          fontWeight: 'normal',
          fontStyle: 'normal',
          textDecoration: 'none',
          color: '#333333',
          fontFamily: 'sans-serif',
        }),
        // Add new properties for image objects
        ...(type === 'image' && {
          src: 'https://via.placeholder.com/150',
          width: 150,
          height: 150,
          objectFit: 'contain',
        }),
      };

      const updatedObjects = [...currentCard.objects, newObject];
      const updatedCard = { ...currentCard, objects: updatedObjects };

      return {
        ...prevStack,
        cards: prevStack.cards.map(card =>
          card.id === prevStack.currentCardId ? updatedCard : card
        ),
      };
    });
  };

  return (
    <Layout
      stack={stack}
      selectedObject={selectedObject}
      isRunMode={isRunMode}
      isMagicEnabled={isMagicEnabled}
      isSettingsModalOpen={isSettingsModalOpen}
      onSwitchCard={handleSwitchCard}
      onSelectObject={handleSelectObject}
      onUpdateObject={handleUpdateObject}
      onToggleRunMode={toggleRunMode}
      onOpenUrl={handleOpenUrl}
      executeScript={executeScript}
      onOpenSettingsModal={openSettingsModal}
      onCloseSettingsModal={closeSettingsModal}
      onSetMagicEnabled={setIsMagicEnabled}
      onAddObject={handleAddObject}
    />
  );
}

export default App;
