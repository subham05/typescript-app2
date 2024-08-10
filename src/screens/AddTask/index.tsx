// import {modalMembersList} from 'screens/ShareContact/mockDataModal';
import {StackActions} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {getUploadDocument, uploadDocument} from 'common/utils/Amazon-S3';
import {showToast} from 'common/utils/ToastMessage';
import {Container, TextView} from 'components';
import Badge from 'components/Badge';
import {PrimaryButton} from 'components/Buttons';
import {DatePicker} from 'components/DatePicker';
import FileDocumentUploading from 'components/FileDocumentsUploading';
import {
  FormikDropdownPicker,
  FormikTextField,
  FormikTouchableField,
} from 'components/formikFields';
import {FormikDatePicker} from 'components/formikFields/FormikDatePicker';
import {FormikPriorityPickerField} from 'components/formikFields/FormikPriorityPicker';
import Header from 'components/Header';
import {Icon} from 'components/Icon';
import {IconButton, RippleIconButton} from 'components/IconButtons';
import Loader from 'components/Loader';
import {membersProps} from 'components/Members/MembersItem';
import {MemberItem} from 'components/MembersList/MemberItem';
import {MemberList} from 'components/MembersList/MemberList';
import {Persona} from 'components/Persona';
import {CompanyProps} from 'components/SelectCompany/CompanyListView';
import {Stack, StackItem} from 'components/Stack';
import {TaskDataModel} from 'components/TaskLists/TaskItem';
import {TaskList} from 'components/TaskLists/TaskList';
import {SearchTextField} from 'components/TextField';
import {Formik, FormikProps} from 'formik';
import moment from 'moment';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions, TouchableOpacity, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
// import {useGetCompanyListQuery} from 'request/AddManager';
import Netinfo from '@react-native-community/netinfo';
import {DateTimeFormats} from 'common/utils/DateTimeFormats';
import {_isIOS} from 'common/utils/PlatformCheck';
import {TouchableField} from 'components/TouchableField';
import {
  AssignToUsers,
  useAddTaskCollectionMutation,
  useGetCompanyCollectionQuery,
  useLazyGetAssignToCollectionQuery,
  // useGetAssignToCollectionQuery,
  // useGetCompanyCollectionQuery,
  // useGetReportToCollectionQuery,
  useLazyGetRelatedTaskCollectionQuery,
  useLazyGetReportToCollectionQuery,
} from 'request/AddTask';
import {useGetMasterCollectionQuery} from 'request/MasterCollection';
import {useAppSelector} from 'store/hooks';
import {SpeechToText} from './components/SpeechToText';
import VoiceNotes from './components/VoiceNotes';
import Waveform from './components/Waveform';
import {InitialValues} from './constants';
import {Styles} from './index.styles';
import {AddTaskModel} from './types';
import {AssignTaskSubtaskSchema} from './utils';
import {searchPattern1, searchPattern2} from 'common/utils/Regex';
import {CHAT_TYPE} from 'screens/ChattingScreenFooter';
import {mediaObjFormat} from 'common/utils/mediaObjFormat';

// const userImage =
//   'https://i.picsum.photos/id/1005/5760/3840.jpg?hmac=2acSJCOwz9q_dKtDZdSB-OIK1HUcwBeXco_RMMTUgfY';

export interface DropDownModel {
  label: string;
  value: string;
}
export interface UploadedFileModal {
  fileCopyUri?: string | null;
  name?: string | null;
  size?: number | null;
  type?: string | null;
  uri?: string | null;
  isUploaded?: boolean;
  extension?: string;
}
type Props = NativeStackScreenProps<SignedInStackParamList, 'AddTask'>;
export const AddTaskScreen = (props: Props) => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  const [isSpeechModalOpen, setIsSpeechModalOpen] = useState(false);
  const [speechField, setSpeechField] = useState<'name' | 'description'>(
    'name',
  );

  const {route} = {...props};
  const {subTask, docData, mailData, messageData, channelId, chatType} = {
    ...route.params,
  };

  const [companyValue, setCompanyValue] = useState<string>('');
  const [companyLabel, setCompanyLabel] = useState<string>('');
  const [allCompanyData, setAllCompanyData] = useState<DropDownModel[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [titleValue, setTitleValue] = useState<string>('');
  const [titleLabel, setTitleLabel] = useState<string>('');
  const [allTitleData, setAllTitleData] = useState<DropDownModel[]>([]);
  const [attachmentLoader, setAttachmentLoader] = useState(false);

  const {data} = useGetMasterCollectionQuery();
  const {userData} = useAppSelector(state => state.formanagement);
  // const data = userData?.masterData;
  // const {data: companyResponse, isLoading: companyResponseLoading} =
  //   useGetCompanyCollectionQuery();
  const {data: companyResponse, isLoading: companyResponseLoading} =
    useGetCompanyCollectionQuery();
  const [
    assignTrigger,
    {
      isLoading: assignToResponseLoading,
      isSuccess: isSuccessAssignToMemberList,
      isFetching: isFetchingAssignToMemberList,
    },
  ] = useLazyGetAssignToCollectionQuery();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [reportTrigger, {isLoading: reportToResponseLoading}] =
    useLazyGetReportToCollectionQuery();
  // useGetCompanyListQuery();
  // const {data: assignToResponse, isLoading: assignToResponseLoading} =
  //   useGetAssignToCollectionQuery();
  // const {data: reportToResponse, isLoading: reportToResponseLoading} =
  //   useGetReportToCollectionQuery();
  const [trigger] = useLazyGetRelatedTaskCollectionQuery();
  const [
    createTask,
    {
      data: createTaskData,
      isLoading: isLoadingCreateTask,
      isSuccess,
      error: CreateTaskError,
    },
  ] = useAddTaskCollectionMutation();
  let isDataLoaded =
    (companyResponseLoading &&
      assignToResponseLoading &&
      reportToResponseLoading) ||
    isLoadingCreateTask ||
    attachmentLoader;
  const [isAllDataLoaded, setIsLoading] = useState<boolean>(false);
  const [assignToMembersList, setAssignToMembersList] = useState<
    membersProps[] | AssignToUsers[] | undefined
  >();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [reportToMembersList, setReportToMembersList] = useState<
    membersProps[] | AssignToUsers[] | undefined
  >();
  // let assignToMembersList: membersProps[] | AssignToUsers[] | undefined =
  //   assignToResponse;
  // const reportToMembersList: membersProps[] | AssignToUsers[] | undefined =
  //   reportToResponse;
  const [searchAssignText, setSearchAssignText] = useState('');
  const [searchReportText, setSearchReportText] = useState('');
  const [searchRelatedTaskText, setSearchRelatedTaskText] = useState('');
  const [taskData, setTaskData] = useState<TaskDataModel[]>([]);

  const [voicePath, setVoicePath] = useState<string | undefined>();
  const [bufferData, setBufferData] = useState<number[]>([]);
  const [timeMSState, setTimeMSState] = useState(0);
  const {validations} = useAppSelector(state => state?.formanagement);

  const setAudioStates = (
    voiceResult: string | undefined,
    voiceBuffer: number[],
    timeMS: number,
  ) => {
    setVoicePath(voiceResult);
    setBufferData(voiceBuffer);
    setTimeMSState(timeMS * 100);
  };

  useEffect(() => {
    setAssignToMembersList([]);
    let obj = {
      searchText: searchAssignText,
      companyId: companyValue,
    };
    if (companyValue) {
      assignTrigger(obj).then(res => {
        setAssignToMembersList([]);
        setAssignToMembersList(res.data);
      });
    }
  }, [assignTrigger, companyValue, searchAssignText]);

  // useEffect(() => {
  //   setReportToMembersList([]);
  //   let obj = {
  //     searchText: searchReportText,
  //     companyId: companyValue,
  //   };
  //   if (companyValue) {
  //     reportTrigger(obj).then(res => {
  //       setReportToMembersList([]);
  //       setReportToMembersList(res.data);
  //     });
  //   }
  // }, [companyValue, reportTrigger, searchReportText]);
  // console.log(reportToMembersList);
  useEffect(() => {
    let titleData: DropDownModel[] = [];
    data?.typeOfTask.map((item: string) =>
      titleData.push({
        label: item,
        value: item,
      }),
    );
    setAllTitleData(titleData);
    if (companyResponse) {
      let companyData: DropDownModel[] = [];
      companyResponse.map((item: CompanyProps) =>
        companyData.push({
          label: item.name,
          value: item._id as string,
        }),
      );
      setAllCompanyData(companyData);
    }
    if (userData) {
      formikRef.current?.setFieldValue('reportTo', userData?._id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyResponse, data]);

  useEffect(() => {
    if (companyValue !== '') {
      let relatedTaskAPIQuery = {
        companyId: companyValue,
        type: 'relatedtask',
      };
      trigger(relatedTaskAPIQuery).then(res => {
        let resultData = res.data;
        let tempTaskData: any = [];
        if (resultData?.length && !taskData.length) {
          resultData?.map((item: TaskDataModel) =>
            tempTaskData.push({
              _id: item._id,
              taskId: item.taskId,
              taskNumber: item.taskNumber,
              title: item.title,
              type: item.type,
            }),
          );
          setTaskData(tempTaskData);
        }
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyValue, taskData]);

  const [addValue, setAddValue] = useState<string>('');
  const allAddData = [
    {label: 'Task', value: 'Task'},
    {label: 'Subtask', value: 'Subtask'},
  ];
  // const [assignValue, setAssignValue] = useState<string>('');
  // const [reportValue, setReportValue] = useState<string>('');

  // const allAssignData = [
  //   {label: 'Assign to me', value: 'Assign to me'},
  //   {label: 'Manager', value: 'Manager'},
  //   {label: 'Manager name', value: 'Manager name'},
  // ];

  // const allReportData = [
  //   {label: 'Manager', value: 'Manager'},
  //   {label: 'Manager name', value: 'Manager name'},
  // ];

  const [assignToModal, setAssignToModal] = useState<boolean>(false);
  const [reportToModal, setReportToModal] = useState<boolean>(false);
  const [relatedTaskModal, setRelatedTaskModal] = useState<boolean>(false);
  const [relatedTask, setRelatedTask] = useState<TaskDataModel>();

  const [isCritical, setIsCritical] = useState<boolean>(false);

  const [selfAssigned, setSelfAssigned] = useState<boolean>(false);
  const [assignTo, setAssignTo] = useState<membersProps | AssignToUsers>();
  const [selfReported, setSelfReported] = useState<boolean>(true);
  const [reportTo, setReportTo] = useState<membersProps | AssignToUsers>({
    _id: userData?._id!,
    name: userData?.name!,
    position: userData?.role.type,
    profilePic: userData?.profileUrl,
  });

  const [startDatePicked, setStartDatePicked] = useState<Date>();
  const [dueDatePicked, setDueDatePicked] = useState<string | undefined>();
  const [startTime, setStartTime] = useState<string>(
    moment().format(DateTimeFormats.Time),
  );
  // let dueTimeEqual = new Date().setTime(new Date().getTime() + 1000 * 60);
  const [dueTime, setDueTime] = useState<string>(
    moment().format(DateTimeFormats.Time),
  );

  const [startDateObject, setStartDateObject] = useState<string>();
  const [dueDateObject, setDueDateObject] = useState<string>();

  const [uploadedFiles, setUploadedFiles] = useState<
    UploadedFileModal[] | undefined
  >(undefined);
  const [uploadedDoc, setUploadedDoc] = useState<
    UploadedFileModal[] | undefined
  >(undefined);
  const [addSubtaskModal, setAddSubtaskModal] = useState<boolean>(false);
  const [stateUpdater, setStateUpdater] = useState<boolean>(false);
  const [isSubtaskCreation, setIsSubtaskCreation] = useState<boolean>(false);
  const formikRef = useRef<FormikProps<AddTaskModel> | null>(null);

  const onPressAssignedTo = (val: membersProps | AssignToUsers | undefined) => {
    // setSelfAssigned(false);
    setAssignTo(val);
    setAssignToModal(false);
  };

  const onPressReportTo = (val: membersProps | AssignToUsers | undefined) => {
    // setSelfReported(false);
    setReportTo(val!);
    setReportToModal(false);
  };

  useEffect(() => {
    if (isSuccess) {
      showToast('Task created successfully.');
      if (uploadedDoc?.length! > 0) {
        setUploadedFiles([]);
      }
      setIsLoading(false);
      setAttachmentLoader(false);
      // setUploadedDoc(undefined);
      const popAction = StackActions.pop(1);
      props.navigation.dispatch(popAction);
      if (isSubtaskCreation) {
        props.navigation.navigate('AddSubTask', {
          subTaskData: createTaskData.data,
        });
      }
      setIsSubtaskCreation(false);
    } else {
      setIsLoading(false);
      setAttachmentLoader(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    createTaskData,
    CreateTaskError,
    isSubtaskCreation,
    isSuccess,
    props.navigation,
  ]);
  useEffect(() => {
    if (docData?.data) {
      if (docData.data?.attachment) {
        const obj = {
          uri: docData.data?.attachment?.url,
          name: decodeURIComponent(docData.data?.attachment?.url)
            .split('/')
            .pop(),
          isUploaded: true,
        };
        setUploadedFiles([obj]);
        setUploadedDoc([obj]);
      }
      formikRef.current?.setFieldValue('name', docData.data?.title);
      formikRef.current?.setFieldValue(
        'description',
        docData.data?.description,
      );
    }
    if (mailData) {
      let objArray: UploadedFileModal[] = [];
      mailData?.attachment?.map(mailAttachment => {
        const obj = {
          uri: mailAttachment?.url,
          name: decodeURIComponent(mailAttachment?.url).split('/').pop(),
          isUploaded: true,
          type: mailAttachment?.type,
        };
        objArray.push(obj);
        // setUploadedDoc(obj);
      });
      setUploadedFiles(objArray);
      setUploadedDoc([...objArray]);
      formikRef.current?.setFieldValue(
        'name',
        mailData.subject.replace(/\0/g, '').substring(0, 99),
      );
      formikRef.current?.setFieldValue(
        'description',
        mailData.body[0].replace(/\0/g, '').substring(0, 249),
      );
    }
    if (messageData) {
      formikRef.current?.setFieldValue(
        'name',
        messageData.message.replace(/\0/g, '').substring(0, 99),
      );
      formikRef.current?.setFieldValue(
        'description',
        messageData.message.replace(/\0/g, '').substring(0, 249),
      );
    }
  }, [docData, mailData, messageData]);
  useEffect(() => {
    if (CreateTaskError) {
      setIsLoading(false);
      setAttachmentLoader(false);
      const err: any = CreateTaskError;
      // if (err?.error) {
      //   showToast(err.error);
      // } else {
      // err?.data?.error.map((errorItem: companyError) =>
      //   formikRef.current?.setFieldError(errorItem.param, errorItem.msg),
      // );
      showToast(err?.data?.error[0].msg);
      // }
    }
  }, [CreateTaskError]);

  const onSubmit = async (values: AddTaskModel) => {
    if (
      values?.title?.trim()?.length !== 0 &&
      values?.description?.trim()?.length !== 0
    ) {
      setIsLoading(true);
      chooseFile().then(res => {
        if (uploadedDoc?.length! > 0) {
          uploadedDoc?.map(item => res?.docResult?.push(item.uri));
        }
        let attachmentObj = mediaObjFormat(uploadedFiles, res?.docResult);
        let bodyObj = {
          company: values.company,
          title: values.name,
          type: values.title,
          description: values.description,
          assignTo: values.assignTo,
          startDate: values.startDate,
          dueDate: values.dueDate,
          startTime: values.startTime,
          dueTime: values.dueTime,
          priority: values.priority,
          // reportTo: values.reportTo,
          reportTo: userData?._id,
          relatedTaskName: values.relatedTaskName,
          isCritical: values.isCritical,
          // attachment: res?.docResult || [],
          attachment: attachmentObj || [],
          voiceNote: {
            link: res?.addVoiceNoteResult || '',
            buffer: res?.addVoiceNoteResult ? bufferData : [],
            title: `taskvoicenote${moment().format('YYYYMMDDhhmm')}`,
            timeLength: `${timeMSState}`,
          },
          startDateObject: startDateObject,
          dueDateObject: dueDateObject,
        };
        if (!values.relatedTaskName) {
          delete bodyObj.relatedTaskName;
        }
        if (!res?.addVoiceNoteResult) {
          delete bodyObj.voiceNote;
        }
        if (docData?.data) {
          bodyObj = {...bodyObj, documentId: docData.data._id};
        }
        if (mailData) {
          bodyObj = {...bodyObj, emailId: mailData._id};
        }
        if (messageData) {
          if (chatType === CHAT_TYPE.CHAT) {
            bodyObj = {
              ...bodyObj,
              messageId: messageData?._id,
              chatId: channelId,
            };
          } else if (chatType === CHAT_TYPE.GROUP) {
            bodyObj = {
              ...bodyObj,
              messageId: messageData?._id,
              groupId: channelId,
            };
          }
        }
        createTask(bodyObj);
      });
    }
  };
  const styles = Styles();
  const RenderRightContainer = (nameLength: number) => {
    return (
      <TouchableOpacity>
        <IconButton
          name="mic"
          size={20}
          color={colors.primary_003}
          onPress={() => {
            if (nameLength < validations?.taskName.MAX!) {
              setIsSpeechModalOpen(true);
              setSpeechField('name');
            } else {
              showToast('Maximum length reached');
            }
          }}
        />
      </TouchableOpacity>
    );
  };
  const RenderRightContainerDescription = (descriptionLength: number) => {
    return (
      <TouchableOpacity style={styles.mic}>
        <IconButton
          name="mic"
          size={20}
          color={colors.primary_003}
          onPress={() => {
            if (descriptionLength < validations?.taskDescription.MAX!) {
              setIsSpeechModalOpen(true);
              setSpeechField('description');
            } else {
              showToast('Maximum length reached');
            }
          }}
        />
      </TouchableOpacity>
    );
  };

  const RenderAssignToView = () => {
    return (
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
        {selfAssigned ? (
          <Stack horizontal verticalAlign="center">
            <Persona
              name={userData?.name}
              image={userData?.profileUrl}
              size={38}
            />
            <Stack style={styles.view}>
              <TextView weight="medium" variant={FontSizes.regular} truncate>
                {userData?.name}
              </TextView>
            </Stack>
          </Stack>
        ) : (
          <MemberItem
            item={assignTo}
            onPress={() => {
              setAssignToModal(true);
            }}
            isDividerFalse
          />
        )}
      </Stack>
    );
  };

  const RenderReportToView = () => {
    return (
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
        {selfReported ? (
          <Stack horizontal verticalAlign="center">
            <Persona
              name={userData?.name}
              image={userData?.profileUrl}
              size={38}
            />
            <Stack style={styles.view}>
              <TextView weight="medium" variant={FontSizes.regular} truncate>
                {userData?.name}
              </TextView>
            </Stack>
          </Stack>
        ) : (
          <MemberItem
            item={reportTo}
            onPress={() => {
              setReportToModal(true);
            }}
            isDividerFalse
          />
        )}
      </Stack>
    );
  };

  const RenderRelatedTaskView = () => {
    return (
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
        <Stack horizontal verticalAlign="center">
          <Stack style={styles.relatedTaskView}>
            {relatedTask?.title ? (
              <TextView weight="medium" variant={FontSizes.regular} truncate>
                {relatedTask?.title}
              </TextView>
            ) : (
              <TextView
                weight="regular"
                variant={FontSizes.medium}
                style={{color: colors.primary_003}}>
                {t('addTask:relatedTaskPlaceholder')}
              </TextView>
            )}
          </Stack>
        </Stack>
      </Stack>
    );
  };
  const chooseFile = async () => {
    let docResult;
    let addVoiceNoteResult;
    setAttachmentLoader(true);
    await Netinfo.fetch().then(async state => {
      if (state.isConnected) {
        let tempArray: UploadedFileModal[] = [];
        uploadedFiles?.map(file =>
          file.uri?.includes('https://formanagement.s3.amazonaws')
            ? null
            : tempArray.push(file),
        );
        docResult = await uploadDocument(
          tempArray,
          `task/media/${moment().format('YYYYMMDDHH')}/`,
        );
        if (voicePath) {
          let date = new Date();
          let timeFormat = date.valueOf().toString();
          const voiceObj = {
            name: `voiceNote_${timeFormat}.mp4`,
            type: 'audio/mp4',
            uri: voicePath,
          };
          addVoiceNoteResult = await getUploadDocument(
            voiceObj,
            `voiceNote${moment().format()}`,
          );
        }
      } else {
        showToast(t('noNetwork'));
        setIsLoading(false);
        setAttachmentLoader(false);
      }
    });
    return {docResult, addVoiceNoteResult};
  };

  const uploadFileData = (dataItem: any) => {
    const getIdx = uploadedFiles
      ? uploadedFiles.findIndex(item => {
          return (
            item.name === dataItem[0].name && item.size === dataItem[0].size
          );
        })
      : -1;
    if (getIdx === -1) {
      const arr = uploadedFiles || [];
      arr?.push(dataItem[0]);
      setUploadedFiles(arr);
      setStateUpdater(!stateUpdater);
    } else {
      showToast(`File ${dataItem[0].name} already uploaded.`);
    }
  };
  const resetValues = () => {
    // setSelfReported(false);
    setSelfAssigned(false);
    onPressAssignedTo(undefined);
    // onPressReportTo(undefined);
    formikRef.current?.setFieldValue('assignTo', '');
    formikRef.current?.setFieldValue('reportTo', userData?._id);
  };
  const convertDueDateUTC = (
    startDate: string | undefined,
    dueDate: string | Date,
  ) => {
    let startDatePostFix = startDate?.split('T')[0];
    let dueDatePostFix = dueDate?.split('T')[1];
    let finalDueDate = startDatePostFix + 'T' + dueDatePostFix;
    return finalDueDate;
  };

  const speechToTextCheckSet = (text: string) => {
    if (_isIOS) {
      let remainingCheckLength =
        speechField === 'name'
          ? validations?.taskName?.MAX!
          : validations?.taskDescription?.MAX!;
      let availableLength =
        remainingCheckLength - formikRef?.current?.values[speechField].length;
      formikRef?.current?.setFieldValue(
        speechField,
        formikRef?.current?.values[speechField].length
          ? formikRef?.current?.values[speechField] +
              ' ' +
              text.slice(0, availableLength - 1)
          : formikRef?.current?.values[speechField] + text.slice(0, 250),
      );
    } else {
      formikRef?.current?.setFieldValue(
        speechField,
        formikRef?.current?.values[speechField].length
          ? formikRef?.current?.values[speechField] + ' ' + text
          : formikRef?.current?.values[speechField] + text,
      );
    }
  };
  // const styles = Styles();
  return (
    <Formik<AddTaskModel>
      initialValues={InitialValues}
      innerRef={formikRef}
      validateOnMount
      onSubmit={onSubmit}
      validationSchema={AssignTaskSubtaskSchema}>
      {({handleSubmit, setFieldValue, values, isValid}) => {
        return (
          <Container noSpacing>
            <Header
              navigationType="STACK"
              label={t('homePage:addTask')}
              translateY={translateY}
            />
            <Animated.ScrollView
              showsVerticalScrollIndicator={false}
              keyboardDismissMode="on-drag"
              onScroll={scrollHandler}
              scrollEventThrottle={16}>
              <KeyboardAwareScrollView bounces={false} overScrollMode={'never'}>
                <Stack>
                  <StackItem childrenGap={16} spacing={16} spaceBelow={16}>
                    <FormikDropdownPicker
                      options={allCompanyData}
                      value={companyLabel}
                      name="company"
                      onSelect={val => {
                        setCompanyValue(val.value);
                        resetValues();
                        setCompanyLabel(val.label);
                      }}
                      placeholder={t('addTask:companyDropdownPlaceholder')}
                    />
                    <FormikDropdownPicker
                      label={t('addTask:type')}
                      options={allTitleData}
                      value={titleLabel}
                      name="title"
                      onSelect={val => {
                        //setTitleValue(val.value);
                        setTitleLabel(val.label);
                      }}
                      placeholder={t('addTask:dropdownPlaceholder')}
                    />
                    {!subTask && (
                      <FormikDropdownPicker
                        label={t('addTask:add')}
                        options={allAddData}
                        value={addValue}
                        name="addValue"
                        onChange={(item: DropDownModel) => {
                          setAddValue(item.value);
                        }}
                        placeholder={t('addTask:dropdownPlaceholder')}
                      />
                    )}
                    <FormikTextField
                      name="name"
                      label={t('addTask:title')}
                      placeholder={t('addTask:titlePlaceholder')}
                      RenderRightContainer={() =>
                        RenderRightContainer(values.name.length)
                      }
                      maxLength={validations?.taskName.MAX}
                    />
                    <FormikTextField
                      name="description"
                      label={t('addTask:description')}
                      placeholder={t('addTask:descriptionPlaceholder')}
                      RenderRightContainer={() =>
                        RenderRightContainerDescription(
                          values.description.length,
                        )
                      }
                      multiline
                      numberOfLines={4}
                      containerStyles={styles.containerStyles}
                      maxLength={validations?.taskDescription.MAX}
                    />
                    <TextView style={styles.headerTextColor}>
                      {t('addTask:voiceNote')}
                    </TextView>
                    {!voicePath ? (
                      <Stack>
                        <VoiceNotes
                          onResult={(voiceResult, voiceBuffer, timeMS) => {
                            setAudioStates(voiceResult, voiceBuffer, timeMS);
                          }}
                        />
                      </Stack>
                    ) : (
                      <Stack
                        horizontal
                        horizontalAlign="space-between"
                        verticalAlign="center"
                        style={styles.BoxStyle}>
                        <Waveform
                          bufferData={bufferData}
                          timeMS={timeMSState}
                        />
                        <IconButton
                          size={24}
                          style={styles.CloseIconStyle}
                          name="close"
                          color={colors.black}
                          onPress={() => setVoicePath('')}
                        />
                        <TextView
                          variant={FontSizes.xxSmall}
                          style={styles.timeStyle}>
                          {moment.utc(timeMSState).format('mm:ss')}
                        </TextView>
                        <TextView
                          variant={FontSizes.xxSmall}
                          style={styles.currentTimeStyle}>
                          {moment().format('LT')}
                        </TextView>
                      </Stack>
                    )}
                    {/* <Stack>
                      <VoiceNotes />
                    </Stack> */}
                    {isSpeechModalOpen && (
                      <SpeechToText
                        close={() => setIsSpeechModalOpen(false)}
                        text={text => {
                          speechToTextCheckSet(text);
                        }}
                      />
                    )}
                    <FormikTouchableField
                      label={t('addTask:assignTo')}
                      icon={'arrow_expand_more'}
                      RenderView={RenderAssignToView}
                      onPress={() => {
                        setAssignToModal(true);
                      }}
                      data={assignTo}
                      placeholder={
                        assignTo ? undefined : t('addTask:assigneePlaceholder')
                      }
                      name="assignTo"
                    />
                    {/* <TextView
                      weight="regular"
                      variant={FontSizes.regular}
                      style={[styles.label, styles.headerTextColor]}>
                      {t('addTask:assignTo')}
                    </TextView> */}
                    {/* <Stack>
                      <TouchableOpacity
                        onPress={() => {
                          setAssignToModal(true);
                        }}
                        style={styles.assignReportTo}>
                        <Stack
                          horizontal
                          horizontalAlign="space-between"
                          verticalAlign="center">
                          {selfAssigned ? (
                            <Stack horizontal verticalAlign="center">
                              <Persona
                                name={'Leslie Alexander'}
                                image={userImage}
                                size={38}
                              />
                              <Stack style={styles.view}>
                                <TextView
                                  weight="medium"
                                  variant={FontSizes.regular}
                                  truncate>
                                  Assign to me
                                </TextView>
                              </Stack>
                            </Stack>
                          ) : (
                            <MemberItem
                              item={assignTo}
                              onPress={() => {
                                setAssignToModal(true);
                              }}
                              isDividerFalse
                            />
                            // <Stack horizontal>
                            //   <TextView
                            //     weight="regular"
                            //     variant={FontSizes.small}
                            //     style={styles.date}
                            //     truncate>
                            //     {assignTo?.name}
                            //     {' | '}
                            //   </TextView>
                            //   <TextView
                            //     weight="regular"
                            //     variant={FontSizes.small}
                            //     style={styles.date}>
                            //     {assignTo?.position}
                            //   </TextView>
                            // </Stack>
                          )}
                          <Icon
                            name="arrow_expand_more"
                            size={24}
                            color={colors.black}
                          />
                        </Stack>
                      </TouchableOpacity> */}
                    {/* {errors.assignTo && (
                        <TextView
                          children={errors.assignTo}
                          weight="regular"
                          variant={FontSizes.xSmall}
                          style={styles.error}
                        />
                      )} */}
                    {/* </Stack> */}
                    {/* <DropDownView
                    placeholderStyle={styles.placeholderStyle}
                    label={t('addTask:reportTo')}
                    data={allReportData}
                    labelField="label"
                    valueField="value"
                    placeholder={t('managersHomePage:managersAssignTo3')}
                    value={reportValue}
                    onChange={item => {
                      setFieldValue('reportTo', item.value);
                      setReportValue(item.value);
                    }}
                    onBlur={() => setFieldTouched('reportTo')}
                    renderItem={renderItem}
                  /> */}
                    <FormikTouchableField
                      label={t('addTask:reportTo')}
                      icon={'arrow_expand_more'}
                      RenderView={RenderReportToView}
                      onPress={() => {
                        setReportToModal(true);
                      }}
                      data={reportTo}
                      placeholder={
                        reportTo ? undefined : t('addTask:reporterPlaceholder')
                      }
                      name={'reportTo'}
                      disabled
                      disabledNoBackground
                    />
                    {/* <TextView
                      weight="regular"
                      variant={FontSizes.regular}
                      style={[styles.label, styles.headerTextColor]}>
                      {t('addTask:reportTo')}
                    </TextView>
                    <Stack>
                      <TouchableOpacity
                        onPress={() => {
                          setReportToModal(true);
                        }}
                        style={styles.assignReportTo}>
                        <Stack
                          horizontal
                          horizontalAlign="space-between"
                          verticalAlign="center">
                          {selfReported ? (
                            <Stack horizontal verticalAlign="center">
                              <Persona
                                name={'Leslie Alexander'}
                                image={userImage}
                                size={38}
                              />
                              <Stack style={styles.view}>
                                <TextView
                                  weight="medium"
                                  variant={FontSizes.regular}
                                  truncate>
                                  Report to me
                                </TextView>
                              </Stack>
                            </Stack>
                          ) : (
                            <MemberItem
                              item={reportTo}
                              onPress={() => {
                                setReportToModal(true);
                              }}
                              isDividerFalse
                            />
                            // <Stack horizontal>
                            //   <TextView
                            //     weight="regular"
                            //     variant={FontSizes.small}
                            //     style={styles.date}
                            //     truncate>
                            //     {reportTo?.name}
                            //     {' | '}
                            //   </TextView>
                            //   <TextView
                            //     weight="regular"
                            //     variant={FontSizes.small}
                            //     style={styles.date}>
                            //     {reportTo?.position}
                            //   </TextView>
                            // </Stack>
                          )}
                          <Icon
                            name="arrow_expand_more"
                            size={24}
                            color={colors.black}
                          />
                        </Stack>
                      </TouchableOpacity> */}
                    {/* {errors.reportTo && (
                        <TextView
                          children={errors.reportTo}
                          weight="regular"
                          variant={FontSizes.xSmall}
                          style={styles.error}
                        />
                      )} */}
                    {/* </Stack> */}
                    {/* {selfAssigned && (
                      <FormikTextField
                        name="relatedTaskName"
                        label={t('addTask:relatedTask')}
                        placeholder={t('addTask:relatedTaskPlaceholder')}
                      />
                    )} */}
                    {/* {selfAssigned && ( */}
                    <TouchableField
                      label={t('addTask:relatedTask')}
                      icon={'arrow_expand_more'}
                      RenderView={RenderRelatedTaskView}
                      onPress={() => {
                        setRelatedTaskModal(true);
                      }}
                      placeholder={
                        relatedTask
                          ? undefined
                          : t('addTask:relatedTaskPlaceholder')
                      }
                      // name="relatedTaskName"
                    />
                    {/* )} */}
                    <Stack horizontal center style={styles.buttonView}>
                      <View style={styles.fieldView}>
                        <FormikDatePicker
                          isValidAge={true}
                          ageCheck={false}
                          name="startDate"
                          label={t('addTask:startDate')}
                          placeholder={DateTimeFormats.ShortMonthDateYear}
                          format={DateTimeFormats.MonthDateYear}
                          minimumDate={new Date()}
                          // maximumDate={
                          //   values.dueDate !== ''
                          //     ? new Date(values.dueDate)
                          //     : undefined
                          // }
                          onPress={value => {
                            if (
                              moment(values?.dueDate).format(
                                DateTimeFormats.DayMonthYear,
                              ) ===
                              moment(value).format(DateTimeFormats.DayMonthYear)
                              // && startTime >= dueTime
                            ) {
                              // setFieldValue(
                              //   'dueTime',
                              //   moment(dueTimeEqual).toDate(),
                              // );
                              // setDueTime(
                              //   moment(dueTimeEqual).format('hh:mm A'),
                              // );
                              setFieldValue(
                                'startDate',
                                moment(value).format(
                                  DateTimeFormats.YearMonthDay,
                                ),
                              );
                              setStartDatePicked(moment(value).toDate());
                              setStartDateObject(moment(value).toISOString());
                              setFieldValue(
                                'dueDate',
                                moment(value)
                                  .add(1, 'day')
                                  .format(DateTimeFormats.YearMonthDay),
                              );
                              setDueDatePicked(
                                moment(value)
                                  .add(1, 'day')
                                  .format(DateTimeFormats.MonthDateYear),
                              );
                              setDueDateObject(
                                moment(value).add(1, 'day').toISOString(),
                              );
                              showToast(
                                'Start date should not be equal to or more than due date.',
                              );
                            } else {
                              setFieldValue(
                                'startDate',
                                moment(value).format(
                                  DateTimeFormats.YearMonthDay,
                                ),
                              );
                              setStartDatePicked(value);
                              setStartDateObject(moment(value).toISOString());
                              setFieldValue(
                                'dueDate',
                                moment(value)
                                  .add(1, 'day')
                                  .format(DateTimeFormats.YearMonthDay),
                              );
                              setDueDatePicked(
                                moment(value)
                                  .add(1, 'day')
                                  .format(DateTimeFormats.MonthDateYear),
                              );
                              setDueDateObject(
                                moment(value).add(1, 'day').toISOString(),
                              );
                              setFieldValue(
                                'startTime',
                                moment().format(DateTimeFormats.Time),
                              );
                              setStartTime(
                                moment().format(DateTimeFormats.Time),
                              );
                              setFieldValue(
                                'dueTime',
                                moment().format(DateTimeFormats.Time),
                              );
                              setDueTime(moment().format(DateTimeFormats.Time));
                              // setFieldValue('startTime', new Date());
                              // setStartTime(moment(value).format('hh:mm A'));
                              // setFieldValue('dueTime', moment().toDate());
                              // setDueTime(moment().format('hh:mm A'));
                            }
                            // setFieldValue('startDate', value);
                            // setFieldValue('startTime', moment().toDate());
                            // setStartDatePicked(value);
                            // setStartTime(moment().format('hh:mm A'));
                          }}
                        />
                      </View>
                      <View style={styles.fieldView}>
                        <FormikDatePicker
                          isValidAge={true}
                          ageCheck={false}
                          name="dueDate"
                          label={t('addTask:dueDate')}
                          placeholder={DateTimeFormats.ShortMonthDateYear}
                          format={DateTimeFormats.MonthDateYear}
                          minimumDate={
                            values.startDate !== ''
                              ? new Date(values.startDate)
                              : new Date()
                          }
                          value={dueDatePicked}
                          onPress={value => {
                            // setFieldValue('dueDate', value);
                            if (
                              moment(value).format(
                                DateTimeFormats.DayMonthYear,
                              ) ===
                              moment(values.startDate).format(
                                DateTimeFormats.DayMonthYear,
                              )
                              // && startTime >= dueTime
                            ) {
                              // setFieldValue(
                              //   'dueTime',
                              //   moment(dueTimeEqual).toDate(),
                              // );
                              // setDueTime(
                              //   moment(dueTimeEqual).format('hh:mm A'),
                              // );

                              setFieldValue(
                                'dueDate',
                                moment(values.startDate)
                                  .add(1, 'day')
                                  .format(DateTimeFormats.YearMonthDay),
                              );
                              setDueDatePicked(
                                moment(values.startDate)
                                  .add(1, 'day')
                                  .format(DateTimeFormats.MonthDateYear),
                              );
                              setDueDateObject(
                                moment(values.startDate)
                                  .add(1, 'day')
                                  .toISOString(),
                              );
                              showToast(
                                'Start date should not be equal to or more than due date.',
                              );
                            } else {
                              setFieldValue(
                                'dueDate',
                                moment(value).format(
                                  DateTimeFormats.YearMonthDay,
                                ),
                              );
                              setDueDatePicked(
                                moment(value).format(
                                  DateTimeFormats.MonthDateYear,
                                ),
                              );
                              setDueDateObject(
                                moment(value).add(1, 'day').toISOString(),
                              );
                              setFieldValue(
                                'startTime',
                                moment().format(DateTimeFormats.Time),
                              );
                              setStartTime(
                                moment().format(DateTimeFormats.Time),
                              );
                              setFieldValue(
                                'dueTime',
                                moment().format(DateTimeFormats.Time),
                              );
                              setDueTime(moment().format(DateTimeFormats.Time));
                              // setFieldValue('startTime', new Date());
                              // setStartTime(moment(value).format('hh:mm A'));
                              // setFieldValue('dueTime', moment().toDate());
                              // setDueTime(moment().format('hh:mm A'));
                            }
                            // setFieldValue('dueDate', value);
                          }}
                        />
                      </View>
                    </Stack>
                    <Stack horizontal center style={styles.buttonView}>
                      <View style={styles.fieldView}>
                        <FormikDatePicker
                          label={t('addTask:startTime')}
                          name="startTime"
                          mode="time"
                          icon="time"
                          iconSize={22}
                          value={startTime}
                          onPress={value => {
                            // if (
                            //   moment(values.dueDate).format(DateTimeFormats.DayMonthYear) ===
                            //     moment(values.startDate).format(DateTimeFormats.DayMonthYear) &&
                            //   moment(value).format('hh:mm A') >= dueTime
                            // ) {
                            //   showToast(
                            //     'Start time should not equal to or more than due time.',
                            //   );
                            // } else {
                            setFieldValue(
                              'startTime',
                              moment(value).format(DateTimeFormats.Time),
                            );
                            setStartTime(
                              moment(value).format(DateTimeFormats.Time),
                            );
                            // setStartDateObject(moment(value).toISOString());
                            setFieldValue(
                              'dueTime',
                              moment(value).format(DateTimeFormats.Time),
                            );
                            setDueTime(
                              moment(value).format(DateTimeFormats.Time),
                            );
                            let startDateObj = convertDueDateUTC(
                              startDateObject,
                              moment(value).toISOString(),
                            );
                            setStartDateObject(startDateObj);
                            let dueDateObj = convertDueDateUTC(
                              dueDateObject,
                              moment(value).toISOString(),
                            );
                            setDueDateObject(dueDateObj);
                            // }
                          }}
                          selectedDate={startDatePicked}
                          // minimumDate={new Date()}
                        />
                      </View>
                      <View style={styles.fieldView}>
                        <DatePicker
                          label={t('addTask:dueTime')}
                          mode="time"
                          icon="time"
                          iconSize={22}
                          value={dueTime}
                          disabled
                          // selectedDate={dueDatePicked}
                          // minimumDate={new Date()}
                        />
                      </View>
                    </Stack>
                    <Stack spaceBelow={16}>
                      <FormikPriorityPickerField name="priority" />
                      {/* {touched.priority && errors.priority && (
                        <TextView
                          children={errors.priority}
                          weight="regular"
                          variant={FontSizes.xSmall}
                          style={styles.error}
                        />
                      )} */}
                    </Stack>
                    <TouchableOpacity
                      onPress={() => {
                        setIsCritical(prevState => !prevState);
                        setFieldValue('isCritical', !isCritical);
                      }}>
                      <StackItem
                        horizontal
                        childrenGap={10}
                        verticalAlign="center">
                        {isCritical ? (
                          <Icon
                            name="check_box"
                            size={22}
                            color={colors.primary}
                          />
                        ) : (
                          <Icon
                            name="check_box_blank"
                            size={22}
                            color={colors.primary}
                          />
                        )}
                        <TextView
                          weight="medium"
                          variant={FontSizes.regular}
                          style={styles.markAsCritical}>
                          {t('addTask:markAsCritical')}
                        </TextView>
                      </StackItem>
                    </TouchableOpacity>
                    <Stack horizontal>
                      {subTask && isValid ? (
                        <TouchableOpacity
                          onPress={() => {
                            setIsSubtaskCreation(true);
                            setAddSubtaskModal(true);
                          }}>
                          <Stack
                            horizontal
                            style={styles.subtask}
                            verticalAlign="center">
                            <Icon
                              name="add_subtask"
                              size={22}
                              color={colors.primary}
                              style={styles.icon}
                            />
                            <TextView
                              weight="medium"
                              variant={FontSizes.medium}
                              style={[
                                styles.attachFile,
                                {
                                  color: colors.primary,
                                },
                              ]}>
                              {t('addTask:subTask')}
                            </TextView>
                          </Stack>
                        </TouchableOpacity>
                      ) : (
                        <Stack
                          horizontal
                          style={styles.subtask}
                          verticalAlign="center">
                          <Icon
                            name="add_subtask"
                            size={22}
                            color={colors.primary_005}
                            style={styles.icon}
                          />
                          <TextView
                            weight="medium"
                            variant={FontSizes.medium}
                            style={[
                              styles.attachFile,
                              {color: colors.primary_005},
                            ]}>
                            {t('addTask:subTask')}
                          </TextView>
                        </Stack>
                      )}
                      {/* <TouchableOpacity onPress={takePermissionStorage}>
                        <Stack horizontal>
                          <Icon
                            name="attach_file"
                            size={22}
                            color={colors.primary}
                            style={styles.icon}
                          />
                          <TextView
                            weight="medium"
                            variant={FontSizes.medium}
                            style={styles.attachFile}>
                            {t('addTask:attach')}
                          </TextView>
                        </Stack>
                      </TouchableOpacity> */}
                      <FileDocumentUploading
                        title={t('addTask:attach')}
                        setUploadedFileData={files => {
                          uploadedFiles?.length! < 5 ||
                          uploadedFiles?.length! === undefined
                            ? uploadFileData(files)
                            : showToast('You cannot add more than 5 files.');
                        }}
                      />
                    </Stack>
                    <Badge
                      uploadedFiles={uploadedFiles}
                      onRemove={itmIndex => {
                        uploadedFiles![itmIndex]?.isUploaded &&
                          setUploadedDoc(undefined);
                        uploadedFiles?.splice(itmIndex, 1);
                        setStateUpdater(!stateUpdater);
                      }}
                    />
                  </StackItem>
                  <Stack spacing={16} spaceBelow={16} style={styles.AddButton}>
                    <PrimaryButton
                      // disabled={!isValid}
                      title={t('addButton')}
                      onPress={() => {
                        handleSubmit();
                      }}
                    />
                  </Stack>
                </Stack>
              </KeyboardAwareScrollView>
            </Animated.ScrollView>
            {assignToModal && (
              <Modal
                avoidKeyboard
                isVisible={assignToModal}
                style={styles.bottomModal}
                onBackdropPress={() => setAssignToModal(false)}>
                <View style={styles.bottomModalView}>
                  <Stack
                    horizontal
                    horizontalAlign="space-between"
                    verticalAlign="center"
                    spacing={16}>
                    <Stack>
                      <TextView weight="bold" variant={FontSizes.large}>
                        Assign to
                      </TextView>
                    </Stack>
                    <RippleIconButton
                      name="close"
                      size={22}
                      onPress={() => setAssignToModal(false)}
                    />
                  </Stack>
                  <Stack spacing={16} style={styles.attachmentView}>
                    <SearchTextField
                      showBorder
                      value={searchAssignText}
                      setSearchValue={setSearchAssignText}
                      pattern1={searchPattern1}
                      pattern2={searchPattern2}
                    />
                  </Stack>
                  {/* <ScrollView> */}
                  <Stack spacing={16}>
                    <MemberList
                      data={assignToMembersList!}
                      isSuccess={isSuccessAssignToMemberList}
                      isFetching={isFetchingAssignToMemberList}
                      onPress={val => {
                        setSelfAssigned(false);
                        onPressAssignedTo(val);
                        setFieldValue('assignTo', val?._id);
                      }}
                      onPressSelf={val => {
                        setSelfAssigned(true);
                        onPressAssignedTo(val);
                        setAssignToModal(false);
                        setFieldValue('assignTo', userData?._id);
                      }}
                      isAssignTo
                    />
                  </Stack>
                  {/* </ScrollView> */}
                </View>
              </Modal>
            )}
            {reportToModal && (
              <Modal
                avoidKeyboard
                isVisible={reportToModal}
                style={styles.bottomModal}
                onBackdropPress={() => setReportToModal(false)}>
                <View style={styles.bottomModalView}>
                  <Stack
                    horizontal
                    horizontalAlign="space-between"
                    verticalAlign="center"
                    spacing={16}>
                    <Stack>
                      <TextView weight="bold" variant={FontSizes.large}>
                        Report to
                      </TextView>
                    </Stack>
                    <RippleIconButton
                      name="close"
                      size={22}
                      onPress={() => setReportToModal(false)}
                    />
                  </Stack>
                  <Stack spacing={16} style={styles.attachmentView}>
                    <SearchTextField
                      showBorder
                      value={searchReportText}
                      setSearchValue={setSearchReportText}
                    />
                  </Stack>
                  {/* <ScrollView> */}
                  <Stack spacing={16}>
                    <MemberList
                      data={reportToMembersList!}
                      onPress={val => {
                        // setSelfReported(false);
                        onPressReportTo(val);
                        setFieldValue('reportTo', val?._id);
                      }}
                      onPressSelf={val => {
                        setSelfReported(true);
                        onPressReportTo(val);
                        setReportToModal(false);
                        setFieldValue('reportTo', userData?._id);
                      }}
                    />
                  </Stack>
                  {/* </ScrollView> */}
                </View>
              </Modal>
            )}

            {(isAllDataLoaded || isDataLoaded) && <Loader />}
            {relatedTaskModal && (
              <Modal
                avoidKeyboard
                isVisible={relatedTaskModal}
                style={styles.bottomModal}
                onBackdropPress={() => setRelatedTaskModal(false)}>
                <View style={[styles.bottomModalView, styles.bottomPadding]}>
                  <Stack
                    horizontal
                    horizontalAlign="space-between"
                    verticalAlign="center"
                    spacing={16}>
                    <Stack>
                      <TextView weight="bold" variant={FontSizes.large}>
                        Tasks
                      </TextView>
                    </Stack>
                    <RippleIconButton
                      name="close"
                      size={22}
                      onPress={() => setRelatedTaskModal(false)}
                    />
                  </Stack>
                  <Stack spacing={16} style={styles.attachmentView}>
                    <SearchTextField
                      showBorder
                      value={searchRelatedTaskText}
                      setSearchValue={setSearchRelatedTaskText}
                    />
                  </Stack>
                  {/* <ScrollView> */}
                  <Stack spacing={16}>
                    <TaskList
                      data={taskData.filter(item =>
                        item?.title.includes(searchRelatedTaskText),
                      )}
                      onPress={val => {
                        setRelatedTask(val);
                        setFieldValue('relatedTaskName', val?._id);
                        setRelatedTaskModal(false);
                      }}
                    />
                  </Stack>
                  {/* </ScrollView> */}
                </View>
              </Modal>
            )}
            {addSubtaskModal && (
              <Modal isVisible={addSubtaskModal}>
                <View>
                  <View style={styles.modalView}>
                    <IconButton
                      name="close"
                      onPress={() => setAddSubtaskModal(false)}
                      size={20}
                      color={colors.black}
                      style={styles.closeIcon}
                    />
                    <StackItem center childrenGap={20}>
                      <TextView
                        weight="medium"
                        variant={FontSizes.xMedium}
                        style={styles.shareVia}>
                        {t('addTask:AddSubtaskAlert')}
                      </TextView>
                      <PrimaryButton
                        title={t('addTask:AddSubtaskAlertButton')}
                        onPress={() => {
                          // props.navigation.navigate('AddSubTask');
                          setAddSubtaskModal(false);
                          handleSubmit();
                        }}
                        style={{width: Dimensions.get('screen').width / 1.7}}
                      />
                    </StackItem>
                  </View>
                </View>
              </Modal>
            )}
          </Container>
        );
      }}
    </Formik>
  );
};
