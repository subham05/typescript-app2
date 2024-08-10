import Translate from 'translation/utils/translateFunction';
import * as yup from 'yup';

export const AddRenewalsSchema = () => {
  const schema = yup.object().shape({
    companyId: yup
      .string()
      .trim()
      .required(Translate('addManager:companyError')),
    name: yup
      .string()
      .trim()
      // .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed for this field ')
      .required(Translate('renewals:nameError')),
    type: yup.string().required(Translate('renewals:typeError')),
    // title: yup
    //   .string()
    //   .trim()
    //   .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed for this field '),
    registrationDate: yup
      .string()
      .required(Translate('renewals:registrationDateError')),
    // expiryDate: yup.string().required(Translate('renewals:expiryDateError')),
  });
  return schema;
};
