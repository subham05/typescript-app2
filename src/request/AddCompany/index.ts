// Need to use the React-specific entry point to import createApi
import {CreateApi} from 'request/CreateApi';
import {Urls} from 'common/utils/ApiConstants';

// Define a service using a base URL and expected endpoints
interface dataModal {
  clientId: string;
  userId: string;
  name: string;
  website: string;
  countryCode: string;
  contact: string;
  contactWithCountryCode: string;
  officeAddress: {
    latlong: {
      latitude: number;
      longitude: number;
    };
    address: string;
    country: string;
    state: string;
    city: string;
    landmark: string;
    zipcode: string;
  };
  logo: string;
  system: string;
  status: string;
  addedBy: string;
  _id: string;
  __v?: number;
}
// export interface WebsiteModal {
//   priority: string[];
//   typeOfTask: string[];
//   taskStatus: string[];
//   companyUrl: string[];
// }
export interface CompanyData {
  success: boolean;
  message: string;
  data: dataModal;
  // errorr?: errorModal[];
}
export interface WebsiteData {
  success: string;
  message: string;
  data: string[];
  // errorr?: errorModal[];
}
export interface CompanyModal {
  clientId: string;
  name: string;
  website: string;
  countryCode?: string;
  contact: string;
  officeTelephone: string;
  contactWithCountryCode?: string;
  officeAddress: {
    latlong?: {
      latitude: number | undefined;
      longitude: number | undefined;
    };
    address: string;
    country: string;
    state: string;
    city: string;
    landmark: string;
    zipcode: string;
  };
  logo: string | undefined | unknown;
}
export interface companyError {
  value: string;
  msg: string;
  param: string;
  location: string;
}
const AddCompany = CreateApi.injectEndpoints({
  endpoints: builder => ({
    setCompanyData: builder.mutation<CompanyData, CompanyModal>({
      query: companyObj => {
        return {
          url: Urls.setCompany,
          method: 'POST',
          // headers: {
          //   token: 'token',
          // },
          body: companyObj,
        };
      },
      transformResponse: (response: CompanyData) => {
        return response;
      },
    }),
    getWebsites: builder.query<string[], void>({
      query: () => ({
        url: Urls.getWebsites,
        method: 'GET',
        // headers: {
        //   token: 'token',
        // },
      }),
      transformResponse: (response: WebsiteData) => {
        return response.data;
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {useSetCompanyDataMutation, useLazyGetWebsitesQuery} = AddCompany;
