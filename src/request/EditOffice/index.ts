// Need to use the React-specific entry point to import createApi
import {Urls} from 'common/utils/ApiConstants';
import {CreateApi} from 'request/CreateApi';

export interface ViewCompanyDetails {
  success: boolean;
  message: string;
  data: ViewCompanyDataModal;
}

export interface ViewCompanyDataModal {
  officeAddress: OfficeAddressModal;
  _id: string;
  clientId: string;
  name: string;
  website: string;
  countryCode: string;
  contact: string;
  contactWithCountryCode: string;
  officeTelephone: string;
  logo: string;
}

interface OfficeAddressModal {
  address: string;
  country: string;
  state: string;
  city: string;
  landmark: string;
  zipcode: string;
  latlong?: {
    latitude: number | undefined;
    longitude: number | undefined;
  };
}

export interface ViewOfficeBody {
  companyId: string;
}

const EditOffice = CreateApi.injectEndpoints({
  endpoints: builder => ({
    viewCompanyDetails: builder.mutation<ViewCompanyDetails, ViewOfficeBody>({
      query: bodyObj => {
        return {
          url: Urls.companyDetails,
          method: 'POST',
          body: bodyObj,
        };
      },
      transformResponse: (response: ViewCompanyDetails) => {
        return response;
      },
    }),
    editOffice: builder.mutation<ViewCompanyDetails, any>({
      query: bodyObj => {
        return {
          url: Urls.editCompany,
          method: 'PUT',
          body: bodyObj,
        };
      },
      transformResponse: (response: ViewCompanyDetails) => {
        return response;
      },
    }),
    deleteOffice: builder.mutation<ViewCompanyDetails, ViewOfficeBody>({
      query: ({companyId}) => {
        return {
          url: `${Urls.deleteOfficeLocation}/${companyId}`,
          method: 'DELETE',
        };
      },
      transformResponse: (response: ViewCompanyDetails) => {
        return response;
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useViewCompanyDetailsMutation,
  useEditOfficeMutation,
  useDeleteOfficeMutation,
} = EditOffice;
