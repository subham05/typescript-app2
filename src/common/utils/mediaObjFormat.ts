import {UploadedFileModal} from 'screens/AddTask';

export const mediaObjFormat = (
  uploadedFiles: UploadedFileModal[] | undefined,
  res: any,
  isMessage?: boolean,
) => {
  let attachmentObj: FormattedAttachmentModal[] = [];
  uploadedFiles?.map((item, index) => {
    if (item.isUploaded) {
      attachmentObj.push(item);
    } else {
      if (isMessage) {
        attachmentObj?.push({
          url: res?.[index],
          type: item.type!,
          messageFileName: item.name!,
          messageFileExt: decodeURIComponent(item.name!).split('.').pop()!,
        });
      } else {
        attachmentObj?.push({
          url: res?.[index],
          type: item.type!,
          taskFileName: item.name!,
          taskFileExt: decodeURIComponent(item.name!).split('.').pop()!,
        });
      }
    }
  });
  return attachmentObj;
};

export interface FormattedAttachmentModal {
  url: string;
  type: string;
  taskFileName?: string;
  taskFileExt?: string;
  messageFileName?: string;
  messageFileExt?: string;
}
