import type { Stack } from './types';

const gameCardId = 'card-janken-main';
const winCardId = 'card-janken-win';
const loseCardId = 'card-janken-lose';

// This is the script that will be shared by the three choice buttons.
// We pass the player's choice as an argument.
// NOTE: This script relies on global functions like `switchCard` and a global `stack` variable.
// This will need to be refactored when we implement the script execution logic in React.
const playJankenScript = (playerChoice: 'rock' | 'paper' | 'scissors') => `
  const choices = ['rock', 'paper', 'scissors'];
  const computerChoice = choices[Math.floor(Math.random() * 3)];

  const getOutcome = (p, c) => {
    if (p === c) return 'draw';
    if ((p === 'rock' && c === 'scissors') || (p === 'scissors' && c === 'paper') || (p === 'paper' && c === 'rock')) return 'win';
    return 'lose';
  };

  const outcome = getOutcome('${playerChoice}', computerChoice);

  if (outcome === 'win') {
    switchCard('${winCardId}');
  } else if (outcome === 'lose') {
    switchCard('${loseCardId}');
  } else {
    const currentCard = stack.cards.find(c => c.id === stack.currentCardId);
    const resultText = currentCard.objects.find(o => o.id === 'obj-janken-result');
    if (resultText) {
      const choiceMap = {rock: 'ぐー', paper: 'ぱー', scissors: 'ちょき'};
      resultText.text = 'あいこ！ (相手: ' + choiceMap[computerChoice] + ')';
      // Clear the text after a while
      setTimeout(() => {
        if (resultText.text.startsWith('あいこ')) { // Only clear if it's still the draw message
          resultText.text = '';
          renderAll();
        }
      }, 1500);
      renderAll();
    }
  }
`;

export const initialStack: Stack = {
  cards: [
    // 1. Main Game Card
    {
      id: gameCardId,
      name: 'じゃんけんゲーム',
      objects: [
        {
          id: 'obj-janken-title',
          type: 'text',
          x: 57, y: 80, width: 300, height: 50,
          text: 'じゃんけん勝負！',
          textAlign: 'center',
          fontSize: '32px',
          fontWeight: 'bold',
          borderWidth: 'none',
          script: '',
          color: '#333333',
        },
        {
          id: 'obj-janken-prompt',
          type: 'text',
          x: 107, y: 150, width: 200, height: 30,
          text: '手を選んでね',
          textAlign: 'center',
          fontSize: '20px',
          borderWidth: 'none',
          script: '',
          color: '#333333',
        },
        {
          id: 'obj-janken-rock',
          type: 'button',
          x: 107, y: 220, width: 200, height: 60,
          text: 'ぐー ✊',
          textAlign: 'center',
          fontSize: '24px',
          borderWidth: 'medium',
          script: playJankenScript('rock'),
        },
        {
          id: 'obj-janken-scissors',
          type: 'button',
          x: 107, y: 300, width: 200, height: 60,
          text: 'ちょき ✌️',
          textAlign: 'center',
          fontSize: '24px',
          borderWidth: 'medium',
          script: playJankenScript('scissors'),
        },
        {
          id: 'obj-janken-paper',
          type: 'button',
          x: 107, y: 380, width: 200, height: 60,
          text: 'ぱー ✋',
          textAlign: 'center',
          fontSize: '24px',
          borderWidth: 'medium',
          script: playJankenScript('paper'),
        },
        {
          id: 'obj-janken-result',
          type: 'text',
          x: 57, y: 500, width: 300, height: 40,
          text: '',
          textAlign: 'center',
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#4a90e2',
          borderWidth: 'none',
          script: '',
        },
      ],
    },
    // 2. Win Card
    {
      id: winCardId,
      name: '勝ち!',
      objects: [
        {
          id: 'obj-win-title',
          type: 'text',
          x: 57, y: 150, width: 300, height: 80,
          text: 'あなたの勝ち!',
          textAlign: 'center',
          fontSize: '48px',
          fontWeight: 'bold',
          color: '#4a90e2',
          borderWidth: 'none',
          script: '',
        },
        {
          id: 'obj-win-reward',
          type: 'text',
          x: 57, y: 250, width: 300, height: 100,
          text: 'おめでとう!\nこれがご褒美カードよ！\n( ´ ▽ ` )ﾉ',
          textAlign: 'center',
          fontSize: '24px',
          borderWidth: 'thin',
          script: '',
        },
        {
          id: 'obj-win-restart',
          type: 'button',
          x: 107, y: 450, width: 200, height: 60,
          text: 'もう一度遊ぶ',
          textAlign: 'center',
          fontSize: '20px',
          borderWidth: 'thin',
          action: 'jumpToCard',
          jumpToCardId: gameCardId,
          script: '',
        },
      ],
    },
    // 3. Lose Card
    {
      id: loseCardId,
      name: '負け...',
      objects: [
        {
          id: 'obj-lose-title',
          type: 'text',
          x: 57, y: 200, width: 300, height: 80,
          text: 'あなたの負け…',
          textAlign: 'center',
          fontSize: '48px',
          fontWeight: 'bold',
          color: '#e03131',
          borderWidth: 'none',
          script: '',
        },
        {
          id: 'obj-lose-restart',
          type: 'button',
          x: 107, y: 400, width: 200, height: 60,
          text: 'もう一度挑戦する',
          textAlign: 'center',
          fontSize: '20px',
          borderWidth: 'thin',
          action: 'jumpToCard',
          jumpToCardId: gameCardId,
          script: '',
        },
      ],
    },
  ],
  currentCardId: gameCardId,
};