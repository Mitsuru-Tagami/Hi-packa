export type ObjectType = 'button' | 'text' | 'image';
export type TextAlign = 'left' | 'center' | 'right';
export type BorderWidth = 'none' | 'thin' | 'medium' | 'thick';
export type ButtonAction = 'none' | 'jumpToCard';

export type StackObject = {
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
  action?: ButtonAction;
  jumpToCardId?: string | null;
  src?: string;
  objectFit?: 'contain' | 'fill';
  // New text formatting properties
  fontSize?: string;
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
  textDecoration?: 'none' | 'underline';
  color?: string;
  fontFamily?: string;
  borderColor?: string;
  backgroundColor?: string; // New property for background color
};

export type Card = {
  id: string;
  name: string;
  objects: StackObject[];
};

export type Stack = {
  cards: Card[];
  currentCardId: string | null;
};
