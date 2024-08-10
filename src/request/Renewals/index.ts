import {CreateApi} from 'request/CreateApi';
// import {manageTaskCollection} from 'screens/Manage/types';

interface getDocumentRespCollection {
  data: getDocDataCollection;
  message: string;
  success: boolean;
}

interface createDocumentRespCollection {
  data: renewalInterface;
  message: string;
  success: boolean;
}

interface getDocDataCollection {
  nodes: renewalInterface[];
  pageInfo: {
    currentPageNo: number;
    lastPageNo: number;
    totalCount: number;
    hasNextPage: boolean;
  };
}

export type renewalInterface = {
  _id: string;
  companyId: string;
  name: string;
  registrationDate: string;
  title?: string;
  isNotExpiry: boolean;
  expiryDate: string;
  attachment: Attachment[];
  addedBy: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  formattedDate: string;
};

export interface createRenewalQueryBody {
  companyId: string;
  name: string;
  documentCategory: string;
  title?: string;
  isNotExpiry: boolean;
  registrationDate: string;
  expiryDate: string;
  attachment?: [
    {
      url?: string | null;
      type?: string;
    },
  ];
}

export interface editRenewalQueryBody {
  id: string;
  data: createRenewalQueryBody;
}

export interface getDocBody {
  searchText: string;
  pageNo: number;
}

export interface Attachment {
  url: string;
  type: string;
  _id: string;
}

export interface RenewalsData {
  _id: string;
  companyId: CompanyDetails;
  name: string;
  documentCategory: string;
  title?: string;
  isNotExpiry: boolean;
  registrationDate: string;
  expiryDate: string;
  attachment: Attachment[];
  addedBy: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

interface CompanyDetails {
  _id: string;
  name: string;
}

export interface RootObject {
  success: boolean;
  message: string;
  data: RenewalsData;
}

// interface getDocumentRespCollection {}

const CreateRenewalCollection = CreateApi.injectEndpoints({
  endpoints: builder => ({
    createRenewal: builder.mutation<
      createDocumentRespCollection,
      createRenewalQueryBody
    >({
      query: body => {
        return {
          url: 'renewal/add',
          method: 'POST',
          headers: {
            token: 'token',
          },
          body,
        };
      },
      // invalidatesTags: ['DocumentRepo'],
    }),
    editRenewal: builder.mutation<
      createDocumentRespCollection,
      editRenewalQueryBody
    >({
      query: body => {
        return {
          url: `renewal/edit/${body.id}`,
          method: 'PUT',
          // headers: {
          //   token: 'token',
          // },
          body: body.data,
        };
      },
      // invalidatesTags: ['DocumentRepo'],
    }),
    getSingleRenewal: builder.query<RootObject, string>({
      query: id => ({
        url: `renewal/view/${id}`,
        // headers: {
        //   token: 'token',
        // },
        method: 'GET',
      }),
    }),
    getRenewal: builder.mutation<getDocumentRespCollection, getDocBody>({
      query: body => ({
        url: 'renewal/list',
        method: 'POST',
        // headers: {
        //   token: 'token',
        // },
        body,
      }),
      // providesTags: ['DocumentRepo'],
    }),
  }),
});

export const {
  useCreateRenewalMutation,
  useEditRenewalMutation,
  useGetRenewalMutation,
  // useGetRenewalQuery,
  // useLazyGetRenewalQuery,
  useLazyGetSingleRenewalQuery,
} = CreateRenewalCollection;
