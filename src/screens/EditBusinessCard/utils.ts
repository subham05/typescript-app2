import Translate from 'translation/utils/translateFunction';
import * as yup from 'yup';

const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const EditBusinessCardSchema = () => {
  const schema = yup.object().shape({
    companyName: yup
      .string()
      .trim()
      .required(Translate('businessCard:companyNameError')),
    contactName: yup
      .string()
      .trim()
      .required(Translate('businessCard:nameError')),
    contactDesignation: yup.string().trim(),
    contactIndustry: yup.string().trim(),
    contactDepartment: yup.string().trim(),
    contactField: yup.string().trim(),
    contactSector: yup.string().trim(),
    workEmail: yup
      .string()
      // .email()
      .matches(emailRegex, Translate('businessCard:emailValid'))
      .required(Translate('businessCard:emailError')),
    contactPhone: yup
      .string()
      .trim()
      .required(Translate('businessCard:contactNumberError_2')),
    alternateContact: yup.string().trim(),
    contactAddress: yup.string().trim(),
  });
  return schema;
};
