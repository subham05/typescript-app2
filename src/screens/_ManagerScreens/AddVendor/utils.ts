import Translate from 'translation/utils/translateFunction';
import * as yup from 'yup';

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const AddOwnerSchema = () => {
  const schema = yup.object().shape({
    companyName: yup
      .string()
      .required(Translate('managersHomePage:companyPlaceholder')),
    name: yup.string().required(Translate('addOwner:nameError')),
    gender: yup.string().required(Translate('addOwner:genderError')),
    email: yup.string().email().required(Translate('addOwner:emailError')),
    number: yup
      .string()
      .matches(phoneRegExp, Translate('addOwner:numberError_1'))
      .required(Translate('addOwner:numberError_2')),
    alternateNumber: yup
      .string()
      .matches(phoneRegExp, Translate('addOwner:alternate_numberError_1'))
      .required(Translate('addOwner:alternate_numberError_2')),
    address: yup.string().required(Translate('addOwner:addressError')),
    dob: yup.string().required(Translate('managersHomePage:dobError')),
  });
  return schema;
};
