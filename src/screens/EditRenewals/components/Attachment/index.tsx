import {imageSources} from 'assets/images';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {showToast} from 'common/utils/ToastMessage';
import {TextView} from 'components';
import FileDocumentUploading from 'components/FileDocumentsUploading';
import {Icon} from 'components/Icon';
import {IconButton} from 'components/IconButtons';
import React, {useEffect, useState} from 'react';
import {FlatList, Image, ScrollView} from 'react-native';
import {ImageSource} from 'react-native-image-viewing/dist/@types';
import {UploadedFileModal} from 'screens/AddTask';
import {Stack} from 'stack-container';
import {Styles} from '../../index.styles';

interface AttachmentEditRenewalsProps {
  attachments: any[];
  //props: any;
  onAttachedFile: (values?: UploadedFileModal[]) => void;
  onRemovedFile: (data?: any[]) => void;
  filesRemoved: (data: any[]) => void;
}
export const AttachmentEditRenewals: React.FC<AttachmentEditRenewalsProps> = ({
  attachments,
  onAttachedFile,
  onRemovedFile,
  filesRemoved,
}) => {
  const [attachmentData, setAttachmentData] = useState<any[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [removedData] = useState<any[]>([]);

  const [imageData, setImageData] = useState<ImageSource[]>([]);

  const [uploadedFiles, setUploadedFiles] = useState<
    UploadedFileModal[] | undefined
  >(undefined);

  const [stateUpdater, setStateUpdater] = useState<boolean>(false);

  useEffect(() => {
    if (attachments?.length > 0) {
      console.log('the new attachment-->', data);
      console.log('the attach-->', attachmentData);
      console.log('from parent-->', attachments);

      setImageData([]);
      setData([]);
      setAttachmentData([]);
      attachments?.map(item => {
        console.log('the item-->', item);
        setImageData(prev => [...prev, {uri: item.url}]);
        setData(prev => [...prev, item]);
        setAttachmentData(prev => [...prev, item]);
        // imageData?.push({uri: item.url});
        // data.push(item.url);
      });
      // setImageData(imageData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attachments]);

  // useEffect(() => {
  //   console.log('the data-->', data);
  //   attachmentData?.map(item => {
  //     setImageData(prev => [...prev, {uri: item.url}]);
  //     setData(prev => [...prev, item.url]);
  //     setAttachmentData(prev => [...prev, item]);
  //     // imageData?.push({uri: item.url});
  //     // data.push(item.url);
  //   });
  // }, [data]);

  const styles = Styles();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.openBox}>
      <Stack horizontal childrenGap={16} verticalAlign="center">
        <Stack style={styles.uploadFiles}>
          <FileDocumentUploading
            icon={'add_subtask'}
            setUploadedFileData={dataItem => {
              if (data?.length! < 2 || data?.length! === undefined) {
                const getIdx = uploadedFiles
                  ? uploadedFiles.findIndex(item => {
                      return (
                        item.name === dataItem[0].name &&
                        item.size === dataItem[0].size
                      );
                    })
                  : -1;
                if (getIdx === -1) {
                  const arr = uploadedFiles || [];
                  arr?.push(dataItem[0]);
                  console.log('the arrr-->', arr);
                  setUploadedFiles(arr);
                  setStateUpdater(!stateUpdater);
                  onAttachedFile(arr);
                  let files = [dataItem[0], ...data];
                  setData(files);
                  setAttachmentData(files);
                } else {
                  showToast(`File ${dataItem[0].name} already uploaded.`);
                }
              } else {
                showToast('You cannot add more than 2 file.');
              }
            }}
          />
        </Stack>
        <FlatList
          key={Math.random()}
          // horizontal
          numColumns={Math.round(data.length / 2)}
          data={data}
          renderItem={({item, index}) => {
            let isPng = item?.url
              ? item?.url?.split('.').pop().toLowerCase() === 'png' ||
                item?.url?.split('.').pop().toLowerCase() === 'jpg' ||
                item?.url?.split('.').pop().toLowerCase() === 'jpeg' ||
                item?.url?.split('.').pop().toLowerCase() === 'heic'
              : item?.name?.split('.').pop().toLowerCase() === 'png' ||
                item?.name?.split('.').pop().toLowerCase() === 'jpg' ||
                item?.name?.split('.').pop().toLowerCase() === 'jpeg' ||
                item?.name?.split('.').pop().toLowerCase() === 'heic';
            let isXls =
              item?.url?.split('.').pop()?.toLowerCase() === 'xls' ||
              item?.url?.split('.').pop()?.toLowerCase() === 'xlsx';
            return (
              <Stack
                horizontal
                style={styles.attachmentView}
                key={index.toString()}>
                <Stack horizontal style={styles.singleAttachment}>
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
                      {/* {decodeURIComponent(item).split('/').pop()} */}
                      {item.type?.includes('image')
                        ? item.renewalsFileExt!
                          ? `image.${item.renewalsFileExt!}`
                          : `image.${decodeURIComponent(
                              item.renewalsFileName! || item?.name!,
                            )
                              .split('.')
                              .pop()}`
                        : item.type?.includes('excel')
                        ? item.renewalsFileExt!
                          ? `file.${item.renewalsFileExt!}`
                          : `file.${decodeURIComponent(item.renewalsFileName!)
                              .split('.')
                              .pop()}`
                        : item.renewalsFileExt!
                        ? `file.${item.renewalsFileExt!}`
                        : `file.${decodeURIComponent(
                            item.renewalsFileName! || item?.name!,
                          )
                            .split('.')
                            .pop()}`}
                    </TextView>
                  </Stack>
                  <IconButton
                    name="close"
                    size={18}
                    color={colors.black}
                    style={styles.downloadIcon}
                    onPress={() => {
                      // setRemovedData(prev => [prev, item]);
                      uploadedFiles?.splice(index, 1);
                      setStateUpdater(!stateUpdater);
                      if (item?.url?.includes('http')) {
                        removedData?.push(item);
                      }
                      let arr = [...data];
                      console.log('the arr-->', arr);
                      arr.splice(index, 1);
                      console.log('🚀  file: index.tsx  line 144 ~ arr', arr);
                      let imgArr = [...imageData];
                      imgArr.splice(index, 1);
                      let attachArr = [...attachmentData];
                      console.log('attachArr-->', attachArr);
                      attachArr.splice(index, 1);
                      console.log('AFter splice-->', attachArr);
                      onAttachedFile(arr);
                      setData(arr);
                      setImageData(imgArr);
                      setAttachmentData(attachArr);
                      onRemovedFile(attachArr);
                      filesRemoved(removedData!);
                    }}
                  />
                </Stack>
              </Stack>
            );
          }}
          keyExtractor={(_, index) => index.toString()}
          ListEmptyComponent={
            <Stack center style={styles.noData}>
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
