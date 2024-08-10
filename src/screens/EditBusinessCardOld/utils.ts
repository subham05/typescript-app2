import Translate from 'translation/utils/translateFunction';
import * as yup from 'yup';

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const EditBusinessCardSchema = () => {
  const schema = yup.object().shape({
    username: yup.string().required(Translate('businessCard:nameError')),
    designation: yup
      .string()
      .required(Translate('businessCard:designationError')),
    email: yup.string().email().required(Translate('businessCard:emailError')),
    number: yup
      .string()
      .matches(phoneRegExp, Translate('businessCard:contactNumberError_1'))
      .required(Translate('businessCard:contactNumberError_2')),
    address: yup.string().required(Translate('businessCard:addressError')),
  });
  return schema;
};
