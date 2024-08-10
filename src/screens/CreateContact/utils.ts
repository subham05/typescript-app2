import Translate from 'translation/utils/translateFunction';
import * as yup from 'yup';

// const phoneRegExp =
//   /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const phoneRegex = /^[0-9]{0,1}[/0-9]*$/g;

const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const EditBusinessCardSchema = () => {
  const schema = yup.object().shape({
    companyName: yup
      .string()
      .required(Translate('businessCard:companyNameError')),
    contactName: yup.string().required(Translate('businessCard:nameError')),
    contactDesignation: yup
      .string()
      .required(Translate('businessCard:designationError')),
    contactDepartment: yup
      .string()
      .required(Translate('businessCard:departmentError')),
    contactSector: yup.string().required(Translate('businessCard:sectorError')),
    contactEmail: yup
      .string()
      // .email()
      .matches(emailRegex, Translate('businessCard:emailValid'))
      .required(Translate('businessCard:emailError')),
    contactPhone: yup
      .string()
      .matches(phoneRegex, Translate('businessCard:contactNumberError_1'))
      // .typeError(Translate('businessCard:contactNumberError_1'))
      .required(Translate('businessCard:contactNumberError_2')),

    // yup.string()
    // // .matches(phoneRegExp, Translate('businessCard:contactNumberError_1'))

    alternateContact: yup
      .string()
      .matches(
        phoneRegex,
        Translate('businessCard:alternateContactNumberError_1'),
      ),
    // .required(Translate('businessCard:alternateContactNumberError_2')),
    contactAddress: yup
      .string()
      .required(Translate('businessCard:addressError')),
  });
  return schema;
};
