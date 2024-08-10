import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {userTypes} from 'common/users/userTypes';
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
import MultiSelectCompany from 'components/MultiSelectCompany';
import {NetworkContext} from 'components/NetworkProvider';
import {MenuModel, PopupMenu} from 'components/PopupMenu';
import {RadioButton} from 'components/RadioButton';
import {RenderReportToView} from 'components/ReportToView';
import {CompanyProps} from 'components/SelectCompany/CompanyListView';
import {Stack, StackItem} from 'components/Stack';
import UploadGallery from 'components/UploadGallery';
import {FormikTextField, FormikTouchableField} from 'components/formikFields';
import {FormikDatePicker} from 'components/formikFields/FormikDatePicker';
import {FormikPhoneField} from 'components/formikFields/FormikPhoneField';
import {Formik, FormikProps} from 'formik';
import moment from 'moment';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, Image, Platform, TouchableOpacity, View} from 'react-native';
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
import {useGetCompanyListQuery} from 'request/AddManager';
import {ReportToResponseList} from 'request/AddManager/ReportToResponseData';
import {
  useDeleteOwnerMutation,
  useEditOwnerMutation,
  useSetOwnerMutation,
} from 'request/AddOwner';
import {ProfileImageDetailsObj} from 'screens/AddEmployee';
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
import {AddOwnerFormModel} from './types';
import {AddOwnerSchema} from './utils';

export const genderData = [
  {id: 1, value: 'Male'},
  {id: 2, value: 'Female'},
];

type Props = NativeStackScreenProps<SignedInStackParamList, 'AddOwner'>;
export const AddOwnerScreen = (props: Props) => {
  const {t} = useTranslation();
  const {route} = {...props};
  const {edit, managerDetailData} = {...route.params};
  const translateY = useSharedValue(0);
  const {netStatus} = useContext(NetworkContext);
  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });
  const [reset, setReset] = useState<boolean>(false);
  const formikRef = useRef<FormikProps<AddOwnerFormModel> | null>(null);
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
  const [allCompanyDataTemp, setAllCompanyDataTemp] = useState<DropDownModel[]>(
    [],
  );
  const [openCompanyModal, setOpenCompanyModal] = useState<boolean>(false);
  const [selectedCompanyList, setSelectedCompanyList] = useState<
    DropDownModel[]
  >([]);
  const [searchText, setSearchText] = useState<string>('');
  const {validations, userData} = useAppSelector(state => state?.formanagement);
  const locationModalRef = useRef<locationModal>();
  const locationWorkModalRef = useRef<locationModal>();
  const [isValidAge, setIsValidAge] = useState(false);
  const [reportToModal, setReportToModal] = useState<boolean>(false);
  const [reportTo, setReportTo] = useState<membersProps | ReportToResponseList>(
    {
      _id: userData?._id!,
      name: userData?.name!,
      role: userData?.role.type,
      profileUrl: userData?.profileUrl,
    },
  );
  const [reportToMembersList, setReportToMembersList] = useState<
    membersProps[] | ReportToResponseList[] | undefined
  >();
  const {data: companyResponse} = useGetCompanyListQuery();
  const [
    editOwner,
    {
      isSuccess: isSuccessOwner,
      isError: isErrorOwner,
      error: errorOwner,
      data: editData,
    },
  ] = useEditOwnerMutation();
  const [addOwner, {isSuccess, isError, error, data}] = useSetOwnerMutation();
  const [
    deleteOwner,
    {
      isSuccess: deleteOwnerSuccess,
      data: deleteOwnerData,
      error: deleteOwnerError,
      isLoading: deleteOwnerIsLoading,
    },
  ] = useDeleteOwnerMutation();

  useEffect(() => {
    formikRef.current?.setFieldValue('reportTo', userData?._id!);
    if (edit) {
      let companyData: DropDownModel[] = [];
      managerDetailData?.company?.map((item: {_id: string; name: string}) =>
        companyData.push({
          label: item.name,
          value: `${item._id}`,
        }),
      );
      setManagerFormData(managerDetailData!, formikRef);
      setSelectedCompanyList(companyData);
      setSelectedCountry(managerDetailData?.login?.mobileShortCode!);
      setSelectedHrCountry(managerDetailData?.hrMobileShortCode!);
      setSelectedAltCountry(
        managerDetailData?.alternateMobileShortCode! || 'IN',
      );
      setReportTo({
        _id: managerDetailData?.reportTo?.id!,
        name: managerDetailData?.reportTo?.name!,
        role: managerDetailData?.reportTo?.role!,
        profileUrl: managerDetailData?.reportTo?.profileUrl,
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
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      (isError && error) ||
      deleteOwnerError ||
      (isErrorOwner && errorOwner)
    ) {
      setLoader(false);
      const err: any = error || deleteOwnerError || errorOwner;
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
      (isSuccessOwner && editData?.message)
    ) {
      setLoader(false);
      edit ? showToast(editData?.message) : showToast(data?.message);
      isSubmitClicked ? props.navigation.goBack() : null;
      resetStateData();
    } else if (deleteOwnerSuccess && deleteOwnerData) {
      const {message} = deleteOwnerData;
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
      setAllCompanyDataTemp(companyData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    data,
    error,
    isSuccess,
    companyResponse,
    deleteOwnerSuccess,
    deleteOwnerError,
    isErrorOwner,
    errorOwner,
    editData,
  ]);

  const resetStateData = () => {
    resetData();
    locationModalRef.current = {lat: undefined, lng: undefined};
    locationWorkModalRef.current = {lat: undefined, lng: undefined};
    setReset(true);
    closeCompanyLogo();
    setIsSubmitClicked(false);
    setSelectedCompanyList([]);
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

  const onSubmit = async (ownerFormValues: AddOwnerFormModel) => {
    setLoader(true);
    let addCompanyLogo;
    let profileImageDetails: ProfileImageDetailsObj | undefined =
      managerDetailData?.profileImageDetails;
    if ((companyLogo || companyLogoEdit) && imageData.length > 0) {
      addCompanyLogo = await getUploadDocument(
        edit ? companyLogoEdit : companyLogo,
        `addOwner${moment().format()}`,
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
    const companyIds = selectedCompanyList.map(item => item.value);
    const countryCode = ownerFormValues.countryCode
      ? ownerFormValues.countryCode
      : '91';
    const HRcountryCode = ownerFormValues.hrMobile
      ? ownerFormValues.hrMobileCountryCode
        ? ownerFormValues.hrMobileCountryCode
        : '91'
      : '';
    const alternateCountryCode = ownerFormValues.alternateMobile
      ? ownerFormValues.alternateMobileCountryCode
        ? ownerFormValues.alternateMobileCountryCode
        : '91'
      : '';
    const requestObj = CreateRequestObj(
      ownerFormValues,
      imageData.length > 0 && !companyLogo && !companyLogoEdit
        ? managerDetailData?.profileUrl
        : addCompanyLogo,
      countryCode,
      HRcountryCode,
      locationModalRef,
      locationWorkModalRef,
      companyIds,
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
        ? editOwner({ownerId: managerDetailData?._id, ownerObj: requestObj})
        : addOwner({ownerObj: requestObj});
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
    // setCountryShort(country_short);
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
    deleteOwner(managerDetailData?._id!);
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
  const RenderMultiSelectView = () => {
    return (
      <FlatList
        data={selectedCompanyList}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        renderItem={({item, index}) => (
          <View style={styles.companyView}>
            <TextView>{item.label}</TextView>
            <TouchableOpacity
              onPress={() => {
                selectedCompanyList.splice(index, 1);
                selectedCompanyList.length <= 0 &&
                  formikRef.current?.setFieldValue('company', '');
                setSelectedCompanyList([...selectedCompanyList]);
              }}>
              <Icon name="close" size={20} color={colors.black} />
            </TouchableOpacity>
          </View>
        )}
      />
    );
  };
  const styles = Styles();
  return (
    <Formik<AddOwnerFormModel>
      initialValues={InitialValues}
      validateOnMount
      innerRef={formikRef}
      onSubmit={onSubmit}
      validationSchema={AddOwnerSchema}>
      {({handleSubmit, setFieldValue}) => {
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
              label={edit ? t('addOwner:edit') : t('homePage:addOwner')}
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
                    <FormikTouchableField
                      icon={'arrow_expand_more'}
                      variant={FontSizes.medium}
                      variantStyle={{color: colors.grey_003}}
                      data={selectedCompanyList}
                      RenderView={RenderMultiSelectView}
                      onPress={() => setOpenCompanyModal(!openCompanyModal)}
                      placeholder={
                        selectedCompanyList.length > 0
                          ? undefined
                          : t('addManager:dropdownPlaceholder')
                      }
                      name="company"
                    />
                    <FormikTextField
                      name="name"
                      value={InitialValues.name}
                      label={t('addOwner:name')}
                      placeholder={t('addOwner:name')}
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
                          role={userTypes.Owner.toUpperCase()}
                          companyValue={selectedCompanyList.map(
                            item => item.value,
                          )}
                          reportTo={reportTo}
                          disabled
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
                      disabled
                      disabledNoBackground
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
                Title={t('addOwner:alert')}
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
            {(loader || deleteOwnerIsLoading) && <Loader />}
            <ImageView
              keyExtractor={(_, indexKey) => indexKey.toString()}
              images={imageData}
              imageIndex={0}
              visible={visible}
              onRequestClose={() => setIsVisible(false)}
            />
            {openCompanyModal && (
              <MultiSelectCompany
                allCompanyData={allCompanyDataTemp}
                setOpenCompanyModal={setOpenCompanyModal}
                openCompanyModal={openCompanyModal}
                selectedCompanyList={selectedCompanyList}
                onClick={selected => {
                  const isAvailable = selectedCompanyList.findIndex(
                    item => item.value === selected.value,
                  );
                  if (isAvailable === -1) {
                    selectedCompanyList.push(selected);
                  } else {
                    selectedCompanyList.splice(isAvailable, 1);
                  }
                  selectedCompanyList.length > 0
                    ? setFieldValue('company', selectedCompanyList[0].value)
                    : setFieldValue('company', '');
                  setSelectedCompanyList([...selectedCompanyList]);
                }}
                searchText={searchText}
                setSearchText={value => {
                  const tempArray = allCompanyData.filter(item =>
                    item.label.toLowerCase().includes(value.toLowerCase()),
                  );
                  setSearchText(value);
                  value
                    ? setAllCompanyDataTemp([...tempArray])
                    : setAllCompanyDataTemp(allCompanyData);
                }}
              />
            )}
          </Container>
        );
      }}
    </Formik>
  );
};
