// Need to use the React-specific entry point to import createApi
import {Urls} from 'common/utils/ApiConstants';
import {RateManagerData, RateManagerModal} from 'request/AddManager/constant';
import {CreateApi} from 'request/CreateApi';
import {
  AddPAData,
  deletePAData,
  editPAModal,
  getPAData,
  getPAModal,
  PADetailData,
  PAListData,
} from './types';

const PersonalAssistant = CreateApi.injectEndpoints({
  endpoints: builder => ({
    addPersonalAssistant: builder.mutation<AddPAData, editPAModal>({
      query: ({PAObj}) => {
        return {
          url: Urls.addPA,
          method: 'POST',
          body: PAObj,
        };
      },
      transformResponse: (response: AddPAData) => {
        return response;
      },
    }),
    getPAList: builder.query<PAListData, getPAModal>({
      query: ({searchValue, companies, pageNo}) => {
        return {
          url: `${Urls.getPA}${pageNo}`,
          method: 'POST',
          body: {companies: companies, searchValue: searchValue},
        };
      },
      transformResponse: (response: getPAData) => {
        return response.data;
      },
    }),
    getPADetail: builder.query<PADetailData, string>({
      query: paId => ({
        url: `${Urls.getPADetails}${paId}`,
        method: 'GET',
      }),
      transformResponse: (response: PADetailData) => {
        return response;
      },
    }),
    editPA: builder.mutation<AddPAData, editPAModal>({
      query: ({PAId, PAObj}) => {
        return {
          url: `${Urls.editPA}${PAId}`,
          method: 'PUT',
          body: PAObj,
        };
      },
      transformResponse: (response: AddPAData) => {
        return response;
      },
    }),
    deletePA: builder.mutation<deletePAData, string>({
      query: PAId => {
        return {
          url: `${Urls.deletePA}${PAId}`,
          method: 'DELETE',
        };
      },
      transformResponse: (response: deletePAData) => {
        return response;
      },
    }),
    ratePersonalAssistant: builder.mutation<RateManagerData, RateManagerModal>({
      query: ({managerId, rateValue}) => {
        return {
          url: `${Urls.ratePA}${managerId}`,
          method: 'PUT',
          body: rateValue,
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
  useAddPersonalAssistantMutation,
  useLazyGetPAListQuery,
  useLazyGetPADetailQuery,
  useEditPAMutation,
  useDeletePAMutation,
  useRatePersonalAssistantMutation,
} = PersonalAssistant;
