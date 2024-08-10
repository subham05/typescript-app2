import FileViewer from 'react-native-file-viewer';
import RNFS from 'react-native-fs';

export const getUrlExtension = (url: string) => {
  return url.split('.').pop();
};

export const previewXlsx = (fromUrl: string) => {
  const extension = getUrlExtension(fromUrl);
  const toFile = `${RNFS.DocumentDirectoryPath}/File.${extension}`;

  const options = {
    fromUrl,
    toFile,
  };
  RNFS.downloadFile(options).promise.then(() => {
    FileViewer.open(toFile);
  });
};
