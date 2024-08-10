// Need to use the React-specific entry point to import createApi
import {Urls} from 'common/utils/ApiConstants';
import {CompanyProps} from 'components/SelectCompany/CompanyListView';
import {CompanyResponseCollection} from 'request/AddTask';
import {CreateApi} from 'request/CreateApi';
import {
  getManagerData,
  getManagerModal,
  ManagerData,
  ManagerDetailResponseData,
  managerListData,
  ManagerModal,
  RateManagerData,
  RateManagerModal,
} from './constant';
import {
  ReportToParams,
  ReportToResponseData,
  ReportToResponseList,
} from './ReportToResponseData';

interface editManagerModal {
  mangerObj: ManagerModal;
  managerId?: string;
}
const AddManager = CreateApi.injectEndpoints({
  endpoints: builder => ({
    setManager: builder.mutation<ManagerData, editManagerModal>({
      query: ({mangerObj}) => {
        return {
          url: Urls.setManager,
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
    getManagers: builder.query<managerListData, getManagerModal>({
      query: ({searchValue, companies, pageNo}) => {
        return {
          url: `${Urls.getManager}${pageNo}`,
          method: 'POST',
          // headers: {
          //   token: 'token',
          // },
          body: {companies: companies, searchValue: searchValue},
        };
      },
      transformResponse: (response: getManagerData) => {
        return response.data;
      },
    }),
    getCompanyList: builder.query<CompanyProps[], void>({
      query: () => ({
        url: Urls.getCompanyList,
        method: 'GET',
        // headers: {
        //   token: 'token',
        // },
      }),
      transformResponse: (response: CompanyResponseCollection) => {
        return response.data;
      },
    }),
    getManagerDetail: builder.query<ManagerDetailResponseData, string>({
      query: managerId => ({
        url: `${Urls.getManagerDetail}${managerId}`,
        method: 'GET',
      }),
      transformResponse: (response: ManagerDetailResponseData) => {
        return response;
      },
    }),
    editManager: builder.mutation<ManagerData, editManagerModal>({
      query: ({managerId, mangerObj}) => {
        return {
          url: `${Urls.editManager}${managerId}`,
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
    rateManager: builder.mutation<RateManagerData, RateManagerModal>({
      query: ({managerId, rateValue}) => {
        return {
          url: `${Urls.rateManager}${managerId}`,
          method: 'PUT',
          // headers: {
          //   token: 'token',
          // },
          body: rateValue,
        };
      },
      transformResponse: (response: RateManagerData) => {
        return response;
      },
    }),
    deleteManager: builder.mutation<RateManagerData, string>({
      query: managerId => {
        return {
          url: `${Urls.deleteManager}${managerId}`,
          method: 'DELETE',
          // headers: {
          //   token: 'token',
          // },
        };
      },
      transformResponse: (response: RateManagerData) => {
        return response;
      },
    }),
    getReportToList: builder.mutation<ReportToResponseList[], ReportToParams>({
      query: body => {
        return {
          url: Urls.reportToLits,
          method: 'POST',
          body: body,
        };
      },
      transformResponse: (response: ReportToResponseData) => {
        return response.data;
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useSetManagerMutation,
  useLazyGetManagersQuery,
  useGetCompanyListQuery,
  useLazyGetManagerDetailQuery,
  useEditManagerMutation,
  useRateManagerMutation,
  useDeleteManagerMutation,
  useGetReportToListMutation,
} = AddManager;
