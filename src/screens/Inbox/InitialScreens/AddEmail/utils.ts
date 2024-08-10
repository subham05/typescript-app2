import Translate from 'translation/utils/translateFunction';
import * as yup from 'yup';

const emailReg =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const AddEmailSchema = () => {
  const schema = yup.object().shape({
    email: yup
      .string()
      .matches(emailReg, Translate('login:emailError1'))
      .required(Translate('login:emailError')),
  });

  return schema;
};
