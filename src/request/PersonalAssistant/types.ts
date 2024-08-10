import {dataModal, ManagerModal} from 'request/AddManager/constant';
import {pageInfo} from 'screens/Contacts';

export interface AddPAData {
  success: string;
  message: string;
  data: dataModal;
  // errorr?: errorModal[];
}

export interface PAModal {
  companyId?: string;
  name: string;
  gender: string;
  dob: string;
  designation: string;
  department: string;
  countryCode: string;
  mobile: string;
  mobileShortCode: string;
  mobileVerified: string;
  companyExtension: string;
  companyNumber: string;
  email: string;
  emailVerified: string;
  residenceAddress: {
    latitude: number;
    longitude: number;
    latlong: {
      latitude: number;
      longitude: number;
    };
    flat: string;
    address: string;
    country: string;
    state: string;
    city: string;
    zipCode: string;
  };
  workAddress: {
    latitude: number;
    longitude: number;
    latlong: {
      latitude: number;
      longitude: number;
    };
    flat: string;
    address: string;
    country: string;
    state: string;
    city: string;
    zipCode: string;
    countryISO: string;
  };
  role: {
    type: string;
  };
  profileUrl: string;
  primary: string;
  system: string;
}

export interface PADetailData {
  success: string;
  message: string;
  data: dataModal[];
}

export interface getPAData {
  success: boolean;
  message: string;
  data: PAListData;
}
export interface PAListData {
  pageInfo: pageInfo;
  nodes: PAListNode[];
}
export interface PAListNode {
  name: string;
  userId: string;
  profile: string;
  email: string;
  mobile: string;
  hrMobile: string;
  companyNumber: string;
}
export interface getPAModal {
  companies: string[];
  searchValue: string;
  pageNo: number;
}

export interface editPAModal {
  PAObj: ManagerModal;
  PAId?: string;
}

export interface deletePAData {
  success: boolean;
  message: string;
}
