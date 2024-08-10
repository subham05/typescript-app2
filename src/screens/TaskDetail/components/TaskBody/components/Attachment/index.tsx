import {imageSources} from 'assets/images';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {showToast} from 'common/utils/ToastMessage';
import {previewXlsx} from 'common/utils/XlsDownload';
import {TextView} from 'components';
import FileDocumentUploading from 'components/FileDocumentsUploading';
import {Icon} from 'components/Icon';
import {IconButton} from 'components/IconButtons';
import React, {useEffect, useState} from 'react';
import {FlatList, Image, ScrollView} from 'react-native';
import ImageView from 'react-native-image-viewing';
import {ImageSource} from 'react-native-image-viewing/dist/@types';
import {TaskDetails} from 'request/ManageTask';
import {UploadedFileModal} from 'screens/AddTask';
import {Stack} from 'stack-container';
import {Styles} from '../../index.styles';

interface AttachmentTaskBodyProps {
  attachments: any[];
  isEditable?: boolean;
  props: any;
  onAttachedFile: (values?: UploadedFileModal[]) => void;
  onRemovedFile: (data?: any[]) => void;
  filesRemoved: (data: any[]) => void;
  deleteLocalPaths: boolean;
  taskProps: TaskDetails | undefined;
}
export const AttachmentTaskBody: React.FC<AttachmentTaskBodyProps> = ({
  isEditable,
  props,
  onAttachedFile,
  onRemovedFile,
  attachments,
  filesRemoved,
  deleteLocalPaths,
  taskProps,
}) => {
  const [data, setData] = useState<any[]>([]);
  const [removedData] = useState<any[]>([]);
  const [imageData, setImageData] = useState<ImageSource[]>([]);
  const [visible, setIsVisible] = useState<boolean>(false);
  const [imageIndex, setImageIndex] = useState<number>(0);

  const [uploadedFiles, setUploadedFiles] = useState<
    UploadedFileModal[] | undefined
  >(undefined);

  const [stateUpdater, setStateUpdater] = useState<boolean>(false);

  useEffect(() => {
    setImageData([]);
  }, [isEditable]);

  useEffect(() => {
    // setUploadedFiles([]);
    setData(attachments);
    if (attachments?.length > 0 && attachments?.length === data?.length) {
      attachments?.map(item => {
        imageData?.push({uri: item.url});
      });
      setImageData(imageData);
    }
  }, [attachments, data, imageData, deleteLocalPaths]);

  useEffect(() => {
    if (deleteLocalPaths) {
      setUploadedFiles([]);
    }
  }, [deleteLocalPaths]);

  const handlePress = async (
    index: number,
    item: string,
    isPng: boolean,
    isXls: boolean,
  ) => {
    setImageIndex(index);
    if (isPng) {
      setIsVisible(true);
    } else if (isXls) {
      previewXlsx(item);
    } else {
      props.navigation.navigate('ViewPDF', {
        data: item,
      });
    }
  };

  // useEffect(() => {
  //   setImageData([]);
  //   setData([]);
  //   if (attachments?.length > 0) {
  //     attachments?.map(item => {
  //       setImageData(prev => [...prev, {uri: item.url}]);
  //       setData(prev => [...prev, item.url]);
  //       // imageData?.push({uri: item.url});
  //       // data.push(item.url);
  //     });
  //     // setImageData(imageData);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [attachments]);

  const styles = Styles();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.openBox}>
      <Stack horizontal childrenGap={16} verticalAlign="center">
        {isEditable && taskProps?.taskStatus === 'Assigned' && (
          <Stack style={styles.uploadFiles}>
            <FileDocumentUploading
              icon={'add_subtask'}
              setUploadedFileData={dataItem => {
                if (data?.length! < 10 || data?.length! === undefined) {
                  const getIdx = uploadedFiles
                    ? uploadedFiles.findIndex(item => {
                        return (
                          item.name === dataItem[0].name &&
                          item.size === dataItem[0].size
                        );
                      })
                    : -1;

                  const {uri, size, name, type} = dataItem[0];
                  let fileDataObject = {
                    uri,
                    size,
                    name,
                    type,
                  };
                  if (getIdx === -1) {
                    const arr = uploadedFiles || [];
                    arr?.push(fileDataObject);
                    setUploadedFiles(arr);
                    setStateUpdater(!stateUpdater);
                    onAttachedFile(arr);
                    let files = [`attachments${fileDataObject?.name}`, ...data];
                    setData(files);
                  } else {
                    showToast(`File ${fileDataObject?.name} already uploaded.`);
                  }
                } else {
                  showToast('You cannot add more than 10 files.');
                }
              }}
            />
          </Stack>
        )}
        <FlatList
          key={Math.random()}
          numColumns={Math.round(data?.length / 2)}
          data={data}
          renderItem={({item, index}) => {
            let isPng =
              item?.url?.split('.').pop().toLowerCase() === 'png' ||
              item?.url?.split('.').pop().toLowerCase() === 'jpg' ||
              item?.url?.split('.').pop().toLowerCase() === 'jpeg' ||
              item?.url?.split('.').pop().toLowerCase() === 'heic';
            let isXls =
              item?.url?.split('.').pop().toLowerCase() === 'xls' ||
              item?.url?.split('.').pop().toLowerCase() === 'xlsx';
            return (
              <Stack
                horizontal
                style={styles.attachmentView}
                key={index.toString()}>
                <Stack horizontal style={{backgroundColor: colors.grey_009}}>
                  <Stack horizontal style={styles.attachment}>
                    {isPng ? (
                      <Icon
                        name="photo_gallary"
                        size={18}
                        style={styles.attachmentIcon}
                        color={colors.black}
                      />
                    ) : isXls ? (
                      <Image
                        source={imageSources.excelFile}
                        style={styles.pdfIcon}
                      />
                    ) : (
                      <Image
                        source={imageSources.pdfFile}
                        style={styles.pdfIcon}
                      />
                    )}
                    <TextView
                      weight="regular"
                      variant={FontSizes.regular}
                      style={styles.attachmentName}
                      truncate>
                      {item.type?.includes('image')
                        ? item.taskFileExt!
                          ? `image.${item.taskFileExt!}`
                          : `image.${decodeURIComponent(item.taskFileName!)
                              .split('.')
                              .pop()}`
                        : item.type?.includes('excel')
                        ? item.taskFileExt!
                          ? `file.${item.taskFileExt!}`
                          : `file.${decodeURIComponent(item.taskFileName!)
                              .split('.')
                              .pop()}`
                        : item.taskFileExt!
                        ? `image.${item.taskFileExt!}`
                        : `file.${decodeURIComponent(item.taskFileName!)
                            .split('.')
                            .pop()}`}
                    </TextView>
                  </Stack>
                  {!isEditable ? (
                    <IconButton
                      name="visibility"
                      size={18}
                      color={colors.black}
                      style={styles.downloadIcon}
                      onPress={() =>
                        handlePress(index, item?.url, isPng, isXls)
                      }
                    />
                  ) : (
                    <IconButton
                      name="close"
                      size={18}
                      color={colors.black}
                      style={styles.downloadIcon}
                      onPress={() => {
                        // setRemovedData(prev => [prev, item]);
                        uploadedFiles?.splice(index, 1);
                        setStateUpdater(!stateUpdater);
                        if (item.url.includes('http')) {
                          removedData?.push(item);
                        }
                        let arr = [...data];
                        arr.splice(index, 1);
                        setData(arr);
                        onRemovedFile(arr);
                        filesRemoved(removedData!);
                      }}
                    />
                  )}
                </Stack>
                <ImageView
                  keyExtractor={(_, indexKey) => indexKey.toString()}
                  images={imageData}
                  imageIndex={imageIndex}
                  visible={visible}
                  onRequestClose={() => setIsVisible(false)}
                />
              </Stack>
            );
          }}
          keyExtractor={(_, index) => index.toString()}
          ListEmptyComponent={
            <Stack
              center
              style={isEditable ? styles.noData : styles.dataNotFound}>
              <TextView variant={FontSizes.regular} weight={'medium'}>
                No attachments found
              </TextView>
            </Stack>
          }
          style={styles.flatList}
        />
      </Stack>
    </ScrollView>
  );
};
