import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {getUploadDocument, uploadDocument} from 'common/utils/Amazon-S3';
import {showToast} from 'common/utils/ToastMessage';
import {Container, TextView} from 'components';
import {PrimaryButton} from 'components/Buttons';
import {FloatingButton} from 'components/FloatingButton';
import Header from 'components/Header';
import Loader from 'components/Loader';
import {MenuModel, PopupMenu} from 'components/PopupMenu';
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
  ChangeStatusBody,
  ReassignParams,
  TaskDetails,
  useAssignTaskMutation,
  useCompleteTaskMutation,
  useLazyGetTaskDetailsQuery,
  useMarkCriticalMutation,
  useMarkPinnedMutation,
  useReassignTaskMutation,
} from 'request/ManageTask';
import {UploadedFileModal} from 'screens/AddTask';
import {useAppSelector} from 'store/hooks';
import {TaskDetailBottomPanel} from './components/BottomPanel';
import {TaskBody} from './components/TaskBody';
import {TaskFooter} from './components/TaskFooter';
import {TaskHead} from './components/TaskHead';
import {Styles} from './index.styles';
import Netinfo from '@react-native-community/netinfo';

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

  const [
    editSubTask,
    {
      data: EditSubTaskData,
      isLoading: isLoadingEditSubTask,
      isError: isErrorEditSubTask,
      isSuccess: isSuccessEditSubTask,
      error: EditSubTaskError,
    },
  ] = useEditTaskCollectionMutation();

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });
  const {route} = {...props};
  const {
    taskId,
    vendors,
    // pending,
    hideButtons,
    reallocation,
    // related,
    fromNotifee,
    linkedSubTask,
    parentId,
    parentTaskId,
  } = {
    ...route.params,
  };
  const [editData, setEditData] = useState<TaskDetails | undefined>();

  const [trigger, {data: taskProps, isLoading: taskPropsLoadingLazy}] =
    useLazyGetTaskDetailsQuery();

  const [deleteLocalPaths, setDeleteLocalPaths] = useState(false);
  const [isRecordingVoiceNote, setIsRecordingVoiceNote] = useState(false);
  const [isReAssigneeChange, setIsReAssigneeChange] = useState(false);

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

  const [
    assignTask,
    {
      isLoading: isLoadingAssignTask,
      isError: isErrorAssignTask,
      isSuccess: isSuccessAssignTask,
      error: AssignTaskError,
      data: AssignTaskData,
    },
  ] = useAssignTaskMutation();

  const [
    completeTask,
    {
      isLoading: isLoadingCompleteTask,
      isError: isErrorCompleteTask,
      isSuccess: isSuccessCompleteTask,
      error: CompleteTaskError,
      data: CompleteTaskData,
    },
  ] = useCompleteTaskMutation();

  const [
    reAssignTask,
    {
      isLoading: isLoadingReAssignTask,
      isError: isErrorReAssignTask,
      isSuccess: isSuccessReAssignTask,
      error: ReAssignTaskError,
      data: ReAssignTaskData,
    },
  ] = useReassignTaskMutation();

  useEffect(() => {
    if (isSuccessReAssignTask) {
      showToast(ReAssignTaskData?.message);
      setIsReAssigneeChange(false);
      callApiwithTaskId();
    } else if (isErrorReAssignTask) {
      showToast(JSON.stringify(ReAssignTaskError));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    ReAssignTaskData?.message,
    ReAssignTaskError,
    isErrorReAssignTask,
    isSuccessReAssignTask,
  ]);

  let isAllDataLoaded =
    isLoadingEditTask ||
    taskPropsLoadingLazy ||
    isLoadingMarkPinned ||
    isLoadingMarkCritical ||
    isLoadingAssignTask ||
    isLoadingEditSubTask ||
    isLoadingCompleteTask ||
    isLoadingReAssignTask;

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showButton, setShowButton] = useState<boolean>(false);

  const [uploadedFiles, setUploadedFiles] = useState<
    UploadedFileModal[] | undefined
  >(undefined);

  const [removedData, setRemovedData] = useState<any[]>([]);
  const [isDeleted, setIsDeletedState] = useState(false);
  const menuData: MenuModel[] = [
    {
      name: t('manageTask:viewLinkedTask'),
      onClick: () => {
        props.navigation.navigate('LinkedTask', {
          taskProps: taskProps,
          parentId: taskId?.taskId,
        });
      },
    },
    {
      name: t('taskDetails:taskHistory'),
      onClick: () => {
        props.navigation.navigate('TaskHistory', {taskProps: taskProps});
      },
    },
    // {
    //   name: t('taskDetails:pinTask'),
    //   onClick: () => {
    //     let bodyObj: MarkPinned = {
    //       taskId: taskProps?._id,
    //     };
    //     markPinnedTask(bodyObj);
    //   },
    // },
    // {
    //   name: t('taskDetails:markAsCritical'),
    //   onClick: () => {
    //     let bodyObj: MarkCritical = {
    //       taskId: taskProps?._id,
    //       isCritical: true,
    //     };
    //     markCriticalTask(bodyObj);
    //   },
    // },
  ];

  const renderLeftContainer = () => {
    return (
      <>
        {(!vendors &&
          !reallocation &&
          taskProps?.taskStatus === 'In-progress') ||
          (taskProps?.type !== 'Subtask' && (
            <PopupMenu
              // data={related ? menuData : menuDataRelated}
              data={menuData}
              // height={related ? 206 : 266}
              // height={110}
              // width={180}
              height={100}
              width={180}
            />
          ))}
      </>
    );
  };

  useEffect(() => {
    if (taskId?._id) {
      trigger(taskId?._id);
    } else {
      trigger(route?.params?.taskProps?.taskId);
    }
  }, [taskId?._id, trigger, fromNotifee, route?.params?.taskProps?.taskId]);

  useEffect(() => {
    if (isSuccessEditTask) {
      showToast(EditTaskData?.message);
      setIsEditable(false);
      callApiwithTaskId();
      // setScrollLoading(true);
    }
    if (isErrorEditTask) {
      if (EditTaskError?.data?.error) {
        showToast(EditTaskError?.data?.error[0]?.msg);
      }
    }

    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [EditTaskData, EditTaskError, isErrorEditTask, isSuccessEditTask]);

  useEffect(() => {
    if (isSuccessEditSubTask) {
      showToast(EditSubTaskData?.message);
      setIsEditable(false);
      callApiwithTaskId();
      // setScrollLoading(true);
    }
    if (isErrorEditSubTask) {
      if (EditSubTaskError?.data?.error) {
        showToast(EditSubTaskError?.data?.error[0]?.msg);
      }
    }

    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    EditSubTaskData?.message,
    EditSubTaskError?.data?.error,
    isErrorEditSubTask,
    isSuccessEditSubTask,
  ]);

  useEffect(() => {
    if (isSuccessMarkCritical) {
      showToast(markCriticalData?.message);
      closePanel();
      // onPressCritical();
    } else if (isErrorMarkCritical) {
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
      closePanel();
    }
  }, [
    markPinnedData,
    markPinnedError,
    isSuccessMarkPinned,
    isErrorMarkPinned,
    markPinnedTask,
  ]);

  useEffect(() => {
    if (isSuccessAssignTask) {
      showToast(AssignTaskData?.message);
      props.navigation.goBack();
    } else if (isErrorAssignTask) {
      showToast(JSON.stringify(AssignTaskError));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    AssignTaskData?.message,
    AssignTaskError,
    isErrorAssignTask,
    isSuccessAssignTask,
  ]);

  useEffect(() => {
    if (isSuccessCompleteTask) {
      showToast(CompleteTaskData?.message);
      callApiwithTaskId();
      setMarkAsCompletedModal(false);
    } else if (isErrorCompleteTask) {
      showToast(JSON.stringify(CompleteTaskError));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    CompleteTaskData?.message,
    CompleteTaskError,
    isErrorCompleteTask,
    isSuccessCompleteTask,
  ]);

  const onSubmit = async () => {
    if (
      editData?.title?.trim()?.length !== 0 &&
      editData?.description?.trim()?.length !== 0
    ) {
      setIsLoading(true);
      chooseFile()
        .then(res => {
          let bodyObj: EditTaskModel = {
            taskId: editData?._id,
            company: editData?.company?._id
              ? editData?.company?._id
              : editData?.company,
            title: editData?.title,
            type: editData?.type,
            description: editData?.description,
            assignTo: editData?.assignTo
              ? editData.assignTo
              : editData?.assignee?._id,
            startDate: editData?.startDate,
            dueDate: editData?.dueDate,
            startTime: editData?.startTime,
            dueTime: editData?.dueTime,
            priority: editData?.priority,
            reportTo: userData?._id,
            relatedTaskName: editData?.relatedTaskName?._id,
            isCritical: editData?.isCritical,
            // attachment:
            //   res?.allFiles?.filter(item =>
            //     item.url.includes('formanagement.s3.amazonaws.com'),
            //   ) || [],
            attachment: res?.allFiles || [],
            deleteVoiceNote: taskProps?.voiceNote?._id,
            // voiceNote: editData?.voiceNote,
            voiceNote: {
              link: res?.addVoiceNoteResult || '',
              buffer: res?.addVoiceNoteResult
                ? editData?.voiceNote?.buffer
                : [],
              timeLength: editData?.voiceNote?.timeLength!,
            },
            deletedAttachments: removedData,
            startDateObject: editData?.startDateObject,
            dueDateObject: editData?.dueDateObject,
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

          if (editData?.moduleType === 'SUBTASK') {
            bodyObj.parentTask = {
              id: editData?._id,
              taskNumber: parentId,
            };
            bodyObj.moduleType = 'SUBTASK';

            editSubTask(bodyObj);
          } else {
            editTask(bodyObj);
          }
          setDeleteLocalPaths(true);
        })
        .catch(error => {
          console.log('🚀 ~ file: index.tsx:392 ~ chooseFile ~ error:', error);
          return {};
        });
    }
  };

  useEffect(() => {
    setEditData(prev => {
      return {...prev!, attachment: EditTaskData?.data?.attachment};
    });
  }, [EditTaskData]);

  // const chooseFile = async () => {
  //   let docResult;
  //   let addVoiceNoteResult;
  //   await Netinfo.fetch().then(async state => {
  //     if (state.isConnected) {
  //       let tempArray: UploadedFileModal[] = [];
  //       uploadedFiles?.map(file =>
  //         file.uri?.includes('https://formanagement.s3.amazonaws')
  //           ? null
  //           : tempArray.push(file),
  //       );
  //       docResult = await uploadDocument(
  //         tempArray,
  //         `task/media/${moment().format('YYYYMMDDHH')}/`,
  //       );
  //     } else {
  //       showToast(t('noNetwork'));
  //       setIsLoading(false);
  //     }
  //   });
  //   return {docResult, addVoiceNoteResult};
  // };

  const chooseFile = async () => {
    let addVoiceNoteResult;
    let allFiles: any[];
    await Netinfo.fetch().then(async state => {
      if (state.isConnected) {
        let docResult = await uploadDocument(
          uploadedFiles,
          `task/media/${moment().format('YYYYMMDDHH')}/`,
        );
        let attachmentData = [...editData?.attachment];
        let attachedObj: any[] = [];
        let counter = 0;
        attachmentData?.map(item => {
          if (!item.url.includes('formanagement.s3.amazonaws.com')) {
            attachedObj.push({
              url: docResult?.[counter],
              type: item.type,
              taskFileName: item.taskFileName,
              taskFileExt: item.taskFileExt,
            });
            counter++;
          }
        });
        attachmentData?.map((item, index) => {
          if (!item.url.includes('formanagement.s3.amazonaws.com')) {
            attachmentData?.splice(index, 1);
          }
        });
        allFiles = [...attachmentData, ...attachedObj];
        // allFiles = [...attachmentData, ...docResult];

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
          if (!item.url.includes('formanagement.s3.amazonaws.com')) {
            allFiles.splice(index, 1);
          }
        });

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
        // return {allFiles, addVoiceNoteResult};
      } else {
        showToast(t('noNetwork'));
        setIsLoading(false);
      }
    });
    return {allFiles, addVoiceNoteResult};
  };

  // const ref = useRef<KeyboardAwareScrollViewProps & KeyboardAwareState>(null);
  // let scroll: any = null;
  // let scroll;
  // const [scroll, setScroll] = useState();
  const closeWithoutSaving = () => {
    if (taskProps?.title && isEditable) {
      setEditData(taskProps);
    }
    setIsEditable(false);
  };
  const callApiwithTaskId = () => {
    if (taskId?._id) {
      trigger(taskId?._id);
    } else {
      trigger(route?.params?.taskProps?.taskId);
    }
  };
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
        RenderLeftContainer={renderLeftContainer}
        isCloseNavigation={!isEditable}
        preventDefault={isEditable}
        onBackPress={closeWithoutSaving}
      />
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        ref={screenScrollRefs}
        keyboardShouldPersistTaps="always">
        <KeyboardAwareScrollView
          // enableResetScrollToCoords={false}
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
          // keyboardShouldPersistTaps="always"
        >
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
              onEndDaySelect={(date, value) => {
                setEditData(prev => ({
                  ...prev!,
                  dueDate: date!,
                  dueDateObject: value!,
                }));
                // taskProps!.dueDate = moment(date).toISOString();
                // taskProps!.dueTime = moment(date).toISOString();
              }}
              deletedAttachments={taskProps?.attachment}
              onStartTask={() => {
                callApiwithTaskId();
                // trigger(taskId?._id);
              }}
              linkedSubTask={linkedSubTask}
              parentId={parentTaskId}
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
              setEditData(prev => ({
                ...prev!,
                company: value,
                assignTo: '',
                reportTo: '',
                assignee: {_id: '', name: '', designation: ''},
              }));
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
                // setEditData(prev => ({
                //   ...prev!,
                //   attachment: [
                //     ...editData?.attachment,
                //     item.uri + '.' + `${item?.name?.split('.').pop()}`,
                //   ],
                // }));
                setEditData(prev => ({
                  ...prev!,
                  attachment: [
                    ...editData?.attachment,
                    {
                      taskFileExt: decodeURIComponent(item.name!)
                        .split('.')
                        .pop(),
                      taskFileName: item.name!,
                      type: item.type,
                      url: item.uri,
                    },
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
            recordingVoiceNote={setIsRecordingVoiceNote}
            linkedSubTask={linkedSubTask}
            onRelatedTaskChange={value => {
              setEditData(prev => ({
                ...prev!,
                relatedTaskName: {
                  _id: value._id,
                  title: value.title,
                },
              }));
            }}
            onReAssigneeChange={value => {
              if (value?.length) {
                setEditData(prev => ({...prev!, reassignTo: value}));
                setIsReAssigneeChange(true);
              } else {
                setIsReAssigneeChange(false);
              }
            }}
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
                    if (taskProps?.taskStatus === 'Rejected') {
                      let bodyObj: ChangeStatusBody = {
                        taskId: taskProps?._id,
                        assignTo: editData?.assignTo
                          ? editData?.assignTo
                          : editData?.assignee._id,
                      };
                      assignTask(bodyObj);
                    } else if (
                      // taskProps!.parentTaskTitle.length !== 0 ||
                      editData!.title.length !== 0 &&
                      // taskProps!.relatedTaskName.length !== 0 ||
                      editData!.description.length !== 0 &&
                      editData?.assignTo !== '' &&
                      !isRecordingVoiceNote
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
          <Stack
            style={
              (taskProps?.taskStatus === 'Assigned' &&
                userData?._id === taskProps?.assignee?._id &&
                taskProps?.assignee?._id !== taskProps?.addedBy) ||
              (userData?._id === taskProps?.addedBy &&
                taskProps?.taskStatus === 'AwaitingApproval') ||
              (taskProps?.addedBy === taskProps?.assignee?._id &&
                taskProps?.addedBy === userData?._id &&
                taskProps?.taskStatus === 'Inprogress')
                ? undefined
                : styles.floatingButton
            }>
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
          taskDetail={taskProps}
          onPressClose={() => closePanel()}
          props={props}
          taskProps={taskProps}
          onPressCritical={() => {
            callApiwithTaskId();
          }}
        />
      )}
      {(taskProps?.canAcceptReject ||
        taskProps?.canApproveDiapprove ||
        taskProps?.canPartialApproveDiapprove) &&
        !hideButtons && (
          <TaskFooter
            taskProps={taskProps}
            onAcceptTask={() => {
              callApiwithTaskId();
            }}
            onRejectTask={() => {
              callApiwithTaskId();
            }}
          />
        )}
      {taskProps?.canMarkAsComplete && (
        <Stack spacing={16} spaceBelow={16}>
          <PrimaryButton
            // disabled={
            //   taskProps?.taskStatus === 'Resolve' &&
            //   userData?._id === taskProps?.assignee?._id
            //     ? false
            //     : true
            // }
            title={t('taskDetails:markAsCompleted')}
            onPress={() => {
              setMarkAsCompletedModal(true);
            }}
          />
        </Stack>
      )}
      {taskProps?.taskStatus === 'AwaitingApproval' &&
        !isEditable &&
        !taskProps?.canApproveDiapprove &&
        !taskProps?.canPartialApproveDiapprove && (
          <Stack horizontal style={[styles.pendingApproval]}>
            <TextView
              weight="regular"
              variant={FontSizes.small}
              style={{color: colors.white}}>
              {'Pending for approval'}
            </TextView>
          </Stack>
        )}
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
                    let bodyObj: ChangeStatusBody = {
                      taskId: taskProps?._id,
                    };
                    completeTask(bodyObj);
                  }}>
                  {t('yes')}
                </TextView>
              </Stack>
            </View>
          </View>
        </Modal>
      )}

      {isReAssigneeChange &&
        (editData?.taskStatus === 'Accepted' ||
          editData?.taskStatus === 'Rejected') && (
          <Stack spacing={16} spaceBelow={Platform.OS === 'android' ? 16 : 56}>
            <PrimaryButton
              title={t('saveChanges')}
              onPress={() => {
                let bodyObj: ReassignParams = {
                  taskId: taskProps?._id!,
                  assignTo: editData?.reassignTo!,
                };
                reAssignTask(bodyObj);
              }}
            />
          </Stack>
        )}
      {(isLoading || isAllDataLoaded) && <Loader />}
    </Container>
  );
};
