import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {uploadDocument} from 'common/utils/Amazon-S3';
import {DateTimeFormats} from 'common/utils/DateTimeFormats';
import {showToast} from 'common/utils/ToastMessage';
import {TextView} from 'components';
import Badge from 'components/Badge';
import {Divider} from 'components/Divider';
import FileDocumentUploading from 'components/FileDocumentsUploading';
import {Icon} from 'components/Icon';
import {IconButton} from 'components/IconButtons';
import Loader from 'components/Loader';
import {Persona} from 'components/Persona';
import {Stack, StackItem} from 'components/Stack';
import {TextField} from 'components/TextField';
import moment from 'moment';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Keyboard,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ImageView from 'react-native-image-viewing';
import Modal from 'react-native-modal';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import {
  Comment,
  DeleteCommentBody,
  GetCommentData,
  TaskDetails,
  useAddCommentMutation,
  useDeleteCommentMutation,
  useEditCommentMutation,
  useGetCommentsQuery,
  useLazyGetCommentsQuery,
} from 'request/ManageTask';
import EmojiPicker from 'rn-emoji-keyboard';
import {EmojiType} from 'rn-emoji-keyboard/lib/typescript/types';
import {UploadedFileModal} from 'screens/AddTask';
import {SpeechToText} from 'screens/AddTask/components/SpeechToText';
import {Styles} from '../../index.styles';

interface CommentTaskBodyProps {
  // ref?: any;
  data: any;
  isHideButton?: (value: boolean) => void;
  taskProps?: TaskDetails;
  props: any;
  layoutYAxis: (value: number) => void;
  screenRef: any;
}
export const CommentTaskBody: React.FC<CommentTaskBodyProps> = ({
  screenRef,
  // ref,
  isHideButton,
  taskProps,
  layoutYAxis,
  props,
}) => {
  const {t} = useTranslation();

  const [pageNo, setPageNo] = useState<number>(1);

  const apiObject: GetCommentData = useMemo(() => {
    return {
      taskId: taskProps?._id,
      pageNo: pageNo,
    };
  }, [pageNo, taskProps?._id]);
  // let apiObject: GetCommentData = {
  //   taskId: taskProps?._id,
  //   pageNo: pageNo,
  // };

  const [
    addComment,
    {
      data: addCommentData,
      isLoading: isLoadingAddComment,
      isError: isErrorAddComment,
      isSuccess: isSuccessAddComment,
      error: AddCommentError,
    },
  ] = useAddCommentMutation();

  const [
    editComment,
    {
      data: editCommentData,
      isLoading: isLoadingEditComment,
      isError: isErrorEditComment,
      isSuccess: isSuccessEditComment,
      error: EditCommentError,
    },
  ] = useEditCommentMutation();

  const [
    deleteComment,
    {
      data: DeleteCommentData,
      isLoading: isLoadingDeleteComment,
      isError: isErrorDeleteComment,
      isSuccess: isSuccessDeleteComment,
      error: DeleteCommentError,
    },
  ] = useDeleteCommentMutation();

  const {
    // data: commentsResponse,
    isLoading: commentsResponseLoading,
    isSuccess: isSuccessGetComment,
  } = useGetCommentsQuery(apiObject);

  const [
    trigger,
    {data: commentsLazyResponse, isLoading: commentsLazyResponseLoading},
  ] = useLazyGetCommentsQuery();

  // const {
  //   data: commentsLazyResponse,
  //   isLoading: commentsLazyResponseLoading,
  //   isSuccess: isSuccessGetCommentLazy,
  // } = useLazyGetCommentsQuery();

  const isAllDataLoaded =
    isLoadingAddComment ||
    commentsResponseLoading ||
    isLoadingEditComment ||
    isLoadingDeleteComment ||
    commentsLazyResponseLoading;

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [removedData, setRemovedData] = useState<string[]>([]);
  // let removedData: string[] = [];

  const onSubmit = async () => {
    setIsLoading(true);
    // Keyboard.dismiss();
    if (editCommentId === '') {
      await chooseFile();
      setAddData(true);
      setAddCommentScroll(true);
    } else {
      if (uploadedFiles && uploadedFiles![0].uri) {
        await chooseFile();
        setEditData(true);
      } else {
        setEditData(true);
      }
    }
  };

  const [comment, setComment] = useState<string>('');
  const [deleteCommentId, setDeleteCommentId] = useState<string>('');
  const [deleteCommentAttachments, setDeleteCommentAttachments] = useState<
    string[]
  >([]);

  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  const [openEmojiSelection, setOpenEmojiSelection] = useState<boolean>(false);

  const [isSpeechModalOpen, setIsSpeechModalOpen] = useState(false);

  const [uploadedFiles, setUploadedFiles] = useState<
    UploadedFileModal[] | undefined
  >(undefined);

  const [allUploadedFiles, setAllUploadedFiles] = useState<undefined | unknown>(
    undefined,
  );

  const [stateUpdater, setStateUpdater] = useState<boolean>(false);
  const [addData, setAddData] = useState<boolean>(false);
  const [addCommentScroll, setAddCommentScroll] = useState(false);
  const [editData, setEditData] = useState<boolean>(false);
  const [editCommentId, setEditCommentId] = useState<string>('');

  const [data, setData] = useState<Comment[] | undefined>([]);

  const [indexState, setIndexState] = useState(0);

  const [visible, setIsVisible] = useState<boolean>(false);
  const [imageData, setImageData] = useState<any[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const chooseFile = async () => {
    const docResult = await uploadDocument(
      uploadedFiles,
      `task/${taskProps?._id}/comments/`,
    );
    if (docResult) {
      setAllUploadedFiles(docResult[0]);
    }
  };

  useEffect(() => {
    trigger(apiObject);
  }, [taskProps?._id, trigger, apiObject]);

  useEffect(() => {
    if (addData) {
      let bodyObj = {
        taskId: taskProps?._id,
        comment: comment,
        attachment: uploadedFiles
          ? [
              {
                url: allUploadedFiles,
                // name: uploadedFiles![0]?.name,
                type: uploadedFiles![0]?.type,
              },
            ]
          : [],
        isAttachment: !uploadedFiles ? false : true,
        // date: moment().format(),
        // removedData: removedData,
      };
      addComment(bodyObj);
      setAddData(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    addComment,
    addData,
    // allUploadedFiles,
    comment,
    taskProps?._id,
    // uploadedFiles,
  ]);

  useEffect(() => {
    if (isSuccessAddComment) {
      showToast(addCommentData?.message);
      setComment('');
      setAllUploadedFiles(undefined);
      setUploadedFiles(undefined);
      trigger(apiObject);
    } else if (isErrorAddComment) {
      showToast(JSON.stringify(AddCommentError));
    }
    setIsLoading(false);
  }, [
    AddCommentError,
    addCommentData?.message,
    apiObject,
    isErrorAddComment,
    isSuccessAddComment,
    pageNo,
    taskProps?._id,
    trigger,
  ]);

  // useEffect(() => {
  //   setData(commentsResponse?.record);
  // }, [commentsResponse?.record]);

  useEffect(() => {
    if (commentsLazyResponse?.record.length) {
      if (!isLoadingMore) {
        setData([]);
      }
      setData(prev => prev?.concat(commentsLazyResponse?.record!));
      if (addCommentScroll) {
        screenRef.current.scrollToEnd();
      }
      setAddCommentScroll(false);
    } else {
      setData([]);
    }
    setIsLoadingMore(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commentsLazyResponse]);

  useEffect(() => {
    if (editData) {
      let bodyObj = {
        commentId: editCommentId,
        taskId: taskProps?._id,
        comment: comment,
        attachment: uploadedFiles
          ? [
              {
                url: allUploadedFiles,
                // name: uploadedFiles![0]?.name,
                type: uploadedFiles![0]?.type,
              },
            ]
          : [],
        isAttachment: !uploadedFiles ? false : true,
        // date: moment().format(),
        deletedAttachments: removedData,
      };
      editComment(bodyObj);
      setEditData(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    editComment,
    editData,
    // allUploadedFiles,
    comment,
    taskProps?._id,
    // uploadedFiles,
  ]);

  useEffect(() => {
    if (isSuccessDeleteComment) {
      setComment('');
      showToast(DeleteCommentData?.message);
      setDeleteModal(false);
      let updatedData = [...data!];
      updatedData?.splice(indexState, 1);
      setData(updatedData);
      trigger(apiObject);
      // props.navigation.pop(1);
    } else if (isErrorDeleteComment) {
      showToast(JSON.stringify(DeleteCommentError));
      setDeleteModal(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    DeleteCommentData,
    DeleteCommentError,
    isSuccessDeleteComment,
    isErrorDeleteComment,
    deleteComment,
    // trigger,
    taskProps?._id,
    // pageNo,
    // apiObject,
    indexState,
  ]);

  useEffect(() => {
    if (isSuccessEditComment) {
      showToast(editCommentData?.message);
      setComment('');
      setAllUploadedFiles(undefined);
      setUploadedFiles(undefined);
      setEditCommentId('');
      trigger(apiObject);
    } else if (isErrorEditComment) {
      showToast(JSON.stringify(EditCommentError));
    }
    setIsLoading(false);
  }, [
    EditCommentError,
    apiObject,
    editCommentData?.message,
    isErrorEditComment,
    isSuccessEditComment,
    pageNo,
    taskProps?._id,
    trigger,
  ]);

  // useEffect(() => {
  //   setUploadedFiles(prevState => {
  //     [
  //       prevState,
  //       {
  //         name: item.attachment[0].url.split('attachments')[1],
  //         type: item.attachment[0].type,
  //       },
  //     ];
  //   });
  // }, [editCommentId]);

  useEffect(() => {
    if (data!?.length > 0) {
      data?.map(item => {
        imageData?.push({uri: item?.attachment[0]?.url});
      });
      setImageData(imageData);
    }
  }, [data, imageData]);

  // useEffect(() => {
  //   setRemovedData(removedData);
  // }, [removedData]);

  const scrollRef = useRef<TextInput>(null);

  const styles = Styles();

  return (
    <Stack
      style={styles.commentStack}
      onLayout={e => {
        layoutYAxis(e.nativeEvent.layout.y);
      }}>
      {data?.map((item, index) => {
        // useEffect(() => {}, []);
        return (
          <Stack spacing={16} spaceBelow={10} key={index.toString()}>
            <StackItem childrenGap={10} horizontal>
              <Persona name={'Leslie Alexander'} size={32} />
              <Stack style={[styles.openBox, styles.paddingBox]}>
                <Stack
                  horizontal
                  horizontalAlign="space-between"
                  style={styles.horizontalStack}>
                  <Stack horizontal style={styles.commentHead}>
                    <TextView weight="medium" variant={FontSizes.regular}>
                      {'Leslie Alexander'} {' | '}
                    </TextView>
                    <TextView
                      weight="regular"
                      variant={FontSizes.small}
                      style={styles.position}>
                      Manager
                    </TextView>
                  </Stack>
                  <Stack style={styles.options}>
                    <Menu>
                      <MenuTrigger>
                        <Icon name="more" size={24} color={colors.black} />
                      </MenuTrigger>
                      <MenuOptions optionsContainerStyle={styles.filterWidth}>
                        <MenuOption
                          onSelect={() => {
                            if (Platform.OS === 'android') {
                              Keyboard.dismiss();
                            }
                            setEditCommentId(item._id);
                            setComment(item.comment);
                            if (item.isAttachment) {
                              setUploadedFiles([
                                {
                                  name: decodeURIComponent(
                                    item?.attachment[0]?.url,
                                  )
                                    .split('/')
                                    .pop(),
                                  type: item?.attachment[0]?.type,
                                  uri: item?.attachment[0]?.url,
                                },
                              ]);
                              setAllUploadedFiles(item.attachment[0]?.url);
                            }
                            // scrollRef.current?.focus();
                            screenRef.current.scrollToEnd();
                          }}>
                          <TextView
                            weight="medium"
                            variant={FontSizes.regular}
                            style={styles.menu}>
                            {t('edit')}
                          </TextView>
                        </MenuOption>
                        <Divider />
                        <MenuOption
                          onSelect={() => {
                            setIndexState(index);
                            setDeleteCommentId(item._id);
                            if (
                              item?.attachment[0]?.url?.includes(
                                'https://formanagement.s3.amazonaws.com',
                              )
                            ) {
                              // setDeleteCommentAttachments([]);
                              deleteCommentAttachments.push(
                                item.attachment[0]?.url,
                              );
                              setDeleteCommentAttachments(
                                deleteCommentAttachments,
                              );
                            }
                            // setDeleteCommentAttachments(item.attachment[0].url);
                            setDeleteModal(true);
                          }}>
                          <TextView
                            weight="medium"
                            variant={FontSizes.regular}
                            style={styles.menu}>
                            {t('delete')}
                          </TextView>
                        </MenuOption>
                      </MenuOptions>
                    </Menu>
                  </Stack>
                </Stack>
                <Stack horizontal>
                  {item?.date !==
                    moment().format(DateTimeFormats.YearMonthDay) && (
                    <TextView
                      weight="regular"
                      variant={FontSizes.xSmall}
                      style={styles.dateTime}>
                      {moment(item?.date, DateTimeFormats.YearMonthDay).format(
                        DateTimeFormats.MonthDateYear2,
                      )}
                    </TextView>
                  )}
                  <TextView
                    weight="regular"
                    variant={FontSizes.xSmall}
                    style={styles.dateTime}>
                    {' ' +
                      moment(item?.createdAt).format(DateTimeFormats.TimeAMPM)}
                  </TextView>
                  {/* {index === 2 && (
                      // <StackItem horizontal childrenGap={5}>
                      //   <Stack style={{top: 6, marginLeft: 10}}>
                      //     <Icon name="edit" color={colors.primary_003} />
                      //   </Stack>
                      <TextView
                        weight="regular"
                        variant={FontSizes.xSmall}
                        style={styles.dateTime}>
                        {';  '}
                        {t('taskDetails:edited')}
                      </TextView>
                      // </StackItem>
                    )} */}
                </Stack>
                <TextView
                  weight="regular"
                  variant={FontSizes.regular}
                  style={styles.comment}>
                  {item?.comment}
                </TextView>
              </Stack>
            </StackItem>
            {item?.isAttachment && (
              <TouchableOpacity
                onPress={() => {
                  item?.attachment[0]?.type === 'pdf'
                    ? props.navigation.navigate('ViewPDF', {
                        data: item.attachment[0].url,
                      })
                    : setIsVisible(true);
                }}>
                <StackItem
                  horizontal
                  childrenGap={5}
                  style={styles.commentAttachment}>
                  <Icon name="attachment" size={22} color={colors.primary} />
                  <TextView
                    weight="medium"
                    variant={FontSizes.regular}
                    style={styles.fileName}>
                    {decodeURIComponent(item?.attachment[0]?.url)
                      .split('/')
                      .pop()}
                  </TextView>
                </StackItem>
              </TouchableOpacity>
            )}
            <ImageView
              images={imageData}
              imageIndex={0}
              visible={visible}
              onRequestClose={() => setIsVisible(false)}
            />
          </Stack>
        );
      })}
      {commentsLazyResponse?.pageInfo.hasNextPage && (
        <TouchableOpacity
          style={styles.loadMore}
          onPress={() => {
            setIsLoadingMore(true);
            setPageNo(prevState => prevState + 1);
          }}>
          <TextView
            weight="medium"
            variant={FontSizes.small}
            style={{color: colors.primary_003}}>
            Load more
          </TextView>
        </TouchableOpacity>
      )}
      {!data?.length && isSuccessGetComment ? (
        <Stack center>
          <TextView weight="semibold" variant={FontSizes.regular}>
            No comments found
          </TextView>
        </Stack>
      ) : undefined}
      <Stack style={styles.attachmentView}>
        <Stack horizontal style={styles.attachment}>
          <IconButton
            name="mic"
            size={22}
            color={colors.primary_008}
            style={styles.commentIcon}
            onPress={() => setIsSpeechModalOpen(true)}
          />
          <TextField
            innerRef={scrollRef}
            style={styles.inputComment}
            placeholder={t('taskDetails:addComment')}
            onChangeText={text => setComment(text)}
            value={comment}
            onFocus={() => isHideButton!(true)}
            onBlur={() => isHideButton!(false)}
            maxLength={250}
          />
          {/* <Icon
            name="attach_file"
            size={22}
            color={colors.primary_008}
            style={styles.commentIcon}
          /> */}
          <Stack style={styles.attachFilesIcon}>
            <FileDocumentUploading
              setUploadedFileData={dataItem => {
                const getIdx = uploadedFiles
                  ? uploadedFiles.findIndex(item => {
                      return (
                        item.name === dataItem[0].name &&
                        item.size === dataItem[0].size
                      );
                    })
                  : -1;
                if (getIdx === -1) {
                  const arr = [];
                  arr?.push(dataItem[0]);
                  setUploadedFiles(arr);
                  setStateUpdater(!stateUpdater);
                } else {
                  showToast(`File ${dataItem[0].name} already uploaded.`);
                }
              }}
            />
          </Stack>
          <IconButton
            name="smily"
            size={22}
            color={colors.primary_008}
            style={styles.emojiIcon}
            onPress={() => {
              Keyboard.dismiss();
              setOpenEmojiSelection(true);
            }}
          />
          <TouchableOpacity
            onPress={() => {
              if (comment === '') {
                showToast('Please add comment.');
                Keyboard.dismiss();
              } else {
                setComment('');
                chooseFile();
              }
            }}>
            <IconButton
              name="send"
              size={18}
              color={colors.primary_008}
              style={styles.commentIcon}
              onPress={() => {
                if (Platform.OS === 'ios') {
                  Keyboard.dismiss();
                }
                if (comment === '') {
                  showToast('Please add comment.');
                  Keyboard.dismiss();
                } else {
                  onSubmit();
                }
              }}
              // disabled={comment === ''}
            />
          </TouchableOpacity>
        </Stack>
        <Badge
          uploadedFiles={uploadedFiles}
          onRemove={itmIndex => {
            if (
              uploadedFiles![0].uri!.includes(
                'https://formanagement.s3.amazonaws.com',
              )
            ) {
              let attachmentArr = [];
              attachmentArr.push(uploadedFiles![0].uri!);
              setRemovedData(attachmentArr);
            }
            uploadedFiles?.splice(itmIndex, 1);
            setStateUpdater(!stateUpdater);
            if (!uploadedFiles?.length) {
              setUploadedFiles(undefined);
            }
          }}
        />
      </Stack>
      {deleteModal && (
        <Modal isVisible={deleteModal}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TextView
                weight="bold"
                variant={FontSizes.regular}
                style={styles.shareVia}>
                {t('taskDetails:alertDeleteComment')}
              </TextView>
              <Stack horizontal style={styles.modal}>
                <TextView
                  weight="bold"
                  variant={FontSizes.regular}
                  style={styles.reopenModal}
                  onPress={() => setDeleteModal(false)}>
                  {t('cancel')}
                </TextView>
                <TextView
                  weight="bold"
                  variant={FontSizes.regular}
                  style={styles.reopenModal}
                  onPress={() => {
                    let bodyObj: DeleteCommentBody = {
                      commentId: deleteCommentId,
                      deletedAttachments: deleteCommentAttachments,
                    };
                    deleteComment(bodyObj);
                    setDeleteModal(false);
                  }}>
                  {t('delete')}
                </TextView>
              </Stack>
            </View>
          </View>
        </Modal>
      )}
      {isSpeechModalOpen && (
        <SpeechToText
          close={() => setIsSpeechModalOpen(false)}
          text={text =>
            setComment(comment.length ? comment + ' ' + text : text)
          }
        />
      )}
      <Stack>
        <EmojiPicker
          open={openEmojiSelection}
          onClose={() => setOpenEmojiSelection(false)}
          onEmojiSelected={(emojiObject: EmojiType) => {
            setComment(prev => prev.concat(emojiObject.emoji));
          }}
          enableRecentlyUsed
          categoryPosition="top"
          //containerStyles={{borderRadius: 0}}
          enableSearchBar
        />
      </Stack>
      {(isAllDataLoaded || isLoading) && <Loader />}
    </Stack>
  );
};
