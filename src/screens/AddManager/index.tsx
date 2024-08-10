/* eslint-disable react-hooks/rules-of-hooks */
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {getUploadDocument} from 'common/utils/Amazon-S3';
import {takeLocationPermission} from 'common/utils/LocationPermission';
import {showToast} from 'common/utils/ToastMessage';
import {AlertPermission} from 'common/utils/permission/Alert';
import {
  checkGalleryPermission,
  getGalleryPermission,
} from 'common/utils/permission/ReadGallery';
import {Container, TextView} from 'components';
import {DefaultButton, PrimaryButton} from 'components/Buttons';
import DeleteModal from 'components/DeleteModal';
import {locationModal} from 'components/GooglePlaces';
import Header from 'components/Header';
import {Icon} from 'components/Icon';
import Loader from 'components/Loader';
import {membersProps} from 'components/Members/MembersItem';
import {NetworkContext} from 'components/NetworkProvider';
import {MenuModel, PopupMenu} from 'components/PopupMenu';
import {RadioButton} from 'components/RadioButton';
import {RenderReportToView} from 'components/ReportToView';
import {CompanyProps} from 'components/SelectCompany/CompanyListView';
import {Stack, StackItem} from 'components/Stack';
import UploadGallery from 'components/UploadGallery';
import {
  FormikDropdownPicker,
  FormikTextField,
  FormikTouchableField,
} from 'components/formikFields';
import {FormikDatePicker} from 'components/formikFields/FormikDatePicker';
import {FormikPhoneField} from 'components/formikFields/FormikPhoneField';
import {Formik, FormikProps} from 'formik';
import moment from 'moment';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Image, Platform, TouchableOpacity, View} from 'react-native';
import {CountryCode} from 'react-native-country-picker-modal';
import DeviceInfo from 'react-native-device-info';
import {GooglePlaceData} from 'react-native-google-places-autocomplete';
import {
  Asset,
  ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker';
import ImageView from 'react-native-image-viewing';
import {ImageSource} from 'react-native-image-viewing/dist/@types';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {companyError} from 'request/AddCompany';
import {
  useDeleteManagerMutation,
  useEditManagerMutation,
  useGetCompanyListQuery,
  useSetManagerMutation,
} from 'request/AddManager';
import {ReportToResponseList} from 'request/AddManager/ReportToResponseData';
import {genderData} from 'screens/AddOwner';
import {DropDownModel} from 'screens/AddTask';
import {useAppSelector} from 'store/hooks';
import {ResidenceAddress} from './components/ResidenceAddress';
import {WorkAddress} from './components/WorkAddress';
import {
  CreateManagerRequestObj,
  InitialValues,
  onSelectManagerLocation,
  resetManagerData,
  setManagerFormData,
} from './constants';
import {Styles} from './index.styles';
import {AddManagerProps} from './types';
import {AddManagerSchema} from './utils';
import {userTypes} from 'common/users/userTypes';
import {ProfileImageDetailsObj} from 'screens/AddEmployee';

type Props = NativeStackScreenProps<SignedInStackParamList, 'AddOwner'>;
export const AddManagerScreen = (props: Props) => {
  const {t} = useTranslation();
  const {route} = {...props};
  const {edit, managerDetailData} = {...route.params};
  const translateY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });
  const {netStatus} = useContext(NetworkContext);
  const {validations} = useAppSelector(state => state?.formanagement);
  const formikRef = useRef<FormikProps<AddManagerProps> | null>(null);
  const locationModalRef = useRef<locationModal>();
  const locationWorkModalRef = useRef<locationModal>();
  const [companyValue, setCompanyValue] = useState<string>('Google');
  const [reset, setReset] = useState<boolean>(false);
  const [allCompanyData, setAllCompanyData] = useState<DropDownModel[]>([]);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [swipeModal, setSwipeModal] = useState<boolean>(false);
  const [imageData, setImageData] = useState<ImageSource[]>([]);
  const [visible, setIsVisible] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);
  const [isSubmitClicked, setIsSubmitClicked] = useState<boolean>(false);
  const [stateUpdater, setStateUpdater] = useState<boolean>(false);
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
  const [isHRManager, setIsHRManager] = useState<boolean>(false);
  const [isValidAge, setIsValidAge] = useState(false);
  const [reportToModal, setReportToModal] = useState<boolean>(false);
  const [reportTo, setReportTo] = useState<
    membersProps | ReportToResponseList
  >();
  const [reportToMembersList, setReportToMembersList] = useState<
    membersProps[] | ReportToResponseList[] | undefined
  >();
  const {data: companyResponse} = useGetCompanyListQuery();
  const [addManager, {isSuccess, isError, error, data}] = edit
    ? useEditManagerMutation()
    : useSetManagerMutation();
  const [
    deleteManager,
    {
      isSuccess: deleteManagerSuccess,
      data: deleteManagerData,
      error: deleteManagerError,
      isLoading: deleteManagerIsLoading,
    },
  ] = useDeleteManagerMutation();

  useEffect(() => {
    if (edit) {
      setManagerFormData(managerDetailData!, formikRef);
      setCompanyValue(managerDetailData?.company![0]?.name!);
      setSelectedCountry(managerDetailData?.login?.mobileShortCode!);
      setSelectedHrCountry(managerDetailData?.hrMobileShortCode!);
      setSelectedAltCountry(
        managerDetailData?.alternateMobileShortCode! || 'IN',
      );
      setIsHRManager(managerDetailData?.isHrManager!);
      setReportTo({
        _id: managerDetailData?.reportTo?.id!,
        name: managerDetailData?.reportTo?.name!,
        role: managerDetailData?.reportTo?.role!,
        profileUrl: managerDetailData?.reportTo?.profileUrl,
      });
      imageData?.push({uri: managerDetailData?.profileUrl});
      setImageData([...imageData]);
      const residentialLocation = {
        lat: managerDetailData?.residenceAddress.latitude,
        lng: managerDetailData?.residenceAddress.longitude,
      };
      const workAddressLocation = {
        lat: managerDetailData?.workAddress.latitude,
        lng: managerDetailData?.workAddress.longitude,
      };
      locationModalRef.current = residentialLocation;
      locationWorkModalRef.current = workAddressLocation;
    }

    return () => {
      resetStateData();
      setLoader(false);
      closeCompanyLogo();
      setSwipeModal(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if ((isError && error) || deleteManagerError) {
      setLoader(false);
      const err: any = error || deleteManagerError;
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
    } else if (isSuccess && data?.message) {
      setLoader(false);
      showToast(data?.message);
      isSubmitClicked ? props.navigation.goBack() : null;
      resetStateData();
    } else if (deleteManagerSuccess && deleteManagerData) {
      const {message} = deleteManagerData;
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    data,
    error,
    isSuccess,
    companyResponse,
    deleteManagerSuccess,
    deleteManagerError,
  ]);

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
            setStateUpdater(!stateUpdater);
          } else {
            showToast(t('addManager:imageError'));
          }
          closePanel();
        }
      });
    }
  };
  const resetStateData = () => {
    resetManagerData();
    locationModalRef.current = {lat: undefined, lng: undefined};
    locationWorkModalRef.current = {lat: undefined, lng: undefined};
    setIsHRManager(false);
    setReset(true);
    closeCompanyLogo();
    setIsSubmitClicked(false);
    formikRef.current?.resetForm();
  };

  const onSubmit = async (managerFormValues: AddManagerProps) => {
    setLoader(true);
    let addCompanyLogo;
    let profileImageDetails: ProfileImageDetailsObj | undefined =
      managerDetailData?.profileImageDetails;
    if ((companyLogo || companyLogoEdit) && imageData.length > 0) {
      addCompanyLogo = await getUploadDocument(
        edit ? companyLogoEdit : companyLogo,
        `addManager${moment().format()}`,
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
    const countryCode = managerFormValues.countryCode
      ? managerFormValues.countryCode
      : '91';
    const HRcountryCode = managerFormValues.hrMobile
      ? managerFormValues.hrMobileCountryCode
        ? managerFormValues.hrMobileCountryCode
        : '91'
      : '';
    const alternateCountryCode = managerFormValues.alternateMobile
      ? managerFormValues.alternateMobileCountryCode
        ? managerFormValues.alternateMobileCountryCode
        : '91'
      : '';
    const requestObj = CreateManagerRequestObj(
      managerFormValues,
      imageData.length > 0 && !companyLogo && !companyLogoEdit
        ? managerDetailData?.profileUrl
        : addCompanyLogo,
      countryCode,
      HRcountryCode,
      locationModalRef,
      locationWorkModalRef,
      isHRManager,
      selectedCountry,
      selectedHrCountry,
      imageData.length > 0 && !companyLogo && !companyLogoEdit
        ? managerDetailData?.profileImageDetails
        : profileImageDetails,
      reportTo as ReportToResponseList,
      alternateCountryCode,
      selectedAltCountry,
    );
    if (netStatus) {
      edit
        ? addManager({managerId: managerDetailData?._id, mangerObj: requestObj})
        : addManager({mangerObj: requestObj});
    } else {
      showToast(t('noNetwork'));
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
  const onDeleteClick = () => {
    deleteManager(managerDetailData?._id!);
    setDeleteModal(false);
  };

  const closePanel = () => setSwipeModal(false);
  const closeCompanyLogo = () => {
    setImageData([]);
    setCompanyLogo(undefined);
    setCompanyLogoEdit(undefined);
  };
  const showAlert = () => AlertPermission(t('permissions:location'));
  const openModal = (isWorkAddressClicked: boolean) => {
    props.navigation.navigate('GooglePlaces', {
      onSelect: onSelectPlace,
      isWorkAddressClick: isWorkAddressClicked,
    });
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
    onSelectManagerLocation(
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
  const styles = Styles();

  return (
    <Formik<AddManagerProps>
      initialValues={InitialValues}
      validateOnMount
      innerRef={formikRef}
      onSubmit={onSubmit}
      validationSchema={AddManagerSchema}>
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
              label={edit ? t('addOwner:edit') : t('homePage:addManager')}
              translateY={translateY}
              RenderLeftContainer={edit ? renderLeftContainer : undefined}
            />
            <Animated.ScrollView
              showsVerticalScrollIndicator={false}
              keyboardDismissMode="on-drag"
              onScroll={scrollHandler}
              scrollEventThrottle={16}>
              <KeyboardAwareScrollView
                bounces={false}
                overScrollMode={'never'}
                enableResetScrollToCoords={false}>
                <Stack spaceBelow={70}>
                  <StackItem childrenGap={20} spacing={16} spaceBelow={16}>
                    <FormikDropdownPicker
                      options={allCompanyData}
                      value={companyValue}
                      name="company"
                      onSelect={item => {
                        setCompanyValue(item.label);
                        InitialValues.company = item.value;
                      }}
                      placeholder={t('addManager:dropdownPlaceholder')}
                    />
                    <FormikTextField
                      name="name"
                      value={InitialValues.name}
                      label={t('addManager:name')}
                      placeholder={t('addManager:name')}
                      onChangeInput={value => (InitialValues.name = value)}
                      keyboardType={'email-address'}
                      autoComplete={'off'}
                      maxLength={validations?.nameLength.MAX}
                    />
                    <Stack>
                      <RadioButton
                        value={InitialValues.gender}
                        data={genderData}
                        onSelect={value => (InitialValues.gender = value)}
                      />
                    </Stack>
                    <FormikDatePicker
                      name="dob"
                      value={InitialValues.dob}
                      resetValues={reset}
                      label={t('managersHomePage:dob')}
                      placeholder={'YYYY-MM-DD'}
                      format={'YYYY-MM-DD'}
                      onPress={onDobChange}
                      maximumDate={new Date()}
                      isValidAge={isValidAge}
                      ageCheck={true}
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
                          role={userTypes.Manager.toUpperCase()}
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
                    <TouchableOpacity
                      onPress={() => setIsHRManager(!isHRManager)}
                      // eslint-disable-next-line react-native/no-inline-styles
                      style={{width: 125}}>
                      <Stack horizontal horizontalAlign="flex-start">
                        {isHRManager ? (
                          <Icon
                            name="check_box"
                            size={20}
                            style={{color: colors.primary}}
                          />
                        ) : (
                          <Icon
                            name="check_box_blank"
                            size={20}
                            style={{color: colors.primary}}
                          />
                        )}
                        <TextView
                          weight="medium"
                          variant={FontSizes.regular}
                          style={styles.hrManager}>
                          {t('addManager:hrManager')}
                        </TextView>
                      </Stack>
                    </TouchableOpacity>
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
                  style={styles.saveButtonEdit}
                  title={t('save')}
                  onPress={onSave}
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
                Title={t('addManager:alert')}
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
            {(loader || deleteManagerIsLoading) && <Loader />}
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
