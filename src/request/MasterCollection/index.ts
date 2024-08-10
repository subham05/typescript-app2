// Need to use the React-specific entry point to import createApi
import {Urls} from 'common/utils/ApiConstants';
import {CreateApi} from 'request/CreateApi';

export interface IdTitleModel {
  id: string;
  title: string;
}
interface minMax {
  MIN: number;
  MAX: number;
}
export interface validationData {
  nameLength: minMax;
  designationLength: minMax;
  departmentLength: minMax;
  contactPhoneLength: minMax;
  contactPhoneWithCountryCodeLength: minMax;
  telephoneLength: minMax;
  contactCountryCodeLength: minMax;
  mobileOTPLength: minMax;
  companyNameLimit: minMax;
  companyContactName: minMax;
  companyContactIndustry: minMax;
  companyContactSector: minMax;
  companyContactField: minMax;
  companyExtension: minMax;
  email: minMax;
  address: minMax;
  contactLimit: minMax;
  contactWithCountryLimit: minMax;
  landmarkLimit: minMax;
  cityLimit: minMax;
  telephoneLimit: minMax;
  commentLimit: minMax;
  taskName: minMax;
  taskDescription: minMax;
  renewalName: minMax;
  renewalTitle: minMax;
  documentTitle: minMax;
  documentDescription: minMax;
  taskRejectMessage: minMax;
}
export interface taskStatusColor {
  Inprogress: string;
  Completed: string;
  Reopened: string;
  Assigned: string;
  Accepted: string;
  Rejected: string;
  AwaitingApproval: string;
  Overdue: string;
  Resolved: string;
  Reassigned: string;
}
interface MasterCollectionData {
  priority: string[];
  typeOfTask: string[];
  taskStatus: string[];
  documentCategory: string[];
  validationLength: validationData;
  language: string[];
  TaskStatusColor: taskStatusColor;
}

interface MasterCollection {
  data: MasterCollectionData;
  success: string;
  message: string;
}

export interface CMSBodyParams {
  osType: string;
}
export interface ApiResponse {
  status: number;
  success: boolean;
  message: string;
  data: any;
}

const MasterCollection = CreateApi.injectEndpoints({
  endpoints: builder => ({
    getMasterCollection: builder.query<MasterCollectionData, void>({
      query: () => ({
        url: Urls.masterDefault,
        method: 'GET',
        // headers: {
        //   token: 'token',
        // },
      }),
      transformResponse: (response: MasterCollection) => {
        return response.data;
      },
    }),
    getCMSPrivacy: builder.mutation<ApiResponse, CMSBodyParams>({
      query: body => ({
        url: 'cms/privacy',
        method: 'POST',
        body,
      }),
    }),
    getCMSTerms: builder.mutation<ApiResponse, CMSBodyParams>({
      query: body => ({
        url: 'cms/termsAndConditions',
        method: 'POST',
        body,
      }),
    }),
    getCMSAbout: builder.mutation<ApiResponse, CMSBodyParams>({
      query: body => ({
        url: 'cms/aboutus',
        method: 'POST',
        body,
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetMasterCollectionQuery,
  useGetCMSPrivacyMutation,
  useGetCMSTermsMutation,
  useGetCMSAboutMutation,
} = MasterCollection;
