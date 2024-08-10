import {RadioButtonOption} from 'components/RadioButton';

export interface AddPA {
  companyId: string[];
  company: string | undefined;
  name: string;
  gender: RadioButtonOption;
  dob: string;
  designation: string;
  department: string;
  countryCode: string;
  mobile: string;
  alternateMobile: string;
  alternateMobileCountryCode: string;
  companyNumber: string;
  companyExtension: string;
  email: string;
  address: string;
  addressArea: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  workAddressBlock: string;
  workAddressArea: string;
  workCountry: string;
  workState: string;
  workCity: string;
  workZipcode: string;
  countryShort: string;
  reportTo: string;
}
