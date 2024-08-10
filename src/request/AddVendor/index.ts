// Need to use the React-specific entry point to import createApi
import {CreateApi} from 'request/CreateApi';
import {
  getManagerData,
  getManagerModal,
  ManagerData,
  managerListData,
  ManagerModal,
  RateManagerData,
  VendorDetailData,
} from '../AddManager/constant';

interface editManagerModal {
  mangerObj: ManagerModal;
  managerId?: string;
  vendorId?: string;
}
const AddVendor = CreateApi.injectEndpoints({
  endpoints: builder => ({
    setVendor: builder.mutation<ManagerData, editManagerModal>({
      query: ({mangerObj}) => {
        return {
          url: 'vendor/add',
          method: 'POST',
          // headers: {
          //   token: 'token',
          // },
          body: mangerObj,
        };
      },
      transformResponse: (response: ManagerData) => {
        return response;
      },
    }),
    getVendors: builder.query<managerListData, getManagerModal>({
      query: ({companies, pageNo}) => {
        return {
          url: 'vendor/list',
          method: 'POST',
          // headers: {
          //   token: 'token',
          // },
          body: {companyId: companies, pageNo: pageNo},
        };
      },
      transformResponse: (response: getManagerData) => {
        return response.data;
      },
    }),
    // getCompanyList: builder.query<CompanyProps[], void>({
    //   query: () => ({
    //     url: Urls.getCompanyList,
    //     method: 'GET',
    //     // headers: {
    //     //   token: 'token',
    //     // },
    //   }),
    //   transformResponse: (response: CompanyResponseCollection) => {
    //     return response.data;
    //   },
    // }),
    getVendorDetail: builder.query<VendorDetailData, string>({
      query: vendorId => ({
        url: `vendor/view/${vendorId}`,
        method: 'GET',
        // headers: {
        //   token: 'token',
        // },
      }),
      transformResponse: (response: VendorDetailData) => {
        return response;
      },
    }),
    editVendor: builder.mutation<ManagerData, editManagerModal>({
      query: ({vendorId, mangerObj}) => {
        return {
          url: `vendor/edit/${vendorId}`,
          method: 'PUT',
          // headers: {
          //   token: 'token',
          // },
          body: mangerObj,
        };
      },
      transformResponse: (response: ManagerData) => {
        return response;
      },
    }),
    // rateManager: builder.mutation<RateManagerData, RateManagerModal>({
    //   query: ({managerId, rateValue}) => {
    //     return {
    //       url: `${Urls.rateManager}${managerId}`,
    //       method: 'PUT',
    //       // headers: {
    //       //   token: 'token',
    //       // },
    //       body: rateValue,
    //     };
    //   },
    //   transformResponse: (response: RateManagerData) => {
    //     return response;
    //   },
    // }),
    deleteVendor: builder.mutation<RateManagerData, string>({
      query: vendorId => {
        return {
          url: 'vendor/delete/',
          method: 'DELETE',
          // headers: {
          //   token: 'token',
          // },
          body: {
            vendorId: vendorId,
          },
        };
      },
      transformResponse: (response: RateManagerData) => {
        return response;
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useSetVendorMutation,
  useLazyGetVendorsQuery,
  useLazyGetVendorDetailQuery,
  useEditVendorMutation,
  useDeleteVendorMutation,
  //   useLazyGetManagersQuery,
  //   useGetCompanyListQuery,
  //   useLazyGetManagerDetailQuery,
  //   useEditManagerMutation,
  //   useRateManagerMutation,
  //   useDeleteManagerMutation,
} = AddVendor;
