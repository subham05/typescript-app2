import {RadioButtonOption} from 'components/RadioButton';

export interface AddVendorProps {
  companyId: string;
  company: string | undefined;
  companyName: string;
  name: string;
  designation: string;
  gender: RadioButtonOption;
  department: string;
  mobile: string;
  countryCode: string;
  alternateMobile: string;
  alternateMobileCountryCode?: string;
  email: string;
  address: string;
  // dob: string;
  // extensionNumber: string;
  hrMobile: string;
  hrMobileCountryCode: string;
  companyExtension: string;
  companyNumber: string;
  addressArea: string | undefined;
  country: string;
  state: string;
  city: string;
  zipcode: string | undefined;
  workAddressBlock: string;
  workAddressArea: string | undefined;
  workCountry: string;
  workState: string;
  workCity: string;
  workZipcode: string | undefined;
  companyAddress: string;
  countryShort?: string;
  reportTo: string;
}
