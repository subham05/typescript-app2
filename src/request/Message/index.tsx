import {Urls} from 'common/utils/ApiConstants';
import {CreateApi} from 'request/CreateApi';
import {getDocBody} from 'request/Renewals';
import {pageInfo} from 'screens/Contacts';
import {
  addGroupMemberModal,
  chatAddModal,
  chatDetailData,
  chatDetailModal,
  chatListModal,
  chatListRepo,
  deleteMessageModal,
  deleteMessageRepo,
  groupChatAddModal,
  groupChatListModal,
  groupDeleteIconModal,
  groupImageEditModal,
  groupImageUpdateResp,
  groupInfoModal,
  groupInfoResp,
  groupInviteList,
  groupNameEditModal,
  groupTaskAddBody,
  groupTaskRes,
  messageListModal,
  removeGroupMemberModal,
  sendMessageModal,
  sendMsgResponse,
} from './constants';

export interface chatInviteeModal {
  _id: string;
  name: string;
  profileUrl: string;
  createdAt: string;
  updatedAt: string;
  role: string;
  chatId: string;
  selectedMemberList: chatInviteeModal[];
}

interface chatInviteeData {
  pageInfo: pageInfo;
  nodes: chatInviteeModal[];
}
interface chatInviteeRepo {
  success: boolean;
  message: string;
  data: chatInviteeData;
}
interface groupChatListRepo {
  success: boolean;
  message: string;
  data: chatInviteeData;
}

const messageCollection = CreateApi.injectEndpoints({
  endpoints: builder => ({
    getChatInvitee: builder.mutation<chatInviteeRepo, getDocBody>({
      query: body => {
        return {
          url: Urls.chatInvitee,
          method: 'POST',
          body: body,
        };
      },
    }),
    ChatAdd: builder.mutation<any, chatAddModal>({
      query: body => {
        return {
          url: Urls.chatAdd,
          method: 'POST',
          body: body,
        };
      },
    }),
    chatList: builder.mutation<chatListRepo, chatListModal>({
      query: body => {
        return {
          url: Urls.chatList,
          method: 'POST',
          body: body,
        };
      },
    }),
    messageList: builder.mutation<chatListRepo, messageListModal>({
      query: body => {
        return {
          url: Urls.messageList,
          method: 'POST',
          body: body,
        };
      },
    }),
    groupMessageList: builder.mutation<chatListRepo, messageListModal>({
      query: body => {
        return {
          url: Urls.groupMessageList,
          method: 'POST',
          body: body,
        };
      },
    }),
    sendMessage: builder.mutation<sendMsgResponse, sendMessageModal>({
      query: body => {
        return {
          url: Urls.sendMessage,
          method: 'POST',
          body: body,
        };
      },
    }),
    groupChatAdd: builder.mutation<any, groupChatAddModal>({
      query: body => {
        return {
          url: Urls.groupChatAdd,
          method: 'POST',
          body: body,
        };
      },
    }),
    groupchatList: builder.mutation<groupChatListRepo, groupChatListModal>({
      query: body => {
        return {
          url: Urls.groupChatList,
          method: 'POST',
          body: body,
        };
      },
    }),
    deleteMessage: builder.mutation<deleteMessageRepo, deleteMessageModal>({
      query: data => {
        return {
          url: `${Urls.deleteMessage}/${data.chatId}`,
          method: 'PUT',
          body: data.body,
        };
      },
    }),
    getGroupInfo: builder.mutation<groupInfoResp, groupInfoModal>({
      query: data => {
        return {
          url: Urls.groupInfo,
          method: 'POST',
          body: data,
        };
      },
    }),
    groupInviteList: builder.mutation<groupInviteList, groupInfoModal>({
      query: data => {
        return {
          url: Urls.inviteList,
          method: 'POST',
          body: data,
        };
      },
    }),
    addGroupMember: builder.mutation<deleteMessageRepo, addGroupMemberModal>({
      query: data => {
        return {
          url: `${Urls.addMember}/${data.groupId}`,
          method: 'PUT',
          body: data.body,
        };
      },
    }),
    removeMember: builder.mutation<deleteMessageRepo, removeGroupMemberModal>({
      query: data => {
        return {
          url: `${Urls.removeMember}/${data.groupId}`,
          method: 'PUT',
          body: data.body,
        };
      },
    }),
    deleteGroupIcon: builder.mutation<groupInfoResp, groupDeleteIconModal>({
      query: ({groupId}) => {
        return {
          url: `${Urls.deleteGroupIcon}/${groupId}`,
          method: 'DELETE',
        };
      },
    }),
    chatDetails: builder.mutation<chatDetailData, chatDetailModal>({
      query: body => {
        return {
          url: Urls.chatDetails,
          method: 'POST',
          body: body,
        };
      },
    }),
    addGroupName: builder.mutation<void, groupNameEditModal>({
      query: ({groupId, body}) => {
        return {
          url: `${Urls.updateGroupName}/${groupId}`,
          method: 'PUT',
          body,
        };
      },
    }),
    editGroupImage: builder.mutation<groupImageUpdateResp, groupImageEditModal>(
      {
        query: ({groupId, body}) => {
          return {
            url: `${Urls.updateGroupImage}/${groupId}`,
            method: 'PUT',
            body,
          };
        },
      },
    ),
    createGrpFromTask: builder.mutation<groupTaskRes, groupTaskAddBody>({
      query: body => {
        return {
          url: Urls.groupTaskAdd,
          method: 'POST',
          body: body,
        };
      },
    }),
  }),
});

export const {
  useGetChatInviteeMutation,
  useChatAddMutation,
  useChatListMutation,
  useMessageListMutation,
  useGroupMessageListMutation,
  useSendMessageMutation,
  useGroupChatAddMutation,
  useGroupchatListMutation,
  useDeleteMessageMutation,
  useGetGroupInfoMutation,
  useGroupInviteListMutation,
  useAddGroupMemberMutation,
  useRemoveMemberMutation,
  useDeleteGroupIconMutation,
  useChatDetailsMutation,
  useAddGroupNameMutation,
  useEditGroupImageMutation,
  useCreateGrpFromTaskMutation,
} = messageCollection;
