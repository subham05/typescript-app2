import {CreateApi} from 'request/CreateApi';

export interface LatLong {
  latitude: number;
  longitude: number;
}

export interface OfficeAddress {
  latLong: LatLong;
  address: string;
  country: string;
  state: string;
  city: string;
  landmark: string;
  zipcode: string;
}

export interface CompanyListResponseProps {
  officeAddress?: OfficeAddress;
  _id: string;
  name: string;
}

export interface RootObject {
  success: boolean;
  message: string;
  data: CompanyListResponseProps[];
}

export interface CompanySelectionBody {
  companyId: string;
}
export interface CompanySelectionResponse {}

export interface CompanyResponse {
  success: boolean;
  message: string;
}

const CompanyList = CreateApi.injectEndpoints({
  endpoints: builder => ({
    companyList: builder.query<RootObject, void>({
      query: () => ({
        url: 'company/companylist',
        // headers: {
        //   token: 'token',
        // },
      }),
    }),
    companyListing: builder.mutation<RootObject, void>({
      query: () => ({
        url: 'company/companylist',
        // headers: {
        //   token: 'token',
        // },
      }),
    }),
    companySelection: builder.mutation<
      CompanySelectionResponse,
      CompanySelectionBody
    >({
      query: body => ({
        url: 'users/selectCompany',
        method: 'PUT',
        // headers: {
        //   token: 'token',
        // },
        body: body,
      }),
    }),
  }),
});

export const {
  useCompanyListQuery,
  useLazyCompanyListQuery,
  useCompanyListingMutation,
  useCompanySelectionMutation,
} = CompanyList;
