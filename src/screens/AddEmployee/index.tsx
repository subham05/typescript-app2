import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {getUploadDocument} from 'common/utils/Amazon-S3';
import {takeLocationPermission} from 'common/utils/LocationPermission';
import {AlertPermission} from 'common/utils/permission/Alert';
import {
  checkGalleryPermission,
  getGalleryPermission,
} from 'common/utils/permission/ReadGallery';
import {showToast} from 'common/utils/ToastMessage';
import {Container, TextView} from 'components';
import {DefaultButton, PrimaryButton} from 'components/Buttons';
import {
  FormikDropdownPicker,
  FormikTextField,
  FormikTouchableField,
} from 'components/formikFields';
import {FormikDatePicker} from 'components/formikFields/FormikDatePicker';
import {FormikPhoneField} from 'components/formikFields/FormikPhoneField';
import {locationModal} from 'components/GooglePlaces';
import Header from 'components/Header';
import {Icon} from 'components/Icon';
import Loader from 'components/Loader';
import {MenuModel, PopupMenu} from 'components/PopupMenu';
import {RadioButton} from 'components/RadioButton';
// import {CompanyProps} from 'components/SelectCompany/CompanyListView';
import {Stack, StackItem} from 'components/Stack';
import {Formik, FormikProps} from 'formik';
import moment from 'moment';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Image, Platform, TouchableOpacity, View} from 'react-native';
import {GooglePlaceData} from 'react-native-google-places-autocomplete';
import {
  Asset,
  ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker';
import ImageView from 'react-native-image-viewing';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {companyError} from 'request/AddCompany';
// import {DropDownModel} from 'screens/AddTask';
import DeleteModal from 'components/DeleteModal';
import {membersProps} from 'components/Members/MembersItem';
import {NetworkContext} from 'components/NetworkProvider';
import {RenderReportToView} from 'components/ReportToView';
import {CompanyProps} from 'components/SelectCompany/CompanyListView';
import UploadGallery from 'components/UploadGallery';
import {CountryCode} from 'react-native-country-picker-modal';
import DeviceInfo from 'react-native-device-info';
import {ImageSource} from 'react-native-image-viewing/dist/@types';
import {
  useDeleteEmployeeMutation,
  useEditEmployeeMutation,
  useSetEmployeeMutation,
} from 'request/AddEmployee';
import {useGetCompanyListQuery} from 'request/AddManager';
import {ReportToResponseList} from 'request/AddManager/ReportToResponseData';
import {DropDownModel} from 'screens/AddTask';
import {useAppSelector} from 'store/hooks';
import {ResidenceAddress} from './components/ResidenceAddress';
import {WorkAddress} from './components/WorkAddress';
import {
  CreateRequestObj,
  InitialValues,
  onSelectLocation,
  resetData,
  setManagerFormData,
} from './constants';
import {Styles} from './index.styles';
import {AddEmployeeFormModel} from './types';
import {AddEmployeeSchema} from './utils';
import {userTypes} from 'common/users/userTypes';

export const genderData = [
  {id: 1, value: 'Male'},
  {id: 2, value: 'Female'},
];

export interface ProfileImageDetailsObj {
  url: string | unknown;
  type: string | undefined;
  profileFileName: string | undefined;
  profileFileExt: string | undefined;
}

type Props = NativeStackScreenProps<SignedInStackParamList, 'AddEmployee'>;
export const AddEmployee = (props: Props) => {
  const {t} = useTranslation();
  const {route} = {...props};
  const {edit, managerDetailData} = {...route.params};
  const translateY = useSharedValue(0);
  const {netStatus} = useContext(NetworkContext);
  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  const [companyValue, setCompanyValue] = useState<string>('Google');
  const [reset, setReset] = useState<boolean>(false);
  const formikRef = useRef<FormikProps<AddEmployeeFormModel> | null>(null);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [swipeModal, setSwipeModal] = useState<boolean>(false);
  const [isSubmitClicked, setIsSubmitClicked] = useState<boolean>(false);
  const [imageData, setImageData] = useState<ImageSource[]>([]);
  const [visible, setIsVisible] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);
  const [companyLogo, setCompanyLogo] = useState<Asset>();
  const [companyLogoEdit, setCompanyLogoEdit] = useState<Asset>();
  const [selectedHrCountry, setSelectedHrCountry] = useState<CountryCode>(
    edit ? managerDetailData?.hrMobileShortCode! : 'IN',
  );
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(
    edit ? managerDetailData?.login?.mobileShortCode! : 'IN',
  );
  const [selectedAltCountry, setSelectedAltCountry] = useState<CountryCode>(
    edit ? managerDetailData?.alternateMobileShortCode! || 'IN' : 'IN',
  );
  const [allCompanyData, setAllCompanyData] = useState<DropDownModel[]>([]);
  const locationModalRef = useRef<locationModal>();
  const locationWorkModalRef = useRef<locationModal>();
  const {validations} = useAppSelector(state => state?.formanagement);
  const [isValidAge, setIsValidAge] = useState(false);
  const [reportToModal, setReportToModal] = useState<boolean>(false);
  const [reportTo, setReportTo] = useState<
    membersProps | ReportToResponseList
  >();
  const [reportToMembersList, setReportToMembersList] = useState<
    membersProps[] | ReportToResponseList[] | undefined
  >();
  const {data: companyResponse} = useGetCompanyListQuery();
  const [addEmployee, {isSuccess, isError, error, data}] =
    useSetEmployeeMutation();
  const [
    editEmployee,
    {
      isSuccess: employeeSuccess,
      isError: employeeIsError,
      error: employeeError,
      data: employeeData,
    },
  ] = useEditEmployeeMutation();
  const [
    deleteEmployee,
    {
      isSuccess: deleteEmployeeSuccess,
      data: deleteEmployeeData,
      error: deleteEmployeeError,
      isLoading: deleteEmployeeIsLoading,
    },
  ] = useDeleteEmployeeMutation();

  useEffect(() => {
    if (edit) {
      setManagerFormData(managerDetailData!, formikRef);
      setCompanyValue(managerDetailData?.company![0]?.name!);
      setSelectedCountry(managerDetailData?.login?.mobileShortCode!);
      setSelectedHrCountry(managerDetailData?.hrMobileShortCode!);
      setSelectedAltCountry(
        managerDetailData?.alternateMobileShortCode! || 'IN',
      );
      setReportTo({
        _id: managerDetailData?.reportTo?.id!,
        name: managerDetailData?.reportTo?.name!,
        role: managerDetailData?.reportTo?.role!,
        profileUrl: managerDetailData?.reportTo?.profileUrl!,
      });
      imageData?.push({uri: managerDetailData?.profileUrl});
      setImageData([...imageData]);
      const residentialLocation = {
        lat: managerDetailData?.residenceAddress?.latitude,
        lng: managerDetailData?.residenceAddress?.longitude,
      };
      const workAddressLocation = {
        lat: managerDetailData?.workAddress?.latitude,
        lng: managerDetailData?.workAddress?.longitude,
      };
      locationModalRef.current = residentialLocation;
      locationWorkModalRef.current = workAddressLocation;
    }
    return () => {
      resetStateData();
      setLoader(false);
      closeCompanyLogo();
      setSwipeModal(false);
      setCompanyValue('');
      InitialValues.company = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      (isError && error) ||
      deleteEmployeeError ||
      (employeeIsError && employeeError)
    ) {
      setLoader(false);
      const err: any = error || deleteEmployeeError || employeeError;
      if (err?.error) {
        showToast(err.error);
      } else {
        err?.data?.error
          ? err?.data?.error?.map((errorItem: companyError) =>
              errorItem.param === 'residenceAddress.zipCode'
                ? formikRef.current?.setFieldError(
                    'zipcode',
                    t('addManager:zipcodeError_2'),
                  )
                : errorItem.param === 'workAddress.zipCode'
                ? formikRef.current?.setFieldError(
                    'workZipcode',
                    t('addManager:zipcodeError_2'),
                  )
                : formikRef.current?.setFieldError(
                    errorItem.param,
                    errorItem.msg,
                  ),
            )
          : showToast(err?.data?.message);
      }
    } else if (
      (isSuccess && data?.message) ||
      (employeeSuccess && employeeData?.message)
    ) {
      setLoader(false);
      edit ? showToast(employeeData?.message) : showToast(data?.message);
      isSubmitClicked ? props.navigation.goBack() : null;
      resetStateData();
      setCompanyValue(allCompanyData![0]?.label);
      InitialValues.company = allCompanyData![0]?.value;
    } else if (deleteEmployeeSuccess && deleteEmployeeData) {
      const {message} = deleteEmployeeData;
      setLoader(false);
      showToast(message);
      props.navigation.pop(2);
    } else if (companyResponse) {
      let companyData: DropDownModel[] = [];
      companyResponse.map((item: CompanyProps) =>
        companyData.push({
          label: item.name,
          value: `${item._id}`,
        }),
      );
      setAllCompanyData(companyData);
      setCompanyValue(companyData![0]?.label);
      InitialValues.company = companyData![0]?.value;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    data,
    error,
    isSuccess,
    companyResponse,
    deleteEmployeeSuccess,
    deleteEmployeeError,
    employeeIsError,
    employeeError,
    employeeData,
  ]);

  const resetStateData = () => {
    resetData();
    locationModalRef.current = {lat: undefined, lng: undefined};
    locationWorkModalRef.current = {lat: undefined, lng: undefined};
    setReset(true);
    closeCompanyLogo();
    setIsSubmitClicked(false);
    formikRef.current?.resetForm();
  };
  const takePermissionGallery = () => {
    checkGalleryPermission().then(res => {
      if (!res.isPermissionGranted) {
        if (res.result === 'denied') {
          getGalleryPermission().then(resp => {
            (resp.statuses['android.permission.READ_EXTERNAL_STORAGE'] ===
              'blocked' ||
              resp.statuses['ios.permission.PHOTO_LIBRARY'] === 'blocked') &&
              AlertPermission(t('permissions:gallery'));
            resp.isPermissionGranted && chooseFileGallery();
          });
        } else if (res.result === 'blocked') {
          AlertPermission(t('permissions:gallery'));
        }
      } else {
        chooseFileGallery();
      }
    });
  };

  const chooseFileGallery = () => {
    if (true) {
      let option: ImageLibraryOptions = {
        mediaType: 'photo',
      };
      launchImageLibrary(option, response => {
        if (response.didCancel) {
          closePanel();
        } else {
          const {assets} = response;
          if (
            [
              'image/jpeg',
              'image/jpg',
              'image/png',
              'image/heic',
              'image/heif',
            ].includes(assets![0]?.type!)
          ) {
            edit
              ? setCompanyLogoEdit({...assets![0]})
              : setCompanyLogo({...assets![0]});
            imageData?.push({uri: assets![0].uri});
            setImageData([...imageData]);
          } else {
            showToast(t('addManager:imageError'));
          }
          closePanel();
        }
      });
    }
  };

  const onSubmit = async (employeeValues: AddEmployeeFormModel) => {
    setLoader(true);
    let addCompanyLogo;
    let profileImageDetails: ProfileImageDetailsObj | undefined =
      managerDetailData?.profileImageDetails;
    if ((companyLogo || companyLogoEdit) && imageData.length > 0) {
      addCompanyLogo = await getUploadDocument(
        edit ? companyLogoEdit : companyLogo,
        `addEmployee${moment().format()}`,
      );
      profileImageDetails = {
        url: addCompanyLogo,
        profileFileExt: edit
          ? decodeURIComponent(companyLogoEdit?.fileName!).split('.').pop()!
          : decodeURIComponent(companyLogo?.fileName!).split('.').pop()!,
        profileFileName: edit
          ? companyLogoEdit?.fileName
          : companyLogo?.fileName,
        type: edit ? companyLogoEdit?.type : companyLogo?.type,
      };
    }
    const countryCode = employeeValues.countryCode
      ? employeeValues.countryCode
      : '91';
    const alternateCountryCode = employeeValues.alternateMobile
      ? employeeValues.alternateMobileCountryCode
        ? employeeValues.alternateMobileCountryCode
        : '91'
      : '';
    const HRcountryCode = employeeValues.hrMobile
      ? employeeValues.hrMobileCountryCode
        ? employeeValues.hrMobileCountryCode
        : '91'
      : '';
    const requestObj = CreateRequestObj(
      employeeValues,
      imageData.length > 0 && !companyLogo && !companyLogoEdit
        ? managerDetailData?.profileUrl
        : addCompanyLogo,
      countryCode,
      alternateCountryCode,
      HRcountryCode,
      locationModalRef,
      locationWorkModalRef,
      selectedCountry,
      selectedAltCountry,
      selectedHrCountry,
      imageData.length > 0 && !companyLogo && !companyLogoEdit
        ? managerDetailData?.profileImageDetails
        : profileImageDetails,
      reportTo as ReportToResponseList,
    );

    if (netStatus) {
      edit
        ? editEmployee({
            employeeObj: requestObj,
            employeeId: managerDetailData?._id,
          })
        : addEmployee({employeeObj: requestObj});
    } else {
      showToast('No Network, please try again');
      setLoader(false);
    }
  };

  const menuData: MenuModel[] = [
    {
      name: t('delete'),
      onClick: () => {
        setDeleteModal(true);
      },
    },
  ];
  const renderLeftContainer = () => {
    return (
      <PopupMenu
        data={menuData}
        menuStyle={styles.moreIcon}
        width={100}
        height={62}
      />
    );
  };
  const onDobChange = (value: Date) => {
    const todaysDate = new Date();
    const diff = moment.duration(Number(todaysDate) - Number(value)).years();
    const getDate = moment().format('DD');
    const getSelectedDate = moment(value).format('DD');
    const getMonth = moment().format('MM');
    const getSelectedMonth = moment(value).format('MM');
    const getYearsDiff =
      Number(moment().format('YYYY')) - Number(moment(value).format('YYYY'));
    if (
      diff >= 18 ||
      (getYearsDiff >= 18 &&
        getDate === getSelectedDate &&
        getMonth === getSelectedMonth)
    ) {
      setIsValidAge(true);
      InitialValues.dob = moment(value).format('YYYY-MM-DD');
    } else {
      setIsValidAge(false);
      setReset(false);
      showToast(t('addManager:ageAlert'));
      formikRef.current?.setFieldValue('dob', '');
      InitialValues.dob = '';
      setReset(true);
    }
  };

  const onSelectPlace = (
    value: GooglePlaceData | undefined,
    location: locationModal,
    currentLocation: string | undefined,
    pinCode?: string,
    isWorkAddressClicked?: boolean,
    country_short?: string,
  ) => {
    isWorkAddressClicked &&
      formikRef.current?.setFieldValue('countryShort', country_short);
    onSelectLocation(
      isWorkAddressClicked!,
      value,
      location,
      currentLocation,
      pinCode,
      formikRef,
    );
    isWorkAddressClicked
      ? (locationWorkModalRef.current = location)
      : (locationModalRef.current = location);
  };
  const onDeleteClick = () => {
    deleteEmployee(managerDetailData?._id!);
    setDeleteModal(false);
  };
  const closePanel = () => setSwipeModal(false);
  const closeCompanyLogo = () => {
    setCompanyLogo(undefined);
    setImageData([]);
    setCompanyLogoEdit(undefined);
  };
  const showAlert = () => AlertPermission(t('permissions:location'));
  const openModal = (isWorkAddressClicked: boolean) => {
    props.navigation.navigate('GooglePlaces', {
      onSelect: onSelectPlace,
      isWorkAddressClick: isWorkAddressClicked,
    });
  };

  const styles = Styles();
  return (
    <Formik<AddEmployeeFormModel>
      initialValues={InitialValues}
      validateOnMount
      innerRef={formikRef}
      onSubmit={onSubmit}
      validationSchema={AddEmployeeSchema}>
      {({handleSubmit, setFieldValue, values}) => {
        const addMore = () => {
          setIsSubmitClicked(false);
          handleSubmit();
        };
        const onSave = () => {
          setIsSubmitClicked(true);
          handleSubmit();
        };
        return (
          <Container noSpacing>
            <Header
              navigationType="STACK"
              label={edit ? t('addEmployee:edit') : t('homePage:addEmployee')}
              translateY={translateY}
              RenderLeftContainer={edit ? renderLeftContainer : undefined}
            />
            <Animated.ScrollView
              showsVerticalScrollIndicator={false}
              keyboardDismissMode="on-drag"
              onScroll={scrollHandler}
              scrollEventThrottle={16}>
              <KeyboardAwareScrollView bounces={false} overScrollMode={'never'}>
                <Stack>
                  <StackItem childrenGap={20} spacing={16} spaceBelow={16}>
                    <FormikDropdownPicker
                      options={allCompanyData}
                      value={companyValue}
                      name="company"
                      onSelect={item => {
                        setCompanyValue(item.label);
                        InitialValues.company = item.value;
                      }}
                      placeholder={t('addEmployee:dropdownPlaceholder')}
                      disabled
                    />
                    <FormikTextField
                      name="name"
                      value={InitialValues.name}
                      label={t('addEmployee:name')}
                      placeholder={t('addEmployee:name')}
                      keyboardType={'email-address'}
                      onChangeInput={value => (InitialValues.name = value)}
                      autoComplete={'off'}
                      maxLength={validations?.nameLength.MAX}
                    />
                    <Stack>
                      <RadioButton
                        data={genderData}
                        value={InitialValues.gender}
                        onSelect={value => (InitialValues.gender = value)}
                      />
                    </Stack>
                    <FormikDatePicker
                      name="dob"
                      label={t('managersHomePage:dob')}
                      value={InitialValues.dob}
                      resetValues={reset}
                      placeholder={'YYYY-MM-DD'}
                      format={'YYYY-MM-DD'}
                      onPress={onDobChange}
                      isValidAge={isValidAge}
                      ageCheck={true}
                      // minimumDate={new Date()}
                    />
                    <FormikTextField
                      name="designation"
                      value={InitialValues.designation}
                      label={t('addManager:designation')}
                      placeholder={t('addManager:designation')}
                      onChangeInput={value =>
                        (InitialValues.designation = value)
                      }
                      keyboardType={'email-address'}
                      autoComplete={'off'}
                      maxLength={validations?.designationLength.MAX}
                    />
                    <FormikTextField
                      name="department"
                      value={InitialValues.department}
                      label={t('addManager:department')}
                      placeholder={t('addManager:department')}
                      onChangeInput={value =>
                        (InitialValues.department = value)
                      }
                      keyboardType={'email-address'}
                      autoComplete={'off'}
                      maxLength={validations?.departmentLength.MAX}
                    />
                    <FormikTouchableField
                      label={t('addTask:reportTo')}
                      icon={'arrow_expand_more'}
                      RenderView={() => (
                        <RenderReportToView
                          role={userTypes.Employee.toUpperCase()}
                          companyValue={[values.company!]}
                          reportTo={reportTo}
                          setReportTo={setReportTo}
                          reportToModal={reportToModal}
                          setReportToModal={setReportToModal}
                          setFieldValue={setFieldValue}
                          reportToData={reportToMembersList}
                          onReportToResult={setReportToMembersList}
                        />
                      )}
                      onPress={() => setReportToModal(true)}
                      data={reportTo}
                      name={'reportTo'}
                    />
                    <FormikPhoneField
                      // ref={phoneInput}
                      label={t('addManager:contactNumber')}
                      value={InitialValues.mobile}
                      placeholder={t('addManager:contactNumberPlaceHolder')}
                      defaultCode={selectedCountry}
                      layout="second"
                      resetValues={reset}
                      containerStyle={styles.contactContainerStyle}
                      onChangeCountry={country => {
                        setSelectedCountry(country.cca2);
                        setFieldValue(
                          'countryCode',
                          `${country.callingCode[0]}`,
                        );
                      }}
                      name="mobile"
                      onChangeInput={value => {
                        setReset(false);
                        InitialValues.mobile = value;
                      }}
                    />
                    <FormikPhoneField
                      // ref={phoneInput}
                      label={t('addManager:alternate_contactNumber')}
                      value={InitialValues.alternateMobile}
                      placeholder={t('addManager:contactNumberPlaceHolder')}
                      defaultCode={selectedAltCountry}
                      layout="second"
                      resetValues={reset}
                      containerStyle={styles.contactContainerStyle}
                      onChangeCountry={country => {
                        setSelectedAltCountry(country.cca2);
                        setFieldValue(
                          'alternateMobileCountryCode',
                          `${country.callingCode[0]}`,
                        );
                      }}
                      name="alternateMobile"
                      onChangeInput={value => {
                        setReset(false);
                        InitialValues.alternateMobile = value;
                      }}
                    />
                    <Stack
                      horizontal
                      style={styles.extensionAlign}
                      horizontalAlign="space-between">
                      <View style={styles.extensionWidth}>
                        <FormikTextField
                          name="companyNumber"
                          value={InitialValues.companyNumber}
                          label={t('addManager:companyExtensionNumber')}
                          placeholder={t(
                            'addManager:extensionNumberPlaceholder',
                          )}
                          onChangeInput={value =>
                            (InitialValues.companyNumber = value)
                          }
                          keyboardType="number-pad"
                          maxLength={validations?.telephoneLength.MAX}
                        />
                      </View>
                      <View style={styles.companyExtWidth}>
                        <FormikTextField
                          name="companyExtension"
                          label={' '}
                          value={InitialValues.companyExtension}
                          placeholder={t(
                            'addManager:companyExtensionPlaceholder',
                          )}
                          onChangeInput={value =>
                            (InitialValues.companyExtension = value)
                          }
                          keyboardType="number-pad"
                          maxLength={validations?.companyExtension.MAX}
                        />
                      </View>
                    </Stack>
                    <FormikPhoneField
                      // ref={phoneInput}
                      label={t('addManager:hrContactNumber')}
                      value={InitialValues.hrMobile}
                      placeholder={t('addManager:hrContactNumberPlaceHolder')}
                      defaultCode={selectedHrCountry}
                      layout="second"
                      resetValues={reset}
                      containerStyle={styles.contactContainerStyle}
                      onChangeCountry={country => {
                        setSelectedHrCountry(country.cca2);
                        setFieldValue(
                          'hrMobileCountryCode',
                          `${country.callingCode[0]}`,
                        );
                      }}
                      name="hrMobile"
                      onChangeInput={value => {
                        setReset(false);
                        InitialValues.hrMobile = value;
                      }}
                    />
                    <FormikTextField
                      name="email"
                      value={InitialValues.email}
                      label={t('addManager:email')}
                      placeholder={t('addManager:emailPlaceholder')}
                      keyboardType="email-address"
                      onChangeInput={value => (InitialValues.email = value)}
                      // maxLength={validations?.email.MAX}
                    />
                    <ResidenceAddress
                      setShowModal={() =>
                        takeLocationPermission(showAlert, openModal, false)
                      }
                    />
                    <WorkAddress
                      setShowModal={() =>
                        takeLocationPermission(showAlert, openModal, true)
                      }
                    />
                    <Stack>
                      <TextView
                        weight="regular"
                        variant={FontSizes.regular}
                        style={styles.label}>
                        {t('addManager:addPhoto')}
                      </TextView>
                      <TouchableOpacity
                        onPress={() =>
                          (companyLogo ||
                            companyLogoEdit ||
                            managerDetailData?.profileUrl) &&
                          imageData.length > 0
                            ? setIsVisible(true)
                            : setSwipeModal(true)
                        }
                        style={styles.companyLogo}>
                        {(companyLogo ||
                          companyLogoEdit ||
                          managerDetailData?.profileUrl) &&
                        imageData.length > 0 ? (
                          <Stack>
                            {edit ? (
                              <Image
                                source={{
                                  uri: companyLogoEdit
                                    ? companyLogoEdit?.uri
                                    : managerDetailData?.profileUrl,
                                }}
                                style={styles.companyLogoStyle}
                              />
                            ) : (
                              <Image
                                source={{uri: companyLogo?.uri}}
                                style={styles.companyLogoStyle}
                              />
                            )}
                            <TouchableOpacity
                              onPress={closeCompanyLogo}
                              style={styles.closeStyle}>
                              <Icon
                                name="close"
                                size={16}
                                color={colors.grey_003}
                              />
                            </TouchableOpacity>
                          </Stack>
                        ) : (
                          <Icon
                            name={'add_floating'}
                            size={22}
                            color={colors.black}
                          />
                        )}
                      </TouchableOpacity>
                    </Stack>
                  </StackItem>
                </Stack>
              </KeyboardAwareScrollView>
            </Animated.ScrollView>
            {edit ? (
              <Stack spacing={16}>
                <PrimaryButton
                  title={t('save')}
                  onPress={onSave}
                  style={styles.saveButtonEdit}
                />
              </Stack>
            ) : (
              <Stack
                spacing={16}
                horizontal
                horizontalAlign="space-between"
                center>
                <PrimaryButton
                  title={t('save')}
                  onPress={onSave}
                  style={styles.saveButton}
                />
                <DefaultButton
                  title={t('addMore')}
                  fontSize={FontSizes.small}
                  onPress={addMore}
                  style={styles.addMoreButton}
                />
              </Stack>
            )}
            {deleteModal && (
              <DeleteModal
                reopenModal={deleteModal}
                setReopenModal={value => setDeleteModal(value)}
                Title={t('addEmployee:alert')}
                onDeleteClick={onDeleteClick}
              />
            )}
            {swipeModal && (
              <UploadGallery
                swipeModal={swipeModal}
                onPress={() => {
                  if (Platform.OS === 'ios') {
                    takePermissionGallery();
                  } else if (parseInt(DeviceInfo.getSystemVersion(), 10) < 13) {
                    takePermissionGallery();
                  } else {
                    chooseFileGallery();
                  }
                  closePanel();
                }}
                closePanel={closePanel}
              />
            )}
            {(loader || deleteEmployeeIsLoading) && <Loader />}
            <ImageView
              keyExtractor={(_, indexKey) => indexKey.toString()}
              images={imageData}
              imageIndex={0}
              visible={visible}
              onRequestClose={() => setIsVisible(false)}
            />
          </Container>
        );
      }}
    </Formik>
  );
};
