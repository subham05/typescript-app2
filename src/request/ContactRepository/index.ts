// Need to use the React-specific entry point to import createApi
import {Urls} from 'common/utils/ApiConstants';
import {Contact} from 'react-native-contacts';
import {GetAllInviteeBody, InviteeUserDataCollection} from 'request/Calendar';
import {CreateApi} from 'request/CreateApi';
import {
  ContactModal,
  ContactModalSort,
  FilterRoleData,
  filterRolePrivateModal,
  pageInfo,
} from 'screens/Contacts';
import {
  ContactFormModel,
  RequestToDataRepo,
  shareContactData,
  shareDetailRepoData,
} from 'screens/CreateContact/types';

export interface ContactRepositoryData {
  pageInfo: pageInfo;
  nodes: ContactModal[] | ContactModalSort[] | shareContactData[];
}
interface errorModal {
  value: string;
  msg: string;
  param: string;
  location: string;
}
export interface errorType {
  data: {error: errorModal[]};
}
interface getContactBody {
  searchValue: string;
  pageNo: number;
}
export interface MarkPrivateOrPublicModal {
  acknowledged: boolean;
  modifiedCount: number;
  upsertedId: null | string;
  upsertedCount: number;
  matchedCount: number;
  message?: string;
}
export interface ContactRepository {
  success: string;
  message: string;
  data: ContactRepositoryData;
  // errorr?: errorModal[];
}
export interface MarkPrivateOrPublic {
  success: string;
  message: string;
  data?: MarkPrivateOrPublicModal;
}
export interface getContactModal {
  searchValue: string;
  pageNo: number;
  contactType: string | null;
  isSortingEnabled?: boolean;
  sortBy?: string;
  companyId?: string;
}
export interface getMarkBodyModal {
  contactType?: string | null;
  contacts: string[];
}
export interface editContactModal {
  contactObj: ContactFormModel;
  contactId: string | undefined;
}
export interface filterRequestModal {
  companies: string[];
  filterRole: string;
  pageNo: number;
  searchValue: string;
}
interface filteredData {
  success: string;
  message: string;
  data: FilterRoleData;
}
interface shareContactModal {
  contactId: string[];
  users: (string | number)[];
}
interface requestContactListModal {
  companyId: string[];
  searchText: string;
}
interface requestContactModal {
  companyId: string;
  requestTo: string[];
  contactType: string;
  contactNeeded: string;
}
// Define a service using a base URL and expected endpoints
export const ContactRepository = CreateApi.injectEndpoints({
  endpoints: builder => ({
    setContactList: builder.mutation<ContactRepository, Contact[]>({
      query: contacts => {
        return {
          url: Urls.setContactList,
          method: 'POST',
          body: {contacts: contacts?.length > 0 ? contacts : null},
        };
      },
      transformResponse: (response: ContactRepository) => {
        return response;
      },
    }),
    getPublicContactList: builder.query<ContactRepositoryData, getContactModal>(
      {
        query: ({
          searchValue,
          pageNo,
          contactType,
          isSortingEnabled,
          sortBy,
          companyId,
        }) => {
          return {
            url: `${
              Urls.getPublicContactList
            }pageNo=${pageNo}&contactType=${contactType}&isSortingEnabled=${isSortingEnabled}&sortBy=${sortBy}&searchValue=${searchValue}${
              companyId ? `&companyIdFilter=${companyId}` : ''
            }`,
            method: 'GET',
          };
        },

        transformResponse: (response: ContactRepository) => {
          return response.data;
        },
      },
    ),
    getPrivateContactList: builder.query<
      ContactRepositoryData,
      getContactModal
    >({
      query: ({searchValue, pageNo, contactType, isSortingEnabled, sortBy}) => {
        return {
          url: `${Urls.getPrivateContactList}pageNo=${pageNo}&contactType=${contactType}&isSortingEnabled=${isSortingEnabled}&sortBy=${sortBy}&searchValue=${searchValue}`,
          method: 'GET',
          // headers: {
          //   token: 'token',
          // },
        };
      },
      transformResponse: (response: ContactRepository) => {
        return response.data;
      },
    }),
    markContactAsPrivateOrPublic: builder.query<
      MarkPrivateOrPublic,
      getMarkBodyModal
    >({
      query: ({contactType, contacts}) => {
        return {
          url: `${Urls.markContactAsPRIVATEOrPUBLIC}${contactType}`,
          method: 'PUT',
          // headers: {
          //   token: 'token',
          // },
          body: {contacts: contacts},
        };
      },
      transformResponse: (response: MarkPrivateOrPublic) => {
        return response;
      },
    }),
    addNewContact: builder.query<MarkPrivateOrPublic, ContactFormModel>({
      query: contactObj => {
        return {
          url: `${Urls.addContact}`,
          method: 'POST',
          // headers: {
          //   token: 'token',
          // },
          body: contactObj,
        };
      },
      transformResponse: (response: MarkPrivateOrPublic) => {
        return response;
      },
    }),

    editContact: builder.query<MarkPrivateOrPublic, editContactModal>({
      query: ({contactObj, contactId}) => {
        return {
          url: `${Urls.editContact}${contactId}`,
          method: 'PUT',
          // headers: {
          //   token: 'token',
          // },
          body: contactObj,
        };
      },
      transformResponse: (response: MarkPrivateOrPublic) => {
        return response;
      },
    }),
    deleteContact: builder.query<MarkPrivateOrPublic, getMarkBodyModal>({
      query: ({contacts}) => {
        return {
          url: `${Urls.deleteContact}`,
          method: 'DELETE',
          // headers: {
          //   token: 'token',
          // },
          body: {contacts: contacts},
        };
      },
      transformResponse: (response: MarkPrivateOrPublic) => {
        return response;
      },
    }),
    getRoleContacts: builder.mutation<filteredData, filterRequestModal>({
      query: body => {
        return {
          url: Urls.getFilterContact,
          method: 'POST',
          body: body,
        };
      },
    }),
    getRolePrivateList: builder.mutation<filteredData, filterRolePrivateModal>({
      query: body => {
        return {
          url: Urls.getRolePrivate,
          method: 'POST',
          body: body,
        };
      },
    }),
    shareContact: builder.mutation<MarkPrivateOrPublic, shareContactModal>({
      query: body => ({
        url: Urls.shareContact,
        method: 'POST',
        body: body,
      }),
    }),
    getContactInviteeList: builder.mutation<
      InviteeUserDataCollection,
      GetAllInviteeBody
    >({
      query: body => ({
        url: Urls.getcontactInviteeList,
        method: 'POST',
        body: body,
      }),
    }),
    getShareWithMeContacts: builder.mutation<
      ContactRepositoryData,
      getContactBody
    >({
      query: body => ({
        url: Urls.shareWithMeContact,
        method: 'POST',
        body,
      }),
      transformResponse: (response: ContactRepository) => {
        return response.data;
      },
    }),
    getShareWithMeDetail: builder.query<shareDetailRepoData, string>({
      query: contactId => {
        return {url: `${Urls.shareWithMeDetail}${contactId}`, method: 'GET'};
      },
    }),
    getRequestContactList: builder.mutation<
      RequestToDataRepo,
      requestContactListModal
    >({
      query: body => ({
        url: Urls.requestToList,
        method: 'POST',
        body,
      }),
    }),
    requestContact: builder.mutation<MarkPrivateOrPublic, requestContactModal>({
      query: body => ({
        url: Urls.requestContact,
        method: 'POST',
        body,
      }),
    }),
    getRoleSharedList: builder.mutation<filteredData, filterRolePrivateModal>({
      query: body => {
        return {
          url: Urls.getRoleShared,
          method: 'POST',
          body: body,
        };
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useSetContactListMutation,
  useLazyGetPublicContactListQuery,
  useLazyGetPrivateContactListQuery,
  useLazyMarkContactAsPrivateOrPublicQuery,
  useLazyAddNewContactQuery,
  // useAddNewContactMutation,
  useLazyEditContactQuery,
  useLazyDeleteContactQuery,
  useGetRoleContactsMutation,
  useGetRolePrivateListMutation,
  useShareContactMutation,
  useGetContactInviteeListMutation,
  useGetShareWithMeContactsMutation,
  useLazyGetShareWithMeDetailQuery,
  useGetRequestContactListMutation,
  useRequestContactMutation,
  useGetRoleSharedListMutation,
} = ContactRepository;
