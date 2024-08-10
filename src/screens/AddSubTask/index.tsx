import Netinfo from '@react-native-community/netinfo';
import {StackActions} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {uploadDocument} from 'common/utils/Amazon-S3';
import {DateTimeFormats} from 'common/utils/DateTimeFormats';
import {_isIOS} from 'common/utils/PlatformCheck';
import {searchPattern1, searchPattern2} from 'common/utils/Regex';
import {showToast} from 'common/utils/ToastMessage';
import {Container, TextView} from 'components';
import Badge from 'components/Badge';
import {PrimaryButton} from 'components/Buttons';
import {DatePicker} from 'components/DatePicker';
import FileDocumentUploading from 'components/FileDocumentsUploading';
import {FormikTextField, FormikTouchableField} from 'components/formikFields';
import {FormikDatePicker} from 'components/formikFields/FormikDatePicker';
import {FormikPriorityPickerField} from 'components/formikFields/FormikPriorityPicker';
import Header from 'components/Header';
import {Icon} from 'components/Icon';
import {IconButton, RippleIconButton} from 'components/IconButtons';
import Loader from 'components/Loader';
import {membersProps} from 'components/Members/MembersItem';
import {MemberItem} from 'components/MembersList/MemberItem';
import {MemberList} from 'components/MembersList/MemberList';
import {NetworkContext} from 'components/NetworkProvider';
import {Persona} from 'components/Persona';
import {Stack, StackItem} from 'components/Stack';
import {SearchTextField} from 'components/TextField';
import {TouchableField} from 'components/TouchableField';
import {Formik, FormikProps} from 'formik';
import moment from 'moment';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {
  AssignToUsers,
  useAddSubTaskCollectionMutation,
  useLazyGetAssignToCollectionQuery,
} from 'request/AddTask';
import {useGetMasterCollectionQuery} from 'request/MasterCollection';
import {UploadedFileModal} from 'screens/AddTask';
import {SpeechToText} from 'screens/AddTask/components/SpeechToText';
import VoiceNotes from 'screens/AddTask/components/VoiceNotes';
import Waveform from 'screens/AddTask/components/Waveform';
import {AssignTaskSubtaskSchema} from 'screens/AssignTaskSubtask/utils';
import {useAppSelector} from 'store/hooks';
import {InitialValues} from './constants';
import {Styles} from './index.styles';
import {AddSubTaskProps} from './types';
import {mediaObjFormat} from 'common/utils/mediaObjFormat';

// const userImage =
//   'https://i.picsum.photos/id/1005/5760/3840.jpg?hmac=2acSJCOwz9q_dKtDZdSB-OIK1HUcwBeXco_RMMTUgfY';

type Props = NativeStackScreenProps<SignedInStackParamList, 'AddSubTask'>;
export const AddSubtaskScreen = (props: Props) => {
  const {t} = useTranslation();

  const {subTaskData} = props.route.params;
  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  // const allTitleData = [
  //   {label: 'Project', value: 'Project'},
  //   {label: 'Task', value: 'Task'},
  //   {label: 'Goal', value: 'Goal'},
  // ];

  const [assignToModal, setAssignToModal] = useState<boolean>(false);
  const [reportToModal, setReportToModal] = useState<boolean>(false);

  const [isCritical, setIsCritical] = useState<boolean>(false);
  const [searchAssignText, setSearchAssignText] = useState('');
  const [selfAssigned, setSelfAssigned] = useState<boolean>(true);
  const [assignTo, setAssignTo] = useState<membersProps>();
  const [selfReported, setSelfReported] = useState<boolean>(true);
  const [reportTo, setReportTo] = useState<membersProps>();
  const {validations} = useAppSelector(state => state?.formanagement);

  const [uploadedFiles, setUploadedFiles] = useState<
    UploadedFileModal[] | undefined
  >(undefined);
  const [uploadedDoc, setUploadedDoc] = useState<
    UploadedFileModal[] | undefined
  >(undefined);
  // const [allTitleData, setAllTitleData] = useState<DropDownModel[]>([]);
  const {data} = useGetMasterCollectionQuery();
  const {userData} = useAppSelector(state => state.formanagement);

  const [startDatePicked, setStartDatePicked] = useState<Date>();
  const [dueDatePicked, setDueDatePicked] = useState<string | undefined>();

  const [startTime, setStartTime] = useState<string>(
    moment().format(DateTimeFormats.Time),
  );
  const [dueTime, setDueTime] = useState<string>(
    moment().format(DateTimeFormats.Time),
  );
  const formikRef = useRef<FormikProps<AddSubTaskProps> | null>(null);
  const [startDateObject, setStartDateObject] = useState<string>();
  const [dueDateObject, setDueDateObject] = useState<string>();
  const {netStatus} = useContext(NetworkContext);
  const [voicePath, setVoicePath] = useState<string | undefined>();
  const [bufferData, setBufferData] = useState<number[]>([]);
  const [timeMSState, setTimeMSState] = useState(0);
  const [
    createSubTask,
    {isLoading: isLoadingCreateSubTask, isSuccess, error: CreateSubTaskError},
  ] = useAddSubTaskCollectionMutation();

  const [stateUpdater, setStateUpdater] = useState<boolean>(false);
  const [isAllDataLoaded, setIsLoading] = useState<boolean>(false);
  const [isSpeechModalOpen, setIsSpeechModalOpen] = useState(false);
  const [speechField, setSpeechField] = useState<'name' | 'description'>(
    'name',
  );
  const [assignToMembersList, setAssignToMembersList] = useState<
    membersProps[] | AssignToUsers[] | undefined
  >();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [reportToMembersList, setReportToMembersList] = useState<
    membersProps[] | AssignToUsers[] | undefined
  >();
  const [
    assignTrigger,
    {
      isLoading: assignToResponseLoading,
      isSuccess: isSuccessAssignToMemberList,
      isFetching: isFetchingAssignToMemberList,
    },
  ] = useLazyGetAssignToCollectionQuery();

  let isDataLoaded = assignToResponseLoading || isLoadingCreateSubTask;

  const setAudioStates = (
    voiceResult: string | undefined,
    voiceBuffer: number[],
    timeMS: number,
  ) => {
    setVoicePath(voiceResult);
    setBufferData(voiceBuffer);
    setTimeMSState(timeMS * 100);
  };

  const onPressAssignedTo = (val: membersProps | undefined) => {
    setSelfAssigned(false);
    setAssignTo(val);
    setAssignToModal(false);
  };

  const onPressReportTo = (val: membersProps | undefined) => {
    setSelfReported(false);
    setReportTo(val);
    setReportToModal(false);
  };

  useEffect(() => {
    // let titleData: DropDownModel[] = [];
    // data?.typeOfTask.map((item: string) =>
    //   titleData.push({
    //     label: item,
    //     value: item,
    //   }),
    // );
    // setAllTitleData(titleData);
    if (userData) {
      formikRef.current?.setFieldValue('reportTo', userData?._id);
    }
    formikRef.current?.setFieldValue('parentName', subTaskData?.title);
    formikRef.current?.setFieldValue('title', subTaskData?.type);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    setAssignToMembersList([]);
    let obj = {
      searchText: searchAssignText,
      companyId: subTaskData.company,
    };
    if (subTaskData.company) {
      assignTrigger(obj).then(res => {
        setAssignToMembersList([]);
        setAssignToMembersList(res.data);
      });
    }
  }, [assignTrigger, subTaskData, searchAssignText]);

  useEffect(() => {
    if (isSuccess) {
      showToast('Task created successfully.');

      setIsLoading(false);
      if (uploadedDoc?.length! > 0) {
        setUploadedFiles([]);
      }
      const popAction = StackActions.pop(1);
      props.navigation.dispatch(popAction);
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [CreateSubTaskError, isSuccess, props.navigation]);

  useEffect(() => {
    if (CreateSubTaskError) {
      setIsLoading(false);
      const err: any = CreateSubTaskError;
      // if (err?.error) {
      //   showToast(err.error);
      // } else {
      // err?.data?.error.map((errorItem: companyError) =>
      //   formikRef.current?.setFieldError(errorItem.param, errorItem.msg),
      // );
      showToast(err?.data?.error[0].msg);
      // }
    }
  }, [CreateSubTaskError]);

  // useEffect(() => {
  //   if (docData?.data) {
  //     const obj = {
  //       uri: docData.data?.attachment?.url,
  //       name: decodeURIComponent(docData.data?.attachment?.url)
  //         .split('/')
  //         .pop(),
  //       isUploaded: true,
  //     };
  //     setUploadedFiles([obj]);
  //     setUploadedDoc([obj]);
  //     formikRef.current?.setFieldValue('name', docData.data?.title);
  //     formikRef.current?.setFieldValue(
  //       'description',
  //       docData.data?.description,
  //     );
  //   }
  //   if (mailData) {
  //     let objArray: UploadedFileModal[] = [];
  //     mailData?.attachment?.map(mailAttachment => {
  //       const obj = {
  //         uri: mailAttachment?.url,
  //         name: decodeURIComponent(mailAttachment?.url).split('/').pop(),
  //         isUploaded: true,
  //         type: mailAttachment?.type,
  //       };
  //       objArray.push(obj);
  //       // setUploadedDoc(obj);
  //     });
  //     setUploadedFiles(objArray);
  //     setUploadedDoc([...objArray]);
  //     formikRef.current?.setFieldValue('name', mailData.subject);
  //     formikRef.current?.setFieldValue('description', mailData.body[0]);
  //   }
  // }, [docData, mailData]);

  const onSubmit = async (values: AddSubTaskProps) => {
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
          company: subTaskData.company,
          title: values.name,
          type: values.title,
          description: values.description,
          assignTo: values.assignTo,
          startDate: values.startDate,
          dueDate: values.dueDate,
          startTime: values.startTime,
          dueTime: values.dueTime,
          priority: values.priority,
          parentTask: {
            id: subTaskData.taskId,
            taskNumber: subTaskData.taskNumber,
          },
          moduleType: 'SUBTASK',
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
        // if (docData?.data) {
        //   bodyObj = {...bodyObj, documentId: docData.data._id};
        // }
        // if (mailData) {
        //   bodyObj = {...bodyObj, emailId: mailData._id};
        // }

        if (netStatus) {
          createSubTask(bodyObj);
        }
      });
    }
  };

  const chooseFile = async () => {
    let docResult;
    let addVoiceNoteResult;
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
      } else {
        showToast(t('noNetwork'));
        setIsLoading(false);
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
              name={assignTo ? undefined : t('addTask:assigneePlaceholder')}
              image={
                assignTo
                  ? userData?.profileUrl
                  : t('addTask:assigneePlaceholder')
              }
              size={38}
            />
            <Stack style={styles.view}>
              <TextView weight="medium" variant={FontSizes.regular} truncate>
                {assignTo ? undefined : t('addTask:assigneePlaceholder')}
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
  const convertDueDateUTC = (
    startDate: string | undefined,
    dueDate: string | Date,
  ) => {
    let startDatePostFix = startDate?.split('T')[0];
    let dueDatePostFix = dueDate?.split('T')[1];
    let finalDueDate = startDatePostFix + 'T' + dueDatePostFix;
    return finalDueDate;
  };

  const styles = Styles();

  const speechToTextCheckSet = (text: string) => {
    if (_isIOS) {
      let remainingCheckLength =
        speechField === 'name'
          ? validations?.taskName?.MAX!
          : validations?.taskDescription?.MAX!;
      let availableLength =
        remainingCheckLength - formikRef?.current?.values[speechField].length!;
      formikRef?.current?.setFieldValue(
        speechField,
        formikRef?.current?.values[speechField].length!
          ? formikRef?.current?.values[speechField] +
              ' ' +
              text.slice(0, availableLength - 1)
          : formikRef?.current?.values[speechField] + text.slice(0, 250),
      );
    } else {
      formikRef?.current?.setFieldValue(
        speechField,
        formikRef?.current?.values[speechField].length!
          ? formikRef?.current?.values[speechField] + ' ' + text
          : formikRef?.current?.values[speechField] + text,
      );
    }
  };

  return (
    <Formik<AddSubTaskProps>
      initialValues={InitialValues}
      innerRef={formikRef}
      validateOnMount
      onSubmit={onSubmit}
      validationSchema={AssignTaskSubtaskSchema}>
      {({handleSubmit, setFieldValue, values}) => (
        <Container noSpacing>
          <Header
            navigationType="STACK"
            label={t('homePage:addSubTask')}
            translateY={translateY}
          />
          <Animated.ScrollView
            showsVerticalScrollIndicator={false}
            keyboardDismissMode="on-drag"
            onScroll={scrollHandler}
            scrollEventThrottle={16}>
            <KeyboardAwareScrollView bounces={false} overScrollMode={'never'}>
              <Stack>
                <StackItem
                  childrenGap={26}
                  spacing={20}
                  // spaceBelow={16}
                  style={styles.spacingTilte}>
                  {/* <FormikDropdownPicker
                    options={allTitleData}
                    value={titleValue}
                    name="title"
                    onChange={(item: DropDownModel) => {
                      setTitleValue(item.value);
                    }}
                  /> */}
                  <FormikTextField
                    name="title"
                    label={t('addTask:type')}
                    placeholder={t('addTask:dropdownPlaceholder')}
                    editable={false}
                  />
                  <FormikTextField
                    name="parentName"
                    label={t('addTask:parentTitle')}
                    placeholder={t('addTask:parentTitle')}
                    maxLength={100}
                  />
                  <FormikTextField
                    name="name"
                    label={t('addTask:subtaskName')}
                    placeholder={t('addTask:subtaskName')}
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
                      RenderRightContainerDescription(values.description.length)
                    }
                    multiline
                    numberOfLines={4}
                    containerStyles={styles.containerStyles}
                    maxLength={validations?.taskDescription.MAX}
                  />
                  <TextView style={styles.headerTextColor}>
                    {t('addTask:voiceNoteSubTask')}
                  </TextView>
                  {!voicePath ? (
                    <Stack style={styles.addVoiceNoteView}>
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
                      <Waveform bufferData={bufferData} timeMS={timeMSState} />
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

                  {isSpeechModalOpen && (
                    <SpeechToText
                      close={() => setIsSpeechModalOpen(false)}
                      text={text => {
                        speechToTextCheckSet(text);
                      }}
                    />
                  )}
                  <Stack style={styles.assignView}>
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
                  </Stack>
                  <TouchableField
                    label={t('addTask:reportTo')}
                    icon={'arrow_expand_more'}
                    RenderView={RenderReportToView}
                    onPress={() => {
                      setReportToModal(true);
                    }}
                    disabled
                    disabledNoBackground
                  />
                  <Stack horizontal center horizontalAlign="space-between">
                    <View style={styles.fieldView}>
                      <FormikDatePicker
                        isValidAge={true}
                        name="startDate"
                        label={t('addTask:startDate')}
                        placeholder={DateTimeFormats.ShortMonthDateYear}
                        format={DateTimeFormats.MonthDateYear}
                        minimumDate={new Date()}
                        // value={startDatePicked}
                        onPress={value => {
                          if (
                            moment(values?.dueDate).format(
                              DateTimeFormats.DayMonthYear,
                            ) ===
                            moment(value).format(DateTimeFormats.DayMonthYear)
                          ) {
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
                            setStartTime(moment().format(DateTimeFormats.Time));

                            setFieldValue(
                              'dueTime',
                              moment().format(DateTimeFormats.Time),
                            );
                          }
                        }}
                      />
                    </View>
                    <View style={styles.fieldView}>
                      <FormikDatePicker
                        isValidAge={true}
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
                            setStartTime(moment().format(DateTimeFormats.Time));
                            setFieldValue(
                              'dueTime',
                              moment().format(DateTimeFormats.Time),
                            );
                          }
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
                        placeholder={DateTimeFormats.Time}
                        format={DateTimeFormats.Time}
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
                        placeholder={DateTimeFormats.Time}
                        format={DateTimeFormats.Time}
                        disabled
                        // selectedDate={dueDatePicked}
                        // minimumDate={new Date()}
                      />
                    </View>
                  </Stack>
                  <Stack style={styles.priorityView}>
                    <FormikPriorityPickerField name="priority" />
                  </Stack>
                  <StackItem horizontal childrenGap={10} verticalAlign="center">
                    <TouchableOpacity
                      onPress={() => {
                        setIsCritical(prevState => !prevState);
                        setFieldValue('isCritical', !isCritical);
                      }}>
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
                    </TouchableOpacity>
                    <TextView
                      weight="medium"
                      variant={FontSizes.regular}
                      style={styles.markAsCritical}>
                      {t('addTask:markAsCritical')}
                    </TextView>
                  </StackItem>
                  <Stack style={styles.priorityView}>
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
                    title={t('addButton')}
                    onPress={() => {
                      handleSubmit();
                    }}
                  />
                </Stack>
              </Stack>
            </KeyboardAwareScrollView>
          </Animated.ScrollView>

          {(isAllDataLoaded || isDataLoaded) && <Loader />}
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
                    setSearchValue={val => setSearchAssignText(val.trim())}
                    pattern1={searchPattern1}
                    pattern2={searchPattern2}
                  />
                </Stack>
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
              </View>
            </Modal>
          )}
          {reportToModal && (
            <Modal
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
                  <SearchTextField showBorder />
                </Stack>
                <Stack spacing={16}>
                  <MemberList
                    data={assignToMembersList}
                    onPress={val => {
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
              </View>
            </Modal>
          )}
        </Container>
      )}
    </Formik>
  );
};
