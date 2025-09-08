import React, { useState } from 'react';
import Layout from './components/Layout';
import { initialStack } from './initialData';
import { Stack, StackObject } from './types';

function App() {
  const [stack, setStack] = useState<Stack>(initialStack);
  const [selectedObject, setSelectedObject] = useState<StackObject | null>(null);

  return (
    <Layout
      stack={stack}
      selectedObject={selectedObject}
    />
  );
}

export default App;
