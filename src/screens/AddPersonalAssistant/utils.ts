import Translate from 'translation/utils/translateFunction';
import * as yup from 'yup';

export const AddPASchema = () => {
  const schema = yup.object().shape({
    company: yup.string().trim(),
    name: yup.string().trim().required(Translate('addPA:nameError')),
    designation: yup
      .string()
      .trim()
      .required(Translate('addManager:designationError')),
    department: yup
      .string()
      .trim()
      .required(Translate('addManager:departmentError')),
    mobile: yup.string().trim().required(Translate('addManager:numberError_2')),
    email: yup
      .string()
      .email()
      .trim()
      .required(Translate('addManager:emailError')),
    dob: yup.string().required(Translate('managersHomePage:dobError')),
    address: yup.string().trim().required(Translate('addManager:addressError')),
    companyNumber: yup.string().trim(),
    companyExtension: yup.string().trim(),
    addressArea: yup.string().trim(),
    country: yup.string().trim().required(Translate('addManager:countryError')),
    state: yup.string().trim().required(Translate('addManager:stateError')),
    city: yup.string().trim(),
    zipcode: yup.string().trim(),
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
    workCity: yup.string().trim(),
    workZipcode: yup.string().trim(),
    reportTo: yup
      .string()
      .trim()
      .required(Translate('addManager:reportToError')),
  });
  return schema;
};
