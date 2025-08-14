import i18next from 'i18next';
import en from './en.json';
import ja from './ja.json';

i18next.init({
  lng: 'ja', // アプリのデフォルト言語
  fallbackLng: 'en', // もし翻訳が見つからない場合に英語を使う
  resources: {
    en: {
      translation: en.translation,
    },
    ja: {
      translation: ja.translation,
    },
  },
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },
});

// t関数を直接エクスポートして、他のファイルで使いやすくする
export const t = i18next.t.bind(i18next);

export default i18next;
