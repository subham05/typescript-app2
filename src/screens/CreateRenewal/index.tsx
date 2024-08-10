import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {uploadDocument} from 'common/utils/Amazon-S3';
import {showToast} from 'common/utils/ToastMessage';
import {Container, TextView} from 'components';
import Badge from 'components/Badge';
import {PrimaryButton} from 'components/Buttons';
import FileDocumentUploading from 'components/FileDocumentsUploading';
import {
  FormikDatePicker,
  FormikDropdownPicker,
  FormikTextField,
} from 'components/formikFields';
import Header from 'components/Header';
import {Icon} from 'components/Icon';
import Loader from 'components/Loader';
import {CompanyProps} from 'components/SelectCompany/CompanyListView';
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
import {useGetCompanyListQuery} from 'request/AddManager';
import {useGetMasterCollectionQuery} from 'request/MasterCollection';
import {useCreateRenewalMutation} from 'request/Renewals';
import {DropDownModel, UploadedFileModal} from 'screens/AddTask';
import {useAppSelector} from 'store/hooks';
import {InitialValues} from './contants';
import {Styles} from './index.styles';
import {AddRenewalsModel} from './types';
import {AddRenewalsSchema} from './utils';
// import Netinfo from '@react-native-community/netinfo';

type Props = NativeStackScreenProps<SignedInStackParamList, 'CreateRenewals'>;
export const CreateRenewalsScreen = (props: Props) => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const {data: masterData} = useGetMasterCollectionQuery();
  const [
    createDocument,
    {data, isLoading: isDataLoaded, isError, error, isSuccess},
  ] = useCreateRenewalMutation();

  // const [userType, setUserType] = useState<string | null | undefined>('');

  // AsyncStorage.getItem(STR_KEYS.USERTYPE).then(res => {
  //   setUserType(res);
  // });
  const formikRef = useRef<FormikProps<AddRenewalsModel> | null>(null);

  const [name, setName] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [isExpiry, setIsExpiry] = useState<boolean>(false);

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

  const [allDocumentData, setAllDocumentData] = useState<DropDownModel[]>([]);
  const [documentLabel, setDocumentLabel] = useState<string>('');
  const [stateUpdater, setStateUpdater] = useState<boolean>(false);
  const {validations} = useAppSelector(state => state?.formanagement);
  const [companyValue, setCompanyValue] = useState<string>('');
  const {data: companyResponse} = useGetCompanyListQuery();
  const [allCompanyData, setAllCompanyData] = useState<DropDownModel[]>([]);

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

  const [isLoading, setIsLoading] = useState<boolean>(false);

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
    InitialValues.expiryDate = '';
    if (!isExpiry && registrationDatePicked !== undefined) {
      setExpiryDatePicked(
        moment(registrationDatePicked).add(1, 'day').format('YYYY-MM-DD'),
      );
      InitialValues.expiryDate = moment(registrationDatePicked)
        .add(1, 'day')
        .format('YYYY-MM-DD');
    } else {
      setExpiryDatePicked(undefined);
      InitialValues.expiryDate = '';
    }
  }, [isExpiry, registrationDatePicked]);

  const onSubmit = async (values: AddRenewalsModel) => {
    setIsLoading(true);
    await chooseFile().then(res => {
      let obj: any = {
        // companyId: '617b996a23524140cd3f0540',
        companyId: values.companyId,
        name: values.name,
        documentCategory: values.type,
        title: values.type !== 'Other' ? '' : values.title,
        isNotExpiry: isExpiry,
        registrationDate: values.registrationDate,
        expiryDate: isExpiry ? '' : values.expiryDate,
        attachment: res!,
        registrationDateObject: registrationDateObject,
        expiryDateObject: expiryDateObject,
      };
      // if (values.title === '' || values.type !== 'Other') {
      //   delete obj.title;
      // }
      // setIsLoading(false);
      //**Api call here */
      createDocument(obj);
    });
  };

  useEffect(() => {
    if (isSuccess) {
      // props.navigation.navigate({name:'DocumentRepository', {}});
      showToast(data?.message);
      props.navigation.navigate({
        name: 'Renewals',
        params: {_id: data?.data?._id},
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  useEffect(() => {
    if (isError && error) {
      setIsLoading(false);
      const err: any = error;
      // if (err?.error) {
      //   showToast(err.error);
      // } else {
      err?.data?.error.map((errorItem: companyError) =>
        formikRef.current?.setFieldError(errorItem.param, errorItem.msg),
      );
      showToast(err?.data?.error[0].msg);
      // }
    }
  }, [error, isError]);

  const chooseFile = async () => {
    if (uploadedFiles?.length) {
      let docResult = await uploadDocument(
        uploadedFiles,
        `renewals/media/${moment().format('YYYYMMDDHH')}/`,
      );
      // let allFiles = [...data?.attachment, ...docResult];
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

      return allFiles;
    } else if (uploadedFiles === undefined) {
      return [];
    } else {
      return [];
    }
  };

  useEffect(() => {
    let documentData: DropDownModel[] = [];
    masterData?.documentCategory.map((item: string) =>
      documentData.push({
        label: item,
        value: item,
      }),
    );
    setAllDocumentData(documentData);
  }, [masterData]);

  const styles = Styles();
  return (
    <Formik<AddRenewalsModel>
      initialValues={InitialValues}
      validateOnMount
      innerRef={formikRef}
      onSubmit={onSubmit}
      validationSchema={AddRenewalsSchema}>
      {({handleSubmit, setFieldValue, values}) => {
        return (
          <Container noSpacing>
            <Header
              label={t('renewals:addRenewals')}
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
                    keyboardType={'email-address'}
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
                      values.expiryDate
                        ? moment(values.expiryDate, 'YYYY-MM-DD').toDate()
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
                    }}
                  />
                  <StackItem childrenGap={5}>
                    <TouchableOpacity
                      onPress={() => {
                        setIsExpiry(prevState => !prevState);
                        // if (isExpiry) {
                        //   setExpiryDatePicked(undefined);
                        //   values.expiryDate = '';
                        // }
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
                        values.registrationDate
                          ? moment(
                              values.registrationDate,
                              'YYYY-MM-DD',
                            ).toDate()
                          : undefined
                      }
                      value={expiryDatePicked}
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
                            moment(value).add(1, 'day').format('YYYY-MM-DD'),
                          );
                          setExpiryDatePicked(
                            moment(value).add(1, 'day').format('YYYY-MM-DD'),
                          );
                          setExpiryDateObject(
                            moment(value).add(1, 'day').toISOString(),
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
                  <StackItem childrenGap={10}>
                    <Stack>
                      <FileDocumentUploading
                        title={t('addTask:attach')}
                        setUploadedFileData={files => {
                          uploadedFiles?.length! < 2 ||
                          uploadedFiles?.length! === undefined
                            ? uploadFileData(files)
                            : showToast('You cannot add more than 2 file.');
                        }}
                      />
                    </Stack>
                    <Badge
                      uploadedFiles={uploadedFiles}
                      onRemove={itmIndex => {
                        uploadedFiles?.splice(itmIndex, 1);
                        setStateUpdater(!stateUpdater);
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
                      title={t('add')}
                      fontSize={FontSizes.regular}
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
            {(isLoading || isDataLoaded) && (
              <Loader message="Adding renewal..." />
            )}
            {/* {isError && showToast('Something went wrong.')} */}
          </Container>
        );
      }}
    </Formik>
  );
};
