import {CreateApi} from 'request/CreateApi';
import {Urls} from 'common/utils/ApiConstants';
import {getMarkBodyModal} from 'request/ContactRepository';
import {pageInfo} from 'screens/Contacts';
import {voiceNoteData} from 'screens/VoiceNotes/components/VoiceNotesItem';

interface ContactRepositoryData {
  pageInfo: pageInfo;
  nodes: voiceNoteData[];
}

interface VoiceNotesSharedData {
  pageNo: number;
  searchText: string;
}
export interface VoiceNoteModal {
  success: string;
  message: string;
}
export interface voiceNoteObj {
  title: string;
  link: string;
  timeLength: string;
  buffer: number[];
}
export interface getVoiceModal {
  searchValue: string;
  pageNo: number;
  type: string | null;
}
interface VoiceNoteList {
  success: string;
  message: string;
  data: ContactRepositoryData;
  // errorr?: errorModal[];
}
interface renameVoiceNoteModal {
  voiceNoteId?: string;
  voiceNoteTitle: string;
}

interface shareVoiceNoteModal {
  voicenoteId: string;
  users: (string | number)[];
}

export interface voiceNoteShareResponseModal {
  data: voiceNoteShareData;
  message: string;
  success: boolean;
}

export interface voiceNoteParams {
  documentId: string;
  typeOfAction: string;
  documentCollection: string;
  documentDescription: string;
}

export interface voiceNoteShareData {
  __v: number;
  _id: string;
  addedBy: string;
  buffer: number[];
  createdAt: Date;
  link: string;
  modifiedBy: string;
  status: string;
  timeLength: number;
  timeLengthInSec: number;
  title: string;
  updatedAt: Date;
  userId: string;
  voicenoteSharedWith: string[];
}

export interface VoiceNoteShareResponseData {
  success: boolean;
  message: string;
  data: VoiceNoteShareData;
}

export interface VoiceNoteShareData {
  pageInfo: VoiceNoteSharePageInfo;
  nodes: any[];
}

export interface VoiceNoteSharePageInfo {
  currentPageNo: number;
  lastPageNo: number;
  totalCount: number;
  hasNextPage: boolean;
}

export const VoiceNotes = CreateApi.injectEndpoints({
  endpoints: builder => ({
    addVoiceNote: builder.query<VoiceNoteModal, voiceNoteObj>({
      query: voiceNote => ({
        url: Urls.addVoiceNote,
        method: 'POST',
        // headers: {
        //   token: 'token',
        // },
        body: voiceNote,
      }),
      transformResponse: (response: VoiceNoteModal) => {
        return response;
      },
    }),
    getVoiceNoteList: builder.query<ContactRepositoryData, getVoiceModal>({
      query: ({searchValue, pageNo, type}) => ({
        url: `${Urls.getVoiceNotes}pageNo=${pageNo}&type=${type}&searchValue=${searchValue}`,
        method: 'GET',
        // headers: {
        //   token: 'token',
        // },
      }),
      transformResponse: (response: VoiceNoteList) => {
        return response.data;
      },
    }),
    getSharedWithMeVoiceList: builder.mutation<
      VoiceNoteShareResponseData,
      VoiceNotesSharedData
    >({
      query: pageNo => ({
        url: `${Urls.getVoiceNotesSharedWithMeList}`,
        method: 'POST',
        body: pageNo,
      }),
    }),
    deleteVoiceNote: builder.mutation<VoiceNoteModal, getMarkBodyModal>({
      query: ({contacts}) => ({
        url: Urls.deleteVoiceNote,
        method: 'DELETE',
        // headers: {
        //   token: 'token',
        // },
        body: {voiceNotes: contacts},
      }),
      transformResponse: (response: VoiceNoteModal) => {
        return response;
      },
    }),
    renameVoiceNote: builder.mutation<VoiceNoteModal, renameVoiceNoteModal>({
      query: ({voiceNoteId, voiceNoteTitle}) => ({
        url: `${Urls.renameVoiceNote}${voiceNoteId}`,
        method: 'PUT',
        // headers: {
        //   token: 'token',
        // },
        body: {title: voiceNoteTitle},
      }),
      transformResponse: (response: VoiceNoteModal) => {
        return response;
      },
    }),
    shareVoiceNote: builder.mutation<
      voiceNoteShareResponseModal,
      shareVoiceNoteModal
    >({
      query: voiceNoteObj => ({
        url: `${Urls.shareVoiceNote}`,
        method: 'POST',
        body: voiceNoteObj,
      }),
    }),
    playSharedVoiceNote: builder.mutation<void, voiceNoteParams>({
      query: shareVoiceNoteObj => ({
        url: `${Urls.addAccessLogs}`,
        method: 'POST',
        body: shareVoiceNoteObj,
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useLazyAddVoiceNoteQuery,
  useLazyGetVoiceNoteListQuery,
  useDeleteVoiceNoteMutation,
  useRenameVoiceNoteMutation,
  useShareVoiceNoteMutation,
  useGetSharedWithMeVoiceListMutation,
  usePlaySharedVoiceNoteMutation,
} = VoiceNotes;
