import Translate from 'translation/utils/translateFunction';
import * as yup from 'yup';

// const phoneRegExp =
//   /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

// const pattern = /[a-zA-Z0-9]+([\s][a-zA-Z0-9]+)*/;

export const AddManagerSchema = () => {
  const schema = yup.object().shape({
    company: yup.string().trim().required(Translate('addManager:companyError')),
    companyName: yup
      .string()
      .trim()
      .required(Translate('managersHomePage:companyPlaceholder')),
    name: yup
      .string()
      .trim()
      .required(Translate('managersHomePage:vendorPlaceholder')),
    // designation: yup
    //   .string()
    //   .trim()
    //   .required(Translate('addManager:designationError')),
    // department: yup
    //   .string()
    //   .trim()
    //   .required(Translate('addManager:departmentError')),
    mobile: yup.string().trim().required(Translate('addManager:numberError_2')),
    // alternateMobile: yup
    //   .string()
    //   .trim()
    //   .required(Translate('addManager:alternate_numberError_2')),
    email: yup
      .string()
      .email()
      .trim()
      .required(Translate('addManager:emailError')),
    // dob: yup.string().trim().required(Translate('managersHomePage:dobError')),
    // address: yup.string().trim().required(Translate('addManager:addressError')),
    // HRContactNumber: yup.string().trim(),
    // companyNumber: yup.string().trim(),
    // companyExtension: yup.string().trim(),
    // addressArea: yup.string().trim(),
    // country: yup.string().trim().required(Translate('addManager:countryError')),
    // state: yup.string().trim().required(Translate('addManager:stateError')),
    // city: yup.string().trim(),
    // zipcode: yup.string().trim(),
    workAddressBlock: yup
      .string()
      .trim()
      .required(Translate('addManager:workAddressError')),
    workAddressArea: yup.string().trim(),
    workCountry: yup
      .string()
      .trim()
      .required(Translate('addManager:countryError')),
    workState: yup.string().trim().required(Translate('addManager:stateError')),
    reportTo: yup
      .string()
      .trim()
      .required(Translate('addManager:reportToError')),
    // workCity: yup.string().trim(),
    // workZipcode: yup.string().trim(),
  });
  return schema;
};
