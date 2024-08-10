import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {uploadDocument} from 'common/utils/Amazon-S3';
import {showToast} from 'common/utils/ToastMessage';
import {Container, TextView} from 'components';
import {PrimaryButton} from 'components/Buttons';
import {
  FormikDatePicker,
  FormikDropdownPicker,
  FormikTextField,
} from 'components/formikFields';
import Header from 'components/Header';
import {Icon} from 'components/Icon';
import Loader from 'components/Loader';
import {Stack, StackItem} from 'components/Stack';
import {Formik, FormikProps} from 'formik';
import moment from 'moment';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSharedValue} from 'react-native-reanimated';
import {companyError} from 'request/AddCompany';
import {useGetMasterCollectionQuery} from 'request/MasterCollection';
import {
  RenewalsData,
  useEditRenewalMutation,
  useLazyGetSingleRenewalQuery,
} from 'request/Renewals';
import {DropDownModel, UploadedFileModal} from 'screens/AddTask';
import {useAppSelector} from 'store/hooks';
import {AttachmentEditRenewals} from './components/Attachment';
import {InitialValues} from './contants';
import {Styles} from './index.styles';
import {AddRenewalsModel} from './types';
import {AddRenewalsSchema} from './utils';
import Netinfo from '@react-native-community/netinfo';
import {Attachment} from 'request/ManageTask';
import {useGetCompanyListQuery} from 'request/AddManager';
import {CompanyProps} from 'components/SelectCompany/CompanyListView';

type Props = NativeStackScreenProps<SignedInStackParamList, 'EditRenewals'>;
export const EditRenewalsScreen = (props: Props) => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const {data: masterData} = useGetMasterCollectionQuery();
  const [
    trigger,
    {
      currentData: myDocumentData,
      // error: myDocumentError,
      // isError: isDocumentError,
      isLoading: isDocumentLoading,
      // isSuccess: isDocumentSuccess,
    },
  ] = useLazyGetSingleRenewalQuery();

  const [
    editDocument,
    {data: documentData, isLoading: isDataLoaded, isError, error, isSuccess},
  ] = useEditRenewalMutation();

  // const [userType, setUserType] = useState<string | null | undefined>('');

  // AsyncStorage.getItem(STR_KEYS.USERTYPE).then(res => {
  //   setUserType(res);
  // });

  const formikRef = useRef<FormikProps<AddRenewalsModel> | undefined>();
  const [data, setData] = useState<RenewalsData>();
  // const [attachmentData, setAttachmentData] = useState<any[]>();
  const [title, setTitle] = useState<string>('');
  const [isExpiry, setIsExpiry] = useState<boolean>(false);

  const [name, setName] = useState<string>('');
  const [registrationDatePicked, setRegistrationDatePicked] = useState<
    string | undefined
  >();
  const [expiryDatePicked, setExpiryDatePicked] = useState<
    string | undefined
  >();
  const [registrationDateObject, setRegistrationDateObject] = useState<
    string | undefined
  >();
  const [expiryDateObject, setExpiryDateObject] = useState<
    string | undefined
  >();
  const [uploadedFiles, setUploadedFiles] = useState<
    UploadedFileModal[] | undefined
  >(undefined);

  const [removedData, setRemovedData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [allDocumentData, setAllDocumentData] = useState<DropDownModel[]>([]);
  const [documentLabel, setDocumentLabel] = useState<string>('');
  const {validations} = useAppSelector(state => state?.formanagement);

  const [companyValue, setCompanyValue] = useState<string>('');
  const {data: companyResponse, isLoading: getCompanyLoading} =
    useGetCompanyListQuery();
  const [allCompanyData, setAllCompanyData] = useState<DropDownModel[]>([]);

  useEffect(() => {
    if (props.route.params.id) {
      trigger(props.route.params.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.route.params.id]);

  useEffect(() => {
    setData(myDocumentData?.data);
    // setAttachmentData(myDocumentData?.data.attachment!);
    setName(myDocumentData?.data.name!);
    setIsExpiry(myDocumentData?.data.isNotExpiry!);
    setTitle(myDocumentData?.data.title!);
  }, [myDocumentData?.data]);

  useEffect(() => {
    // InitialValues.expiryDate = '';
    if (!isExpiry && registrationDatePicked !== undefined) {
      if (!data?.expiryDate) {
        setExpiryDatePicked(
          moment(registrationDatePicked).add(1, 'day').format('YYYY-MM-DD'),
        );
        InitialValues.expiryDate = moment(registrationDatePicked)
          .add(1, 'day')
          .format('YYYY-MM-DD');
      }
    } else {
      setExpiryDatePicked(undefined);
      InitialValues.expiryDate = '';
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpiry, registrationDatePicked]);

  useEffect(() => {
    // setName(data?.name!);
    InitialValues.name = data?.name!;
    InitialValues.registrationDate = data?.registrationDate!;
    InitialValues.expiryDate = data?.expiryDate!;
    InitialValues.type = data?.documentCategory!;
    InitialValues.title = data?.title!;
    InitialValues.companyId = data?.companyId._id!;
    setRegistrationDatePicked(data?.registrationDate!);
    setExpiryDatePicked(data?.expiryDate!);
    setRegistrationDateObject(data?.registrationDateObject!);
    setExpiryDateObject(data?.expiryDateObject!);
  }, [data]);

  // useEffect(() => {
  //   setData(prev => ({
  //     ...prev!,
  //     attachment: attachmentData!,
  //   }));
  // }, [attachmentData]);

  const onSubmit = async (values: AddRenewalsModel) => {
    setIsLoading(true);

    await chooseFile().then(res => {
      let obj = {
        companyId: values.companyId,
        name: values.name,
        documentCategory: values.type,
        title: values.type !== 'Other' ? '' : values.title,
        isNotExpiry: isExpiry,
        registrationDate: values.registrationDate,
        expiryDate: isExpiry ? '' : values.expiryDate,
        attachment: res!,
        deletedAttachments: removedData,
        registrationDateObject: registrationDateObject,
        expiryDateObject: expiryDateObject,
        // deletedAttachments: removedData,
      };
      // if (values.title === '' || values.type !== 'Other') {
      //   delete obj.title;
      // }
      let bodyObj = {
        id: props.route.params.id,
        data: obj,
      };
      console.log('body', bodyObj);
      // setIsLoading(false);
      // //**Api call here */
      editDocument(bodyObj);
    });
  };

  const chooseFile = async () => {
    let finalFiles: Attachment[] | undefined = [];
    await Netinfo.fetch().then(async state => {
      if (state.isConnected) {
        if (uploadedFiles?.length) {
          let docResult = await uploadDocument(
            uploadedFiles,
            `renewals/media/${moment().format('YYYYMMDDHH')}/`,
          );
          let allFiles: any[] = [];
          docResult.map((item, index) => {
            allFiles.push({
              url: item,
              type: uploadedFiles?.[index].type?.split('/')[0],
              renewalsFileExt: decodeURIComponent(uploadedFiles?.[index].name!)
                .split('.')
                .pop(),
              renewalsFileName: uploadedFiles?.[index].name,
            });
          });

          if (typeof data?.attachment[0] !== 'string') {
            finalFiles = [...data?.attachment, ...allFiles];
          } else {
            finalFiles = [...allFiles];
          }
          // return finalFiles;
        } else if (uploadedFiles === undefined) {
          finalFiles = data?.attachment;
          // return finalFiles;
        }
        // else {
        //   return finalFiles;
        // }
      } else {
        showToast(t('noNetwork'));
        setIsLoading(false);
      }
    });
    return finalFiles;
  };

  useEffect(() => {
    if (isSuccess) {
      // props.navigation.navigate({name:'DocumentRepository', {}});
      showToast(documentData?.message);
      props.navigation.navigate({
        name: 'Renewals',
        params: {_id: props.route.params.id},
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  useEffect(() => {
    if (isError && error) {
      setIsLoading(false);
      const err: any = error;
      err?.data?.error.map((errorItem: companyError) =>
        formikRef.current?.setFieldError(errorItem.param, errorItem.msg),
      );
      showToast(err?.data?.error[0].msg);
    }
  }, [error, isError]);

  useEffect(() => {
    let dropdownData: DropDownModel[] = [];
    masterData?.documentCategory.map((item: string) =>
      dropdownData.push({
        label: item,
        value: item,
      }),
    );
    setAllDocumentData(dropdownData);
    setDocumentLabel(myDocumentData?.data.documentCategory!);
  }, [masterData, myDocumentData?.data.documentCategory]);

  useEffect(() => {
    if (companyResponse) {
      let companyData: DropDownModel[] = [];
      companyResponse.map((item: CompanyProps) =>
        companyData.push({
          label: item.name,
          value: `${item._id}`,
        }),
      );
      setAllCompanyData(companyData);
    }
  }, [companyResponse]);

  useEffect(() => {
    if (allCompanyData && allCompanyData.length) {
      setCompanyValue(myDocumentData?.data.companyId.name!);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allCompanyData]);

  const styles = Styles();

  return (
    <Formik<AddRenewalsModel>
      initialValues={InitialValues}
      validateOnMount
      onSubmit={onSubmit}
      innerRef={formikRef}
      validationSchema={AddRenewalsSchema}>
      {({handleSubmit, setFieldValue, values}) => {
        return (
          <Container noSpacing>
            <Header
              label={t('renewals:editDocument')}
              navigationType="STACK"
              translateY={translateY}
            />
            <Stack style={styles.flex}>
              <KeyboardAwareScrollView
                contentContainerStyle={styles.scrollView}>
                <StackItem
                  childrenGap={16}
                  spacing={16}
                  spaceBelow={16}
                  style={styles.flexOne}>
                  <FormikDropdownPicker
                    options={allCompanyData}
                    value={companyValue}
                    label={t('renewals:company')}
                    name="companyId"
                    onSelect={item => {
                      setCompanyValue(item.label);
                      setFieldValue('companyId', item.value);
                    }}
                    placeholder={t('renewals:selectCompany')}
                  />
                  <FormikTextField
                    name="name"
                    label={t('renewals:name')}
                    placeholder={t('renewals:name')}
                    placeholderTextColor={colors.grey_005}
                    onChangeText={setName}
                    value={name}
                    maxLength={validations?.renewalName.MAX}
                  />
                  <FormikDropdownPicker
                    label={t('renewals:type')}
                    options={allDocumentData}
                    value={documentLabel}
                    name="type"
                    onSelect={val => {
                      //setTitleValue(val.value);
                      setDocumentLabel(val.label);
                    }}
                    placeholder={t('renewals:typePlaceholder')}
                  />
                  {values.type === 'Other' && (
                    <FormikTextField
                      name="title"
                      label={t('renewals:title')}
                      placeholder={t('renewals:title')}
                      placeholderTextColor={colors.grey_005}
                      onChangeText={setTitle}
                      value={title}
                      maxLength={validations?.renewalTitle.MAX}
                    />
                  )}
                  <FormikDatePicker
                    name="registrationDate"
                    label={t('renewals:registrationDate')}
                    placeholder={'YYYY-MM-DD'}
                    format={'YYYY-MM-DD'}
                    maximumDate={
                      expiryDatePicked
                        ? moment(expiryDatePicked, 'YYYY-MM-DD').toDate()
                        : undefined
                    }
                    value={registrationDatePicked}
                    onPress={value => {
                      if (
                        values.expiryDate === moment(value).format('YYYY-MM-DD')
                      ) {
                        showToast(
                          'Registration date and expiry date should not be same.',
                        );
                        if (!isExpiry) {
                          setFieldValue(
                            'expiryDate',
                            moment(value).add(1, 'day').format('YYYY-MM-DD'),
                          );
                          setExpiryDatePicked(
                            moment(value).add(1, 'day').format('YYYY-MM-DD'),
                          );
                          setExpiryDateObject(
                            moment(value).add(1, 'day').toISOString(),
                          );
                        }
                        setFieldValue(
                          'registrationDate',
                          moment(value).format('YYYY-MM-DD'),
                        );
                        setRegistrationDatePicked(
                          moment(value).format('YYYY-MM-DD'),
                        );
                        setRegistrationDateObject(moment(value).toISOString());
                      } else {
                        setFieldValue(
                          'registrationDate',
                          moment(value).format('YYYY-MM-DD'),
                        );
                        setRegistrationDatePicked(
                          moment(value).format('YYYY-MM-DD'),
                        );
                        setRegistrationDateObject(moment(value).toISOString());
                        if (!isExpiry) {
                          setFieldValue(
                            'expiryDate',
                            moment(value).add(1, 'day').format('YYYY-MM-DD'),
                          );
                          setExpiryDatePicked(
                            moment(value).add(1, 'day').format('YYYY-MM-DD'),
                          );
                          setExpiryDateObject(
                            moment(value).add(1, 'day').toISOString(),
                          );
                        }
                      }
                    }}
                  />
                  <StackItem childrenGap={5}>
                    <TouchableOpacity
                      onPress={() => {
                        setIsExpiry(prevState => !prevState);
                        // setExpiryDatePicked(undefined);
                        // values.expiryDate = '';
                      }}>
                      <StackItem
                        horizontal
                        childrenGap={10}
                        verticalAlign="center">
                        {isExpiry ? (
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
                          style={{color: colors.primary}}>
                          This document has no expiry.
                        </TextView>
                      </StackItem>
                    </TouchableOpacity>
                    <FormikDatePicker
                      name="expiryDate"
                      label={t('renewals:expiryDate')}
                      placeholder={isExpiry ? 'NA' : 'YYYY-MM-DD'}
                      disabled={isExpiry}
                      format={'YYYY-MM-DD'}
                      minimumDate={
                        registrationDatePicked
                          ? moment(
                              registrationDatePicked,
                              'YYYY-MM-DD',
                            ).toDate()
                          : undefined
                      }
                      value={isExpiry ? 'NA' : expiryDatePicked}
                      onPress={value => {
                        if (
                          values.registrationDate ===
                          moment(value).format('YYYY-MM-DD')
                        ) {
                          showToast(
                            'Registration date and expiry date should not be same.',
                          );
                          setFieldValue(
                            'expiryDate',
                            moment(values.registrationDate)
                              .add(1, 'day')
                              .format('YYYY-MM-DD'),
                          );
                          setExpiryDatePicked(
                            moment(value).add(1, 'day').format('YYYY-MM-DD'),
                          );
                          setExpiryDateObject(
                            moment(value).add(1, 'day').toISOString(),
                          );
                          setRegistrationDatePicked(
                            moment(values.registrationDate).format(
                              'YYYY-MM-DD',
                            ),
                          );
                          setRegistrationDateObject(
                            moment(value).toISOString(),
                          );
                        } else {
                          setFieldValue(
                            'expiryDate',
                            moment(value).format('YYYY-MM-DD'),
                          );
                          setExpiryDatePicked(
                            moment(value).format('YYYY-MM-DD'),
                          );
                          setExpiryDateObject(moment(value).toISOString());
                        }
                      }}
                    />
                  </StackItem>
                  <StackItem childrenGap={5}>
                    <TextView
                      variant={FontSizes.regular}
                      style={{color: colors.primary_003}}>
                      {t('renewals:attachment')}
                    </TextView>
                    <AttachmentEditRenewals
                      attachments={data?.attachment!}
                      onAttachedFile={value => {
                        value?.map(item => {
                          if (item.type) {
                            setUploadedFiles(value);
                          }
                        });
                      }}
                      filesRemoved={value => {
                        setRemovedData(value);
                      }}
                      onRemovedFile={value => {
                        setData(prev => ({
                          ...prev!,
                          attachment: value!,
                        }));
                      }}
                    />
                  </StackItem>
                </StackItem>

                <Stack style={styles.saveButtonStack}>
                  <Stack
                    spacing={16}
                    horizontal
                    horizontalAlign="center"
                    center>
                    <PrimaryButton
                      title={t('update')}
                      fontSize={FontSizes.small}
                      onPress={() => {
                        // props.navigation.goBack();
                        handleSubmit();
                      }}
                      style={styles.addMoreButton}
                    />
                  </Stack>
                </Stack>
              </KeyboardAwareScrollView>
            </Stack>

            {/* <Stack style={styles.shareButton}>
        <PrimaryButton
          title={t('document:assign')}
          onPress={() => props.navigation.navigate('AddTask', {subTask: true})}
          // onPress={() =>
          //   props.navigation.navigate(
          //     userType !== userTypes.Manager ? 'AssignTask' : 'AssignTask',
          //   )
          // }
        />
      </Stack> */}
            {(isLoading ||
              isDataLoaded ||
              isDocumentLoading ||
              getCompanyLoading) && <Loader />}
            {/* {isError && showToast()}  */}
          </Container>
        );
      }}
    </Formik>
  );
};
