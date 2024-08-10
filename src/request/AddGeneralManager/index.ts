// Need to use the React-specific entry point to import createApi
import {Urls} from 'common/utils/ApiConstants';
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
} from '../AddManager/constant';

interface editGeneralManagerModal {
  generalMangerObj: ManagerModal;
  generalManagerId?: string;
}
const AddGeneralManager = CreateApi.injectEndpoints({
  endpoints: builder => ({
    setGeneralManager: builder.mutation<ManagerData, editGeneralManagerModal>({
      query: ({generalMangerObj}) => {
        return {
          url: Urls.setGM,
          method: 'POST',
          body: generalMangerObj,
        };
      },
      transformResponse: (response: ManagerData) => {
        return response;
      },
    }),
    getGeneralManagers: builder.query<managerListData, getManagerModal>({
      query: ({searchValue, companies, pageNo}) => {
        return {
          url: `${Urls.getGMs}${pageNo}`,
          method: 'POST',
          body: {companies: companies, searchValue: searchValue},
        };
      },
      transformResponse: (response: getManagerData) => {
        return response.data;
      },
    }),
    getGeneralManagerDetail: builder.query<ManagerDetailResponseData, string>({
      query: managerId => ({
        url: `${Urls.getGMDetail}${managerId}`,
        method: 'GET',
      }),
      transformResponse: (response: ManagerDetailResponseData) => {
        return response;
      },
    }),
    editGeneralManager: builder.mutation<ManagerData, editGeneralManagerModal>({
      query: ({generalManagerId, generalMangerObj}) => {
        return {
          url: `${Urls.editGM}${generalManagerId}`,
          method: 'PUT',
          body: generalMangerObj,
        };
      },
      transformResponse: (response: ManagerData) => {
        return response;
      },
    }),
    rateGeneralManager: builder.mutation<RateManagerData, RateManagerModal>({
      query: ({managerId, rateValue}) => {
        return {
          url: `${Urls.rateGM}${managerId}`,
          method: 'PUT',
          body: rateValue,
        };
      },
      transformResponse: (response: RateManagerData) => {
        return response;
      },
    }),
    deleteGeneralManager: builder.mutation<RateManagerData, string>({
      query: managerId => {
        return {
          url: `${Urls.deleteGM}${managerId}`,
          method: 'DELETE',
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
  useSetGeneralManagerMutation,
  useLazyGetGeneralManagersQuery,
  useLazyGetGeneralManagerDetailQuery,
  useDeleteGeneralManagerMutation,
  useRateGeneralManagerMutation,
  useEditGeneralManagerMutation,
} = AddGeneralManager;
