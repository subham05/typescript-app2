import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {FontSizes} from 'common/theme/font';
import {getUploadDocument, uploadDocument} from 'common/utils/Amazon-S3';
import {showToast} from 'common/utils/ToastMessage';
import {Container, TextView} from 'components';
import {PrimaryButton} from 'components/Buttons';
import {FloatingButton} from 'components/FloatingButton';
// import {FloatingButton} from 'components/FloatingButton';
import Header from 'components/Header';
import Loader from 'components/Loader';
// import {MenuModel, PopupMenu} from 'components/PopupMenu';
import {Stack} from 'components/Stack';
import moment from 'moment';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Platform, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {EditTaskModel, useEditTaskCollectionMutation} from 'request/AddTask';
import {
  // MarkCritical,
  // MarkPinned,
  TaskDetails,
  useLazyGetTaskDetailsQuery,
  useMarkCriticalMutation,
  useMarkPinnedMutation,
} from 'request/ManageTask';
import {UploadedFileModal} from 'screens/AddTask';
import {useAppSelector} from 'store/hooks';
import {TaskDetailBottomPanel} from './components/BottomPanel';
import {TaskBody} from './components/TaskBody';
import {TaskFooter} from './components/TaskFooter';
import {TaskHead} from './components/TaskHead';
import {Styles} from './index.styles';

export type TaskDetailsProps = NativeStackScreenProps<
  SignedInStackParamList,
  'TaskDetails'
>;

export const TaskDetailScreen = (props: TaskDetailsProps) => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const {userData} = useAppSelector(state => state.formanagement);

  const [
    editTask,
    {
      data: EditTaskData,
      isLoading: isLoadingEditTask,
      isError: isErrorEditTask,
      isSuccess: isSuccessEditTask,
      error: EditTaskError,
    },
  ] = useEditTaskCollectionMutation();

  // const [scrollLoading, setScrollLoading] = useState(false);

  // useEffect(() => {
  //   if (Platform.OS === 'ios') {
  //     if (translateY.value === 500 && scrollLoading) {
  //       setScrollLoading(false);
  //     }
  //   }
  // }, [translateY.value, scrollLoading]);

  const scrollHandler = useAnimatedScrollHandler(event => {
    // if (Platform.OS === 'ios') {
    //   translateY.value = scrollLoading ? 500 : event.contentOffset.y;
    // } else {
    // }
    translateY.value = event.contentOffset.y;
  });
  const {route} = {...props};

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {taskId, vendors, pending, hideButtons, reallocation, related} = {
    ...route.params,
  };

  const [editData, setEditData] = useState<TaskDetails | undefined>();

  // const {data: taskProps, isLoading: taskPropsLoading} = useGetTaskDetailsQuery(
  //   taskId?._id,
  // );

  const [trigger, {data: taskProps, isLoading: taskPropsLoadingLazy}] =
    useLazyGetTaskDetailsQuery();

  const [deleteLocalPaths, setDeleteLocalPaths] = useState(false);

  useEffect(() => {
    if (taskProps?.title) {
      setEditData(taskProps);
    }
  }, [taskProps]);

  const [
    markCriticalTask,
    {
      data: markCriticalData,
      isSuccess: isSuccessMarkCritical,
      isLoading: isLoadingMarkCritical,
      isError: isErrorMarkCritical,
      error: markCriticalError,
    },
  ] = useMarkCriticalMutation();
  const [
    markPinnedTask,
    {
      data: markPinnedData,
      isSuccess: isSuccessMarkPinned,
      isLoading: isLoadingMarkPinned,
      isError: isErrorMarkPinned,
      error: markPinnedError,
    },
  ] = useMarkPinnedMutation();

  let isAllDataLoaded =
    isLoadingEditTask ||
    taskPropsLoadingLazy ||
    isLoadingMarkPinned ||
    isLoadingMarkCritical;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPanelActive, setIsPanelActive] = useState(false);

  const openPanel = () => {
    setIsPanelActive(true);
  };

  const closePanel = () => {
    setIsPanelActive(false);
  };

  const [isEditable, setIsEditable] = useState<boolean>(false);

  const [markAsCompletedModal, setMarkAsCompletedModal] =
    useState<boolean>(false);

  // const [isKeyboardOpen, setIsKeyboardOpen] = useState<boolean | undefined>();
  const [showButton, setShowButton] = useState<boolean>(false);

  const [uploadedFiles, setUploadedFiles] = useState<
    UploadedFileModal[] | undefined
  >(undefined);

  const [removedData, setRemovedData] = useState<any[]>([]);
  const [isDeleted, setIsDeletedState] = useState(false);
  // const menuData: MenuModel[] = [
  //   // {
  //   //   name: t('manageTask:viewLinkedTask'),
  //   //   onClick: () => {
  //   //     // props.navigation.navigate('LinkedTask');
  //   //   },
  //   // },
  //   // {
  //   //   name: t('taskDetails:taskHistory'),
  //   //   onClick: () => {
  //   //     // props.navigation.navigate('TaskHistory', {taskProps: taskProps});
  //   //   },
  //   // },
  //   {
  //     name: t('taskDetails:pinTask'),
  //     onClick: () => {
  //       let bodyObj: MarkPinned = {
  //         taskId: taskProps?._id,
  //       };
  //       markPinnedTask(bodyObj);
  //     },
  //   },
  //   {
  //     name: t('taskDetails:markAsCritical'),
  //     onClick: () => {
  //       let bodyObj: MarkCritical = {
  //         taskId: taskProps?._id,
  //         isCritical: true,
  //       };
  //       markCriticalTask(bodyObj);
  //     },
  //   },
  // ];
  // const menuDataRelated: MenuModel[] = [
  //   // {
  //   //   name: t('manageTask:viewLinkedTask'),
  //   //   onClick: () => {
  //   //     // props.navigation.navigate('LinkedTask');
  //   //   },
  //   // },
  //   // {
  //   //   name: t('inboxPage:related'),
  //   //   onClick: () => {
  //   //     // props.navigation.navigate('RelatedTask');
  //   //   },
  //   // },
  //   // {
  //   //   name: t('taskDetails:taskHistory'),
  //   //   onClick: () => {
  //   //     // props.navigation.navigate('TaskHistory', {taskProps: taskProps});
  //   //   },
  //   // },
  //   {
  //     name: t('taskDetails:pinTask'),
  //     onClick: () => {
  //       let bodyObj: MarkPinned = {
  //         taskId: taskProps?._id,
  //       };
  //       markPinnedTask(bodyObj);
  //     },
  //   },
  //   {
  //     name: t('taskDetails:markAsCritical'),
  //     onClick: () => {
  //       let bodyObj: MarkCritical = {
  //         taskId: taskProps?._id,
  //         isCritical: true,
  //       };
  //       markCriticalTask(bodyObj);
  //     },
  //   },
  // ];

  // const renderLeftContainer = () => {
  //   return (
  //     <>
  //       {(!vendors &&
  //         // taskProps?.self &&
  //         !reallocation &&
  //         taskProps?.taskStatus === 'In-progress') ||
  //         (taskProps?.type !== '2' && (
  //           //  ||
  //           //   taskProps?.self ||
  //           //   taskProps?.name !== 'Subtask'
  //           <PopupMenu
  //             data={related ? menuData : menuDataRelated}
  //             // height={related ? 206 : 266}
  //             height={110}
  //             width={180}
  //           />
  //         ))}
  //     </>
  //   );
  // };

  useEffect(() => {
    trigger(taskId?._id);
  }, [taskId?._id, trigger]);

  useEffect(() => {
    if (isSuccessEditTask) {
      showToast(EditTaskData?.message);
      setIsEditable(false);
      trigger(taskId?._id);
      // setScrollLoading(true);
    } else if (isErrorEditTask) {
      showToast(JSON.stringify(EditTaskError));
    }
    setIsLoading(false);
  }, [
    EditTaskData,
    EditTaskError,
    isErrorEditTask,
    isSuccessEditTask,
    taskId?._id,
    trigger,
  ]);

  useEffect(() => {
    if (isSuccessMarkCritical) {
      showToast(markCriticalData?.message);
      closePanel();
      // onPressCritical();
    } else if (isErrorMarkCritical) {
      showToast(JSON.stringify(markCriticalError));
      closePanel();
    }
  }, [
    markCriticalData,
    markCriticalError,
    isSuccessMarkCritical,
    isErrorMarkCritical,
    markCriticalTask,
  ]);

  useEffect(() => {
    if (isSuccessMarkPinned) {
      showToast(markPinnedData?.message);
      closePanel();
      // onPressCritical();
    } else if (isErrorMarkPinned) {
      showToast(JSON.stringify(markPinnedError));
      closePanel();
    }
  }, [
    markPinnedData,
    markPinnedError,
    isSuccessMarkPinned,
    isErrorMarkPinned,
    markPinnedTask,
  ]);

  const onSubmit = async () => {
    if (
      editData?.title?.trim()?.length !== 0 &&
      editData?.description?.trim()?.length !== 0 &&
      editData?.parentTaskTitle?.trim()?.length !== 0
    ) {
      setIsLoading(true);
      await chooseFile().then(res => {
        let bodyObj: EditTaskModel = {
          taskId: editData?._id,
          company: editData?.company?._id
            ? editData?.company?._id
            : editData?.company,
          title: editData?.title,
          type: editData?.type,
          description: editData?.description,
          assignTo: editData?.assignTo
            ? editData?.assignTo
            : editData?.assignee._id,
          startDate: editData?.startDate,
          dueDate: editData?.dueDate,
          startTime: editData?.startTime,
          dueTime: editData?.dueTime,
          priority: editData?.priority,
          reportTo: editData?.reportTo
            ? editData?.reportTo
            : editData?.reporter._id,
          relatedTaskName: editData?.relatedTaskName,
          isCritical: editData?.isCritical,
          attachment:
            res.allFiles.filter(item =>
              item.includes('formanagement.s3.amazonaws.com'),
            ) || [],
          deleteVoiceNote: taskProps?.voiceNote?._id,
          // voiceNote: editData?.voiceNote,
          voiceNote: {
            link: res.addVoiceNoteResult || '',
            buffer: res.addVoiceNoteResult ? editData?.voiceNote?.buffer : [],
            timeLength: editData?.voiceNote?.timeLength!,
          },
          deletedAttachments: removedData,
        };
        if (!editData?.relatedTaskName) {
          delete bodyObj.relatedTaskName;
        }
        if (
          !editData?.voiceNote ||
          (taskProps?.voiceNote?._id !== undefined &&
            editData?.voiceNote?._id !== undefined &&
            taskProps?.voiceNote?._id === editData?.voiceNote?._id)
        ) {
          delete bodyObj.voiceNote;
        }
        if (!isDeleted) {
          delete bodyObj.deleteVoiceNote;
        }
        editTask(bodyObj);
        setDeleteLocalPaths(true);
      });
    }
  };

  useEffect(() => {
    setEditData(prev => {
      return {...prev!, attachment: EditTaskData?.data?.attachment};
    });
  }, [EditTaskData]);

  const chooseFile = async () => {
    let docResult = await uploadDocument(
      uploadedFiles,
      `task/media/${moment().format('YYYYMMDDHH')}/`,
    );
    let attachmentData = [...editData?.attachment];
    attachmentData?.map((item, index) => {
      if (!item.includes('formanagement.s3.amazonaws.com')) {
        attachmentData?.splice(index, 1);
      }
    });
    let allFiles = [...attachmentData, ...docResult];
    // docResult.push(...taskProps?.attachment);
    // let addVoiceNoteResult;
    // if (voicePath) {
    //   let date = new Date();
    //   let timeFormat = date.valueOf().toString();
    //   const voiceObj = {
    //     name: `voiceNote_${timeFormat}.mp4`,
    //     type: 'audio/mp4',
    //     uri: voicePath,
    //   };
    //   addVoiceNoteResult = await getUploadDocument(voiceObj, 'voiceNote');
    // }
    allFiles.map((item, index) => {
      if (!item.includes('formanagement.s3.amazonaws.com')) {
        allFiles.splice(index, 1);
      }
    });

    let addVoiceNoteResult;
    if (editData?.voiceNote?.link && !editData?.voiceNote?._id) {
      let date = new Date();
      let timeFormat = date.valueOf().toString();
      const voiceObj = {
        name: `voiceNote_${timeFormat}.mp4`,
        type: 'audio/mp4',
        uri: editData?.voiceNote?.link,
      };
      addVoiceNoteResult = await getUploadDocument(
        voiceObj,
        `voiceNote${moment().format()}`,
      );
    }
    setUploadedFiles(undefined);
    return {allFiles, addVoiceNoteResult};
  };

  // const ref = useRef<KeyboardAwareScrollViewProps & KeyboardAwareState>(null);
  // let scroll: any = null;
  // let scroll;
  // const [scroll, setScroll] = useState();
  const screenScrollRefs = useRef(null);
  const styles = Styles();
  return (
    <Container noSpacing>
      <Header
        navigationType="STACK"
        label={
          isEditable ? t('taskDetails:editTaskDetails') : t('taskDetails:head')
        }
        translateY={translateY}
        // RenderLeftContainer={renderLeftContainer}
        isCloseNavigation={!isEditable}
        preventDefault={isEditable}
        onBackPress={() => setIsEditable(false)}
      />
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        ref={screenScrollRefs}
        keyboardShouldPersistTaps="always">
        <KeyboardAwareScrollView
          enableResetScrollToCoords={false}
          // resetScrollToCoords={{x: 0, y: 5000}}
          // ref={screenScrollRefs}
          // innerRef={ref => {
          //   setScroll(ref);
          // }}
          // extraHeight={50}
          // extraScrollHeight={100}
          bounces={false}
          overScrollMode={'never'}
          // onKeyboardWillShow={() => setIsKeyboardOpen(true)}
          // onKeyboardWillHide={() => {
          //   // scroll?._internalFiberInstanceHandleDEV?.memoizedProps.scrollToEnd();
          //   setIsKeyboardOpen(false);
          // }}
          // enableOnAndroid
          keyboardShouldPersistTaps="always">
          {
            // !isKeyboardOpen && (
            <TaskHead
              taskProps={editData}
              vendors={vendors}
              onPress={val => {
                setIsEditable(val);
              }}
              isEditable={isEditable}
              hideButtons={hideButtons}
              isReallocation={reallocation}
              props={props}
              onEndDaySelect={date => {
                setEditData(prev => ({
                  ...prev!,
                  dueDate: date,
                }));
                // taskProps!.dueDate = moment(date).toISOString();
                // taskProps!.dueTime = moment(date).toISOString();
              }}
              deletedAttachments={taskProps?.attachment}
            />
            // )
          }
          <TaskBody
            deleteLocalPaths={deleteLocalPaths}
            screenRef={screenScrollRefs}
            taskProps={editData}
            isEditable={isEditable}
            isReallocation={reallocation}
            isHideButton={setShowButton}
            props={props}
            // isSelf={taskProps?.self}
            onCompanyChange={value => {
              setEditData(prev => ({...prev!, company: value}));
              // taskProps!.company = value;
            }}
            onAssigneeChange={value => {
              setEditData(prev => ({...prev!, assignTo: value}));
            }}
            onReporterChange={value => {
              setEditData(prev => ({...prev!, reportTo: value}));
            }}
            onTaskChange={values => {
              setEditData(prev => ({
                ...prev!,
                title: values.taskName!,
                description: values.taskDescription!,
              }));

              // setEditData(prev => [
              //   {...prev},
              //   {
              //     title: values.parentTaskName,
              //     description: values.taskDescription,
              //   },
              // ]);
              // taskProps!.parentTaskTitle = values.parentTaskName;
              // taskProps!.relatedTaskName = values.relatedTaskName;
              // taskProps!.title = values.taskName;
              // taskProps!.description = values.taskDescription;
            }}
            onAttachedFile={value => {
              setUploadedFiles(value);
              value?.map(item => {
                setEditData(prev => ({
                  ...prev!,
                  attachment: [
                    ...editData?.attachment,
                    item.uri + '.' + `${item?.name?.split('.').pop()}`,
                  ],
                }));
              });
              setDeleteLocalPaths(false);
            }}
            onRemovedFile={value => {
              setEditData(prev => ({
                ...prev!,
                attachment: value!,
              }));
            }}
            filesRemoved={value => {
              setRemovedData(value);
            }}
            onPriorityChange={value => {
              setEditData(prev => ({
                ...prev!,
                priority: value!,
              }));
              // taskProps!.priority = value;
            }}
            onVoiceRecorded={(val, bufferData, timeMs) =>
              setEditData(prev => ({
                ...prev!,
                voiceNote: {
                  link: val,
                  buffer: bufferData,
                  timeLength: timeMs * 100,
                },
              }))
            }
            isDeleted={value => setIsDeletedState(value)}
          />
          {
            // !isKeyboardOpen &&
            isEditable && !hideButtons && (
              <Stack
                spacing={16}
                spaceBelow={Platform.OS === 'android' ? 16 : 56}>
                <PrimaryButton
                  title={t('saveChanges')}
                  onPress={() => {
                    if (
                      // taskProps!.parentTaskTitle.length !== 0 ||
                      editData!.title.length !== 0 &&
                      // taskProps!.relatedTaskName.length !== 0 ||
                      editData!.description.length !== 0
                    ) {
                      onSubmit();
                    }
                    // setIsEditable(false);
                  }}
                />
              </Stack>
            )
          }
        </KeyboardAwareScrollView>
      </Animated.ScrollView>
      {taskProps?.taskStatus !== 'Completed' &&
        // taskProps?.taskStatus !== 'Resolve' &&
        !isEditable && (
          // userData?._id === taskProps?.assignee?._id &&
          <Stack style={styles.floatingButton}>
            <FloatingButton
              name="add_floating"
              onPress={() => {
                openPanel();
              }}
            />
          </Stack>
        )}

      {isPanelActive && (
        <TaskDetailBottomPanel
          panelState={isPanelActive}
          onPressClose={() => closePanel()}
          props={props}
          taskProps={taskProps}
          onPressCritical={() => {
            trigger(taskId?._id);
          }}
        />
      )}
      {taskProps?.taskStatus === 'Assigned' &&
        // !taskProps?.self &&
        !isEditable &&
        // !vendors &&
        // !hideButtons &&
        // reallocation &&
        // !showButton &&
        userData?._id === taskProps?.assignee?._id && (
          <TaskFooter
            taskProps={taskProps}
            onAcceptTask={() => {
              trigger(taskId?._id);
            }}
            onRejectTask={() => {
              trigger(taskId?._id);
            }}
          />
        )}
      {taskProps?.taskStatus === 'Resolve' &&
        // !taskProps?.self &&
        !isEditable &&
        // pending &&
        !vendors &&
        !hideButtons &&
        !showButton &&
        userData?._id === taskProps?.assignee?._id && (
          <TaskFooter
            taskProps={taskProps}
            onAcceptTask={() => {
              trigger(taskId?._id);
            }}
            onRejectTask={() => {
              trigger(taskId?._id);
            }}
          />
        )}
      {
        // taskProps?.self &&
        !pending && !isEditable && !vendors && !hideButtons && !showButton && (
          <Stack spacing={16} spaceBelow={16}>
            {taskProps?.taskStatus !== 'Assigned' &&
              userData?._id === taskProps?.assignee?._id && (
                // taskProps?.self &&
                <PrimaryButton
                  disabled={
                    taskProps?.taskStatus === 'Resolve' &&
                    userData?._id === taskProps?.assignee?._id
                      ? false
                      : true
                  }
                  title={t('taskDetails:markAsCompleted')}
                  onPress={() => {
                    setMarkAsCompletedModal(true);
                  }}
                />
              )}
          </Stack>
        )
      }
      {/* {
        // taskProps?.self &&
        !pending && !isEditable && !vendors && !hideButtons && !showButton && (
          <Stack spacing={16} spaceBelow={16}>
            {taskProps?.taskStatus !== 'Completed' && (
              // !taskProps?.self &&
              <PrimaryButton
                disabled={taskProps?.taskStatus === 'Resolved' ? false : true}
                title={t('taskDetails:markAsCompleted')}
                onPress={() => {
                  setMarkAsCompletedModal(true);
                }}
              />
            )}
          </Stack>
        )
      } */}
      {markAsCompletedModal && (
        <Modal isVisible={markAsCompletedModal}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TextView
                weight="bold"
                variant={FontSizes.regular}
                style={styles.shareVia}>
                {t('taskDetails:alertMarkAsCompleted')}
              </TextView>
              <Stack horizontal style={styles.modal}>
                <TextView
                  weight="bold"
                  variant={FontSizes.regular}
                  style={styles.reopenModal}
                  onPress={() => setMarkAsCompletedModal(false)}>
                  {t('cancel')}
                </TextView>
                <TextView
                  weight="bold"
                  variant={FontSizes.regular}
                  style={styles.reopenModal}
                  onPress={() => {
                    setMarkAsCompletedModal(false);
                  }}>
                  {t('yes')}
                </TextView>
              </Stack>
            </View>
          </View>
        </Modal>
      )}
      {(isLoading || isAllDataLoaded) && <Loader />}
    </Container>
  );
};
