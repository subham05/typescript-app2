import {Urls} from 'common/utils/ApiConstants';
import {GetAllInviteeBody, InviteeUserDataCollection} from 'request/Calendar';
import {CreateApi} from 'request/CreateApi';
// import {manageTaskCollection} from 'screens/Manage/types';

interface getDocumentRespCollection {
  data: getDocDataCollection;
  message: string;
  success: boolean;
}
interface createDocumentRespCollection {
  data: docInterface;
  message: string;
  success: boolean;
}
interface getDocDataCollection {
  nodes: docInterface[];
  pageInfo: {
    currentPageNo: number;
    lastPageNo: number;
    totalCount: number;
    hasNextPage: boolean;
  };
}
export type docInterface = {
  _id: string;
  companyId: string;
  title: string;
  description: string;
  isAttachment: boolean;
  documentSharedWith: any[];
  addedBy: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  size?: string;
  date: string;
  time: string;
  userName?: string;
};
export interface createDocQueryBody {
  companyId: string | undefined | string[];
  title: string;
  description: string;
  isAttachment: boolean;
  size?: string;
  attachment?: {
    url: string;
    type: string;
  };
  deletedAttachments?: {
    url: string;
    type: string;
  };
}
interface getDocBody {
  searchText: string;
  pageNo: number;
}
export interface Attachment {
  url: any;
  type: string;
}
export interface Data {
  attachment: Attachment;
  _id: string;
  companyId: CompanyId[];
  title: string;
  description: string;
  size: string;
  isAttachment: boolean;
  documentSharedWith: any[];
  addedBy: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface CompanyId {
  _id: string;
  name: string;
}
export interface RootObject {
  success: boolean;
  message: string;
  data: Data;
}
export interface documentRepoResponseData {
  success: boolean;
  message: string;
  data: {
    text: string;
  };
}
export interface documentRepoData {
  imageUrl: string | undefined | unknown;
}
interface shareDocObjProp {
  documentId: string;
  users: (string | number)[];
}
export interface shareDocumentDataCollection {
  success: boolean;
  message: string;
}
interface editDocument {
  docId?: string;
  docObj: createDocQueryBody;
}
// interface getDocumentRespCollection {}

const CreateDocumentCollection = CreateApi.injectEndpoints({
  endpoints: builder => ({
    createDocument: builder.mutation<
      createDocumentRespCollection,
      editDocument
    >({
      query: ({docObj}) => {
        return {
          url: 'document/add',
          method: 'POST',
          body: docObj,
        };
      },
      // invalidatesTags: ['DocumentRepo'],
    }),
    getSingleDocument: builder.query<RootObject, string>({
      query: id => ({
        url: `document/view/${id}`,
        method: 'GET',
      }),
    }),
    getDocument: builder.mutation<getDocumentRespCollection, getDocBody>({
      query: body => ({
        url: 'document/list',
        method: 'POST',
        body,
      }),
      // providesTags: ['DocumentRepo'],
    }),

    getDocumentData: builder.mutation<
      documentRepoResponseData,
      documentRepoData
    >({
      query: imageUrl => {
        return {
          url: 'document/ocr',
          method: 'POST',
          body: imageUrl,
        };
      },
    }),
    getDocumentInviteeList: builder.mutation<
      InviteeUserDataCollection,
      GetAllInviteeBody
    >({
      query: body => ({
        url: Urls.getDocInvitee,
        method: 'POST',
        body: body,
      }),
    }),
    shareDocument: builder.mutation<
      shareDocumentDataCollection,
      shareDocObjProp
    >({
      query: body => ({
        url: Urls.shareDocument,
        method: 'POST',
        body: body,
      }),
    }),
    getShareWithMeDocuments: builder.mutation<
      getDocumentRespCollection,
      getDocBody
    >({
      query: body => ({
        url: Urls.docShareWithMe,
        method: 'POST',
        body,
      }),
    }),
    editDocument: builder.mutation<createDocumentRespCollection, editDocument>({
      query: ({docId, docObj}) => {
        return {
          url: `${Urls.editDocument}${docId}`,
          method: 'PUT',
          body: docObj,
        };
      },
    }),
  }),
});

export const {
  useCreateDocumentMutation,
  useGetDocumentMutation,
  // useGetDocumentQuery,
  // useLazyGetDocumentQuery,
  useLazyGetSingleDocumentQuery,
  useGetDocumentDataMutation,
  useGetDocumentInviteeListMutation,
  useShareDocumentMutation,
  useGetShareWithMeDocumentsMutation,
  useEditDocumentMutation,
} = CreateDocumentCollection;
