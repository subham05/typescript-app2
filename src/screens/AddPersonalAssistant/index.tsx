import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {STR_KEYS} from 'common/storage';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {getUploadDocument} from 'common/utils/Amazon-S3';
import {DateTimeFormats} from 'common/utils/DateTimeFormats';
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
  FormikDatePicker,
  FormikTextField,
  FormikTouchableField,
} from 'components/formikFields';
import {FormikPhoneField} from 'components/formikFields/FormikPhoneField';
import {Formik, FormikProps} from 'formik';
import {t} from 'i18next';
import moment from 'moment';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {FC, useContext, useEffect, useRef, useState} from 'react';
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
  useAddPersonalAssistantMutation,
  useDeletePAMutation,
  useEditPAMutation,
} from 'request/PersonalAssistant';
import {DropDownModel} from 'screens/AddTask';
import {useAppSelector} from 'store/hooks';
import {ResidenceAddress} from './components/ResidenceAddress';
import {WorkAddress} from './components/WorkAddress';
import {
  CreateRequestObj,
  InitialValues,
  onSelectLocation,
  resetPAData,
  setPAFormData,
} from './constants';
import {styles} from './index.styles';
import {AddPA} from './types';
import {AddPASchema} from './utils';
import {userTypes} from 'common/users/userTypes';
import {ProfileImageDetailsObj} from 'screens/AddEmployee';

type PAProps = NativeStackScreenProps<
  SignedInStackParamList,
  'AddPersonalAssistant'
>;

const AddPersonalAssistant: FC<PAProps> = ({navigation, route}) => {
  const translateY = useSharedValue(0);
  const formikRef = useRef<FormikProps<AddPA> | null>(null);

  const {edit, paDetailData} = {...route.params};
  const {userData} = useAppSelector(state => state.formanagement);

  // const [companyValue, setCompanyValue] = useState<string>('');
  const [allCompanyData, setAllCompanyData] = useState<DropDownModel[]>([]);
  const [selectedCompanyList, setSelectedCompanyList] = useState<
    DropDownModel[]
  >([]);
  const {data: companyResponse} = useGetCompanyListQuery();
  const [reset, setReset] = useState<boolean>(false);
  const {validations} = useAppSelector(state => state?.formanagement);
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(
    edit ? paDetailData?.login?.mobileShortCode! : 'IN',
  );
  const [selectedAltCountry, setSelectedAltCountry] = useState<CountryCode>(
    edit ? paDetailData?.alternateMobileShortCode! || 'IN' : 'IN',
  );
  const {netStatus} = useContext(NetworkContext);
  const [loader, setLoader] = useState<boolean>(false);
  const [isSubmitClicked, setIsSubmitClicked] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [swipeModal, setSwipeModal] = useState<boolean>(false);
  const locationModalRef = useRef<locationModal>();
  const locationWorkModalRef = useRef<locationModal>();
  const [imageData, setImageData] = useState<ImageSource[]>([]);
  const [companyLogo, setCompanyLogo] = useState<Asset>();
  const [companyLogoEdit, setCompanyLogoEdit] = useState<Asset>();
  const [visible, setIsVisible] = useState<boolean>(false);
  const [primary, setPrimary] = useState<string>('NO');
  const [isValidAge, setIsValidAge] = useState(false);
  const [reportToModal, setReportToModal] = useState<boolean>(false);
  const [reportTo, setReportTo] = useState<membersProps | ReportToResponseList>(
    {
      _id: userData?._id!,
      name: userData?.name!,
      role: userData?.role.type!,
      profileUrl: userData?.profileUrl,
    },
  );
  const [reportToMembersList, setReportToMembersList] = useState<
    membersProps[] | ReportToResponseList[] | undefined
  >();
  const [addPA, {isSuccess, isError, error, data}] =
    useAddPersonalAssistantMutation();
  const [
    updatePA,
    {
      isSuccess: updateIsSuccess,
      isError: updateIsError,
      error: updateError,
      data: updateData,
    },
  ] = useEditPAMutation();
  const [
    deletePA,
    {
      isSuccess: deletePASuccess,
      data: deletePAData,
      error: deletePAError,
      isLoading: deletePAIsLoading,
    },
  ] = useDeletePAMutation();

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  useEffect(() => {
    getPrimary();
    if (edit) {
      let companyData: DropDownModel[] = [];
      paDetailData?.company?.map((item: {_id: string; name: string}) =>
        companyData.push({
          label: item.name,
          value: `${item._id}`,
        }),
      );
      setPAFormData(paDetailData!, formikRef);
      setSelectedCompanyList(companyData);
      setSelectedCountry(paDetailData?.login?.mobileShortCode!);
      setSelectedAltCountry(paDetailData?.alternateMobileShortCode! || 'IN');
      setReportTo({
        _id: paDetailData?.reportTo?.id!,
        name: paDetailData?.reportTo?.name!,
        role: paDetailData?.reportTo?.role!,
        profileUrl: paDetailData?.reportTo?.profileUrl,
      });
      imageData?.push({uri: paDetailData?.profileUrl});
      setImageData([...imageData]);
      const residentialLocation = {
        lat: paDetailData?.residenceAddress?.latitude,
        lng: paDetailData?.residenceAddress?.longitude,
      };
      const workAddressLocation = {
        lat: paDetailData?.workAddress?.latitude,
        lng: paDetailData?.workAddress?.longitude,
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
  const getPrimary = async () => {
    let isPrimary = await AsyncStorage.getItem(STR_KEYS.LOGINUSERDATA);
    isPrimary = JSON.parse(isPrimary);
    isPrimary = isPrimary?.primary;
    setPrimary(isPrimary!);
  };
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
    if ((isError && error) || (updateIsError && updateError) || deletePAError) {
      setLoader(false);
      const err: any = error || updateError || deletePAError;
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
        // showToast(err?.data?.error[0].msg);
      }
    }
    if (
      (isSuccess && data?.message) ||
      (updateIsSuccess && updateData?.message)
    ) {
      setLoader(false);
      edit ? showToast(updateData?.message) : showToast(data?.message);
      isSubmitClicked ? navigation.goBack() : null;
      resetStateData();
      // setCompanyValue(allCompanyData![0]?.label);
      InitialValues.company = allCompanyData![0]?.value;
    }
    if (deletePASuccess && deletePAData) {
      const {message} = deletePAData;
      setLoader(false);
      showToast(message);
      navigation.pop(2);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    data,
    error,
    isSuccess,
    updateIsSuccess,
    updateData,
    updateError,
    deletePASuccess,
    deletePAData,
    deletePAError,
  ]);

  useEffect(() => {
    // setCompanyValue(allCompanyData![0]?.label);
    InitialValues.company = allCompanyData![0]?.value;
    setSelectedCompanyList(allCompanyData);
  }, [allCompanyData]);

  useEffect(() => {
    formikRef.current?.setFieldValue('reportTo', userData?._id!);
    return () => {
      resetStateData();
      setLoader(false);
      closeCompanyLogo();
      setSwipeModal(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showAlert = () => AlertPermission(t('permissions:location'));
  const openModal = (isWorkAddressClicked: boolean) => {
    navigation.navigate('GooglePlaces', {
      onSelect: onSelectPlace,
      isWorkAddressClick: isWorkAddressClicked,
    });
  };

  const onDeleteClick = () => {
    deletePA(paDetailData?._id!);
    setDeleteModal(false);
  };

  const closePanel = () => setSwipeModal(false);
  const closeCompanyLogo = () => {
    setCompanyLogo(undefined);
    setCompanyLogoEdit(undefined);
    setImageData([]);
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

  const genderData = [
    {id: 1, value: 'Male'},
    {id: 2, value: 'Female'},
  ];

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
      // formikRef.current?.setFieldValue('dob', value);
      InitialValues.dob = moment(value).format(DateTimeFormats.YearMonthDay);
    } else {
      setIsValidAge(false);
      setReset(false);
      showToast(t('addManager:ageAlert'));
      formikRef.current?.setFieldValue('dob', '');
      InitialValues.dob = '';
      setReset(true);
    }
  };

  const resetStateData = () => {
    resetPAData();
    locationModalRef.current = {lat: undefined, lng: undefined};
    locationWorkModalRef.current = {lat: undefined, lng: undefined};
    setReset(true);
    closeCompanyLogo();
    setIsSubmitClicked(false);
    setSelectedCompanyList([]);
    formikRef.current?.resetForm();
  };

  const onSubmit = async (values: AddPA) => {
    setLoader(true);
    let addCompanyLogo;
    let profileImageDetails: ProfileImageDetailsObj | undefined =
      paDetailData?.profileImageDetails;
    if ((companyLogo || companyLogoEdit) && imageData.length > 0) {
      addCompanyLogo = await getUploadDocument(
        edit ? companyLogoEdit : companyLogo,
        `PA/media/${moment().format()}`,
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
    const countryCode = values.countryCode ? values.countryCode : '91';
    const alternateCountryCode = values.alternateMobile
      ? values.alternateMobileCountryCode
        ? values.alternateMobileCountryCode
        : '91'
      : '';
    const requestObj: any = CreateRequestObj(
      values,
      imageData.length > 0 && !companyLogo && !companyLogoEdit
        ? paDetailData?.profileUrl
        : addCompanyLogo,
      countryCode,
      locationModalRef,
      locationWorkModalRef,
      primary,
      selectedCountry,
      companyIds,
      imageData.length > 0 && !companyLogo && !companyLogoEdit
        ? paDetailData?.profileImageDetails
        : profileImageDetails,
      reportTo as ReportToResponseList,
      alternateCountryCode,
      selectedAltCountry,
    );
    if (netStatus) {
      edit
        ? updatePA({PAId: paDetailData?._id, PAObj: requestObj})
        : addPA({PAObj: requestObj});
    } else {
      showToast(t('noNetwork'));
      setLoader(false);
    }
  };

  const RenderMultiSelectView = () => {
    return (
      <FlatList
        data={selectedCompanyList}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        renderItem={({item}) => (
          <View style={styles.companyView}>
            <TextView>{item.label}</TextView>
          </View>
        )}
      />
    );
  };

  return (
    <Formik<AddPA>
      initialValues={InitialValues}
      validateOnMount
      innerRef={formikRef}
      onSubmit={onSubmit}
      validationSchema={AddPASchema}>
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
              translateY={translateY}
              navigationType="STACK"
              label={edit ? t('addPA:editPA') : t('homePage:addPA')}
              RenderLeftContainer={edit ? renderLeftContainer : undefined}
            />
            <Animated.ScrollView
              showsVerticalScrollIndicator={false}
              keyboardDismissMode="on-drag"
              onScroll={scrollHandler}
              scrollEventThrottle={16}>
              <KeyboardAwareScrollView>
                <Stack style={styles.container}>
                  <StackItem
                    childrenGap={16}
                    spacing={16}
                    spaceBelow={15}
                    style={styles.flex}>
                    <FormikTouchableField
                      icon={'arrow_expand_more'}
                      variant={FontSizes.medium}
                      variantStyle={{color: colors.grey_003}}
                      data={selectedCompanyList}
                      RenderView={RenderMultiSelectView}
                      onPress={() => {}}
                      placeholder={
                        selectedCompanyList.length > 0
                          ? undefined
                          : t('addGeneralManager:dropdownPlaceholder')
                      }
                      name="company"
                    />
                    <FormikTextField
                      name="name"
                      value={InitialValues.name}
                      label={t('addPA:name')}
                      placeholder={t('addPA:name')}
                      onChangeInput={value => (InitialValues.name = value)}
                      keyboardType={'default'}
                      autoComplete={'off'}
                      maxLength={validations?.nameLength.MAX}
                    />
                    <RadioButton
                      data={genderData}
                      value={InitialValues.gender}
                      onSelect={value => (InitialValues.gender = value)}
                    />
                    <FormikDatePicker
                      name="dob"
                      value={InitialValues.dob}
                      resetValues={reset}
                      label={t('addPA:dob')}
                      placeholder={DateTimeFormats.YearMonthDay}
                      format={DateTimeFormats.YearMonthDay}
                      onPress={onDobChange}
                      maximumDate={new Date()}
                      isValidAge={isValidAge}
                      ageCheck={true}
                    />
                    <FormikTextField
                      name="designation"
                      value={InitialValues.designation}
                      label={t('addPA:designation')}
                      placeholder={t('addPA:designation')}
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
                      label={t('addPA:department')}
                      placeholder={t('addPA:department')}
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
                          role={userTypes.persoalAssistant}
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
                      label={t('addPA:contactNumber')}
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
                      style={styles.rowVerticalStyle}
                      horizontalAlign="space-between">
                      <View style={styles.extensionWidth}>
                        <FormikTextField
                          name="companyNumber"
                          value={InitialValues.companyNumber}
                          label={t('addPA:companyExtensionNumber')}
                          placeholder={t('addPA:extensionNumberPlaceholder')}
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
                          placeholder={t('addPA:companyExtensionPlaceholder')}
                          onChangeInput={value =>
                            (InitialValues.companyExtension = value)
                          }
                          keyboardType="number-pad"
                          maxLength={validations?.companyExtension.MAX}
                        />
                      </View>
                    </Stack>
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
                            paDetailData?.profileUrl) &&
                          imageData.length > 0
                            ? setIsVisible(true)
                            : setSwipeModal(true)
                        }
                        style={styles.companyLogo}>
                        {(companyLogo ||
                          companyLogoEdit ||
                          paDetailData?.profileUrl) &&
                        imageData.length > 0 ? (
                          <Stack>
                            {edit ? (
                              <Image
                                source={{
                                  uri: companyLogoEdit
                                    ? companyLogoEdit?.uri
                                    : paDetailData?.profileUrl,
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
                Title={t('addPA:deleteAlert')}
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
            {(loader || deletePAIsLoading) && <Loader />}
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

export default AddPersonalAssistant;
