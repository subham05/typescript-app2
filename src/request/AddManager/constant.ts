import {pageInfo} from 'screens/Contacts';
import {CountryCode} from 'react-native-country-picker-modal';
import {ProfileImageDetailsObj} from 'screens/AddEmployee';

export interface ManagerModal {
  companyId: string | string[] | undefined;
  name: string;
  gender: string;
  dob?: string;
  designation: string;
  department: string;
  countryCode: string;
  mobile: string;
  mobileShortCode?: string;
  alternateMobile?: string;
  alternateMobileCountryCode?: string;
  alternateMobileShortCode?: string;
  mobileVerified?: string;
  companyExtension: string;
  companyNumber: string;
  hrMobileCountryCode?: string;
  hrMobileShortCode?: string;
  hrMobile?: string;
  isHrManager?: boolean;
  email: string;
  emailVerified?: string;
  reportTo: {
    id: string;
    name: string;
  };
  residenceAddress?: {
    latitude: number | undefined;
    longitude: number | undefined;
    latlong: {latitude: number | undefined; longitude: number | undefined};
    flat: string | undefined;
    address: string;
    country: string;
    state: string;
    city: string;
    zipCode: string | undefined;
  };
  workAddress: {
    latitude: number | undefined;
    longitude: number | undefined;
    latlong: {latitude: number | undefined; longitude: number | undefined};
    flat: string | undefined;
    address: string;
    country: string;
    state: string;
    city: string;
    zipCode: string | undefined;
  };
  role: {
    type: string;
    roleId: string;
  };
  primary?: string;
  system?: string;
  profileUrl: string | undefined | unknown;
  businessCard?: {
    type: string;
    fileURL: string;
    desc: string;
  };
  alternateContactNumber?: string;
  alterCountryCode?: string;
  countryISO?: string;
}

export interface ManagerData {
  success: string;
  message: string;
  data: dataModal;
  // errorr?: errorModal[];
}
// Define a service using a base URL and expected endpoints
export interface companyObjModal {
  _id: string;
  name: string;
}
export interface dataModal {
  clientId: string;
  companyId?: string;
  companyName?: string;
  name: string;
  profileUrl: string;
  gender: string;
  dob: string;
  businessCard: {
    type: string;
    fileURL: string;
    desc: string;
  };
  designation: string;
  department: string;
  companyExtension: string;
  companyNumber: string;
  companyNumberWithExtension: string;
  hrMobileCountryCode: string;
  hrMobile: string;
  hrMobileWithCountryCode: string;
  hrMobileShortCode?: CountryCode;
  alternateMobile?: string;
  alternateMobileCountryCode?: string;
  alternateMobileWithCountryCode?: string;
  alternateMobileShortCode?: CountryCode;
  reportTo?: {
    id: string;
    name: string;
    role: string;
    profileUrl: string;
  };
  residenceAddress: {
    latitude: number | undefined;
    longitude: number | undefined;
    latlong: {
      latitude: number;
      longitude: number;
    };
    flat?: string;
    address: string;
    country: string;
    state: string;
    city: string;
    zipCode?: string;
  };
  workAddress: {
    latitude: number | undefined;
    longitude: number | undefined;
    latlong: {
      latitude: number;
      longitude: number;
    };
    flat?: string;
    address: string;
    country: string;
    state: string;
    city: string;
    zipCode?: string;
    countryISO?: string;
  };
  login: {
    email: string;
    emailVerified: string;
    password: string;
    salt: string;
    countryCode: string;
    mobile: string;
    mobileWithCountryCode: string;
    mobileShortCode: CountryCode;
    mobileVerified: string;
    contactSync: string;
    accessToken?: string;
    latlong?: {
      latitude: number;
      longitude: number;
    };
    timezone?: string;
    utcOffset?: number;
  };
  role: {
    type: string;
    roleId: string;
  };
  zone?: string;
  primary: string;
  system: string;
  status: string;
  addedBy: string;
  modifiedBy?: string;
  _id: string;
  createdAt: string;
  updatedAt?: string;
  __v?: number;
  userId?: string;
  company?: companyObjModal[] | [];
  isEditable?: boolean;
  isHrManager?: boolean;
  isRateable?: boolean;
  profileImageDetails?: ProfileImageDetailsObj;
}
export interface getManagerModal {
  companies: string[];
  searchValue?: string;
  pageNo: number;
}
export interface managerListNode {
  name: string;
  userId: string;
  profile: string;
  email: string;
  mobile: string;
  hrMobile: string;
  companyNumber: string;
}
export interface managerListData {
  pageInfo: pageInfo;
  nodes: managerListNode[];
}
export interface getManagerData {
  success: boolean;
  message: string;
  data: managerListData;
}
export interface ManagerDetailData {
  success: string;
  message: string;
  data: dataModal[] | dataModal;
}
export interface ManagerDetailResponseData {
  success: string;
  message: string;
  data: dataModal[];
}
export interface RateManagerData {
  success: boolean;
  message: string;
}
export interface RateManagerModal {
  managerId: string | undefined;
  rateValue: {
    zone: string;
  };
}

export interface vendorDataModal {
  clientId: string;
  companyId?: string;
  name: string;
  profileUrl: string;
  gender: string;
  dob: string;
  businessCard: {
    type: string;
    fileURL: string;
    desc: string;
  };
  designation: string;
  department: string;
  companyExtension: string;
  companyNumber: string;
  companyNumberWithExtension: string;
  hrMobileCountryCode: string;
  hrMobile: string;
  hrMobileWithCountryCode: string;
  residenceAddress: {
    latitude: number | undefined;
    longitude: number | undefined;
    latlong: {
      latitude: number;
      longitude: number;
    };
    flat?: string;
    address: string;
    country: string;
    state: string;
    city: string;
    zipCode?: string;
  };
  workAddress: {
    latitude: number | undefined;
    longitude: number | undefined;
    latlong: {
      latitude: number;
      longitude: number;
    };
    flat?: string;
    address: string;
    country: string;
    state: string;
    city: string;
    zipCode?: string;
  };
  email: string;
  contactNumberWithCode: string;
  alternateContactWithCode: string;
  role: {
    type: string;
    roleId: string;
  };
  zone?: string;
  primary: string;
  system: string;
  status: string;
  addedBy: string;
  modifiedBy?: string;
  _id: string;
  createdAt: string;
  updatedAt?: string;
  __v?: number;
  userId?: string;
  company?: {
    _id: string;
    name: string;
  };
  login: {
    email: string;
    emailVerified: string;
    password: string;
    salt: string;
    countryCode: string;
    mobile: string;
    mobileWithCountryCode: string;
    mobileVerified: string;
    contactSync: string;
    accessToken?: string;
    latlong?: {
      latitude: number;
      longitude: number;
    };
    timezone?: string;
    utcOffset?: number;
  };
}
export interface VendorDetailData {
  success: string;
  message: string;
  data: vendorDataModal;
}
