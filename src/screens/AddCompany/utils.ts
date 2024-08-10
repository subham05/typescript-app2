import Translate from 'translation/utils/translateFunction';
import * as yup from 'yup';

// const phoneRegExp =
//   /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

// const URLRegex =
//   /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;

// const pattern = /[a-zA-Z0-9]+([\s][a-zA-Z0-9]+)*/;
// const numRegex = /[0-9]/;
export const AddCompanySchema = () => {
  const schema = yup.object().shape({
    name: yup.string().trim().required(Translate('addCompany:nameError')),
    website: yup.string().trim().required(Translate('addCompany:urlError')),
    contact: yup.string().trim(),
    officeTelephone: yup
      .string()
      .trim()
      .required(Translate('addCompany:officeTelephoneError_2')),
    address: yup.string().trim().required(Translate('addCompany:addressError')),
    landmark: yup.string().trim(),
    country: yup.string().trim().required(Translate('addCompany:countryError')),
    state: yup.string().trim().required(Translate('addCompany:stateError')),
    city: yup.string().trim(),
    zipcode: yup.string().trim(),
  });

  return schema;
};
