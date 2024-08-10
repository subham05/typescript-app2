// Need to use the React-specific entry point to import createApi
import {Urls} from 'common/utils/ApiConstants';
import {
  getManagerData,
  getManagerModal,
  ManagerData,
  ManagerDetailResponseData,
  managerListData,
  ManagerModal,
  RateManagerData,
} from 'request/AddManager/constant';
import {CreateApi} from 'request/CreateApi';
interface editOwnerModal {
  ownerObj: ManagerModal;
  ownerId?: string;
}
const AddOwner = CreateApi.injectEndpoints({
  endpoints: builder => ({
    setOwner: builder.mutation<ManagerData, editOwnerModal>({
      query: ({ownerObj}) => {
        return {
          url: Urls.setOwner,
          method: 'POST',
          body: ownerObj,
        };
      },
      transformResponse: (response: ManagerData) => {
        return response;
      },
    }),
    getOwners: builder.query<managerListData, getManagerModal>({
      query: ({searchValue, companies, pageNo}) => {
        return {
          url: `${Urls.getOwners}${pageNo}`,
          method: 'POST',
          body: {companies: companies, searchValue: searchValue},
        };
      },
      transformResponse: (response: getManagerData) => {
        return response.data;
      },
    }),
    getOwnerDetail: builder.query<ManagerDetailResponseData, string>({
      query: ownerId => ({
        url: `${Urls.getOwnerDetail}${ownerId}`,
        method: 'GET',
      }),
      transformResponse: (response: ManagerDetailResponseData) => {
        return response;
      },
    }),
    editOwner: builder.mutation<ManagerData, editOwnerModal>({
      query: ({ownerId, ownerObj}) => {
        return {
          url: `${Urls.editOwner}${ownerId}`,
          method: 'PUT',
          body: ownerObj,
        };
      },
      transformResponse: (response: ManagerData) => {
        return response;
      },
    }),
    deleteOwner: builder.mutation<RateManagerData, string>({
      query: ownerId => {
        return {
          url: `${Urls.deleteOwner}${ownerId}`,
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
  useSetOwnerMutation,
  useLazyGetOwnersQuery,
  useLazyGetOwnerDetailQuery,
  useEditOwnerMutation,
  useDeleteOwnerMutation,
} = AddOwner;
