import {
  passwordEmojiValidator,
  passwordRegexValidator,
} from 'common/utils/Regex';
import Translate from 'translation/utils/translateFunction';
import * as yup from 'yup';

export const AddPasswordSchema = () => {
  const schema = yup.object().shape({
    password: yup
      .string()
      .matches(passwordRegexValidator, Translate('inboxPage:passwordError1'))
      .matches(passwordEmojiValidator, Translate('inboxPage:passwordError1'))
      .required(Translate('inboxPage:passwordError')),
  });

  return schema;
};
