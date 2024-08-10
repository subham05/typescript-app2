export interface BusinessCardFormModel {
  _id?: string;
  addedBy?: string;
  businessCardImage?: string;
  companyName: string;
  contactName: string;
  contactDesignation: string;
  contactIndustry: string;
  contactDepartment: string;
  contactSector: string;
  contactField: string;
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
}
