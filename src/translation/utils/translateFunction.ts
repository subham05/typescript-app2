import i18n from 'translation/Localization';

const Translate = (key: any) => {
  const result = i18n.t(key);
  return result;
};

export default Translate;
