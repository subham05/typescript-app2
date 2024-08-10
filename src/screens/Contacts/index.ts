export interface ContactModal {
  _id: string;
  companyName: string;
  contactName: string;
  contactDesignation: string;
  contactDepartment: string;
  contactIndustry?: string;
  contactField?: string;
  contactSector: string;
  contactEmail: string[] | string;
  contactType: string;
  contactSharedWith: [];
  contactPhoneCountryCode: string;
  contactPhone: string;
  alternateContactCountryCode: string;
  alternateContact: string;
  contactProfile: string;
  contactAddress: string;
  businessCardImage: string;
  addedBy: string;
  modifiedBy: string;
  hasProfile: boolean;
  hasBusinessCard: boolean;
  isEditable: boolean;
  isDeletable: boolean;
  showTitle?: boolean;
}
export interface ContactModalSort {
  _id: string;
  contacts: ContactModal[];
}
export interface pageInfo {
  lastPageNo: number;
  totalCount: number;
  currentPageNo?: number;
  hasNextPage?: boolean;
}

export interface AddContactModal {
  companyName: string;
  contactName: string;
  contactProfile: string;
  contactDesignation: string;
  contactDepartment: string;
  contactSector: string;
  workEmail: string;
  contactPhoneCountryCode: string;
  contactPhone: string | null;
  alternateContactCountryCode: string;
  alternateContact: string | null;
  contactAddress: string;
  contactType: string;
  businessCardImage: string;
}
export interface FilterModal {
  id: string;
  employeeId: string;
  companyName: string;
  contactName: string;
  contactIndustry: string;
  contactField: string;
  contactDepartment: string;
  contactDesignation?: string;
  contactSector: string;
  contactEmail: string[];
  contactType: string;
  contactSharedWith: [];
  contactPhone: string;
  contactJson: {
    phoneNumbers: [
      {
        id: string;
        label: string;
        number: string;
      },
    ];
    isStarred: boolean;
    postalAddresses: [];
    thumbnailPath: string;
    department: string;
    jobTitle: string;
    emailAddresses: [];
    urlAddresses: [];
    suffix: string;
    company: string;
    imAddresses: [];
    note: string;
    middleName: string;
    displayName: string;
    familyName: string;
    givenName: string;
    prefix: string;
    hasThumbnail: boolean;
    rawContactId: string;
    recordID: string;
  };
  contactProfile: string;
  addedBy: string;
  modifiedBy: string;
  formattedDate: null;
  formattedTime: null;
  role: string;
  hasProfile: boolean;
  hasBusinessCard: boolean;
  isEditable: boolean;
  isDeletable: boolean;
}
export interface FilterRoleData {
  pageInfo: pageInfo;
  nodes: FilterModal[];
}
export interface filterRolePrivateModal {
  employeeId: string;
  pageNo: number;
  searchValue: string;
}
