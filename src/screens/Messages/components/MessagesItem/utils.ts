import {t} from 'i18next';
import {chatModal} from 'request/Message/constants';

export const getLastMessageType = (item: chatModal) => {
  if (item?.lastMessage?.isDeleted) {
    return t('messagePage:messageDeleted');
  } else if (!item?.lastMessage?.isAttachment && item?.lastMessage?.message) {
    return item?.lastMessage?.message;
  } else if (item?.lastMessage?.isAttachment) {
    switch (item.lastMessage.messageType) {
      case 'image/png':
      case 'image/jpeg':
        return 'Image';
      case 'image/gif':
        return 'GIF';
      case 'mp4':
        return 'Video';
      case 'mp3':
        return 'Audio';
      case 'application/pdf':
        return 'PDF';
      case 'doc':
      case 'csv':
        return 'Document';
      default:
        return 'Attachment';
    }
  }
  return 'You can start your conversation.';
};
