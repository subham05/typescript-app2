export const formatBytes = (bytes: number, decimals = 2) => {
  if (!bytes) {
    return '0 Bytes';
  }

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export const setMessageType = (docResult: any) => {
  if (docResult?.length) {
    const extension = docResult
      .substring(docResult.lastIndexOf('.') + 1)
      .toLowerCase();
    switch (extension) {
      case 'docx':
        return 'doc';
      case 'pdf':
        return 'application/pdf';
      case 'png':
        return 'image/png';
      case 'jpg':
      case 'jpeg':
      case 'heic':
        return 'image/jpeg';
      case 'gif':
        return 'image/gif';
      case 'csv':
        return 'text/csv';
      case 'mp3':
        return 'mp3';
      case 'mp4':
        return 'mp4';
      case 'xls':
      case 'xlsx':
        return 'application/vnd.ms-excel';
      default:
        return 'attachment';
    }
  }
  return 'text/plain';
};
