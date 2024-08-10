import {
  ACCESS_KEY_ID,
  BUCKET_NAME,
  REGION,
  SECRET_ACCESS_KEY,
  URL_PREFIX,
} from '@env';
import {RNS3} from 'react-native-aws3';
import {UploadedFileModal} from 'screens/AddTask';

export const getUploadDocument = async (
  selectedDocument: any,
  folderName: string,
) => {
  const options = {
    keyPrefix: `${URL_PREFIX}${folderName}`,
    bucket: BUCKET_NAME,
    region: REGION,
    accessKey: ACCESS_KEY_ID,
    secretKey: SECRET_ACCESS_KEY,
    successActionStatus: 201,
  };
  return new Promise(resolve => {
    RNS3.put(selectedDocument, options).then(response => {
      if (response.status !== 201) {
        resolve(null);
        throw new Error('Failed to upload image');
      } else {
        resolve(response.headers.Location);
      }
    });
  });
};

export const uploadDocument = async (
  documentList: UploadedFileModal[] = [],
  folderName: string,
) =>
  await Promise.all(
    documentList.map(item => getUploadDocument(item, folderName)),
  );
