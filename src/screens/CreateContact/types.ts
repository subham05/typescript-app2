import {ProfileImageDetailsObj} from 'screens/AddEmployee';

export interface ContactFormModel {
  _id?: string;
  addedBy?: string;
  businessCardImage?: string;
  companyName: string;
  contactName: string;
  contactDesignation: string;
  contactDepartment: string;
  contactIndustry?: string;
  contactField?: string;
  contactSector: string;
  contactEmail?: string;
  contactPhone?: string | null;
  alternateContact?: string | null;
  contactAddress?: string;
  contactPhoneCountryCode?: string;
  alternateContactCountryCode?: string;
  contactType?: string;
  contactProfile?: string;
  contactSharedWith?: string[] | [];
  hasBusinessCard?: boolean;
  hasProfile?: boolean;
  isDeletable?: boolean;
  isEditable?: boolean;
  modifiedBy?: string;
  contactImageObj?: ProfileImageDetailsObj;
}
export interface shareContactData {
  _id: string;
  employeeId: string;
  companyName: string;
  contactName: string;
  contactSharedWith: string[];
  contactPhone: string;
  contactProfile: string;
  addedBy: string;
  time: string;
  date: string;
}
type phoneNumbers = {
  id: string;
  label: string;
  number: string;
};
export type sharedUserModal = {
  name: string;
  profileUrl: string;
  mobile: string;
};
export type sharedUserDataModal = {
  users: sharedUserModal[];
  companyName: string;
  role: string;
};
export type sharedBusinessData = {
  _id: string;
  clientId: string;
  companyId: string;
  employeeId: string;
  companyName: string;
  contactName: string;
  contactIndustry: string;
  contactField: string;
  contactDepartment: string;
  contactSector: string;
  contactEmail: string[];
  contactType: string;
  contactSharedWith: string[];
  contactOwner: string;
  contactPhone: string;
  contactJson: {
    phoneNumbers: phoneNumbers[];
    isStarred: boolean;
    postalAddresses: string[];
    thumbnailPath: string;
    department: string;
    jobTitle: string;
    emailAddresses: string[];
    urlAddresses: string[];
    suffix: string | null;
    company: string;
    imAddresses: string[];
    note: string;
    middleName: string;
    displayName: string;
    familyName: string;
    givenName: string;
    prefix: string | null;
    hasThumbnail: boolean;
    rawContactId: string;
    recordID: string;
  };
  contactProfile: string;
  status: string;
  shareLink: string;
  addedBy: string;
  modifiedBy: string;
  __v: string;
  createdAt: string;
  updatedAt: string;
};
export type shareContactDetailData = {
  record: sharedBusinessData;
  sharedUserData: sharedUserDataModal[];
};
export interface shareDetailRepoData {
  success: string;
  message: string;
  data: shareContactDetailData;
}
export interface requestToData {
  _id?: string;
  name: string;
  role: string;
  userId: string;
  profile: string;
  createdAt: string;
  companyId: string;
  profileUrl?: string;
  email?: string;
  designation?: string;
  position?: string;
}
export interface RequestToDataRepo {
  message: string;
  success: boolean;
  data: requestToData[];
}
