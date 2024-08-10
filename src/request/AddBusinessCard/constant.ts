export interface businessCardModal {
  imageUrl: string | undefined | unknown;
}
export interface businessCArdData {
  success: boolean;
  message: string;
  data: {
    text: string;
  };
}
export interface addBusinessCardModel {
  companyName: string;
  contactName: string;
  contactProfile?: string;
  contactDesignation: string;
  contactIndustry: string;
  contactDepartment: string;
  contactField: string;
  contactSector: string;
  workEmail: string;
  contactPhoneCountryCode: string;
  contactPhone: string;
  alternateContactCountryCode: string;
  alternateContact: string;
  contactAddress: string;
  contactType?: string;
  businessCardImage?: string;
  cropImage?: string;
}
export interface addBusinessCardData {
  success: boolean;
  message: string;
  data: {
    clientId: string;
    employeeId: string;
    companyName: string;
    contactName: string;
    contactDesignation: string;
    contactIndustry: string;
    contactField: string;
    contactDepartment: string;
    contactSector: string;
    contactEmail: string[];
    contactType: string;
    contactSharedWith: [];
    contactPhoneCountryCode: string;
    contactPhone: string;
    alternateContactCountryCode: string;
    alternateContact: string;
    contactProfile: string;
    contactAddress: string;
    businessCardType: string;
    businessCardImage: string;
    status: string;
    shareLink: string;
    addedBy: string;
    modifiedBy: string;
    _id: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}
