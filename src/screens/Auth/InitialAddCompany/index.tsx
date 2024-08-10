import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {STR_KEYS} from 'common/storage';
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
import {FormikDropdownPicker, FormikTextField} from 'components/formikFields';
import {FormikPhoneField} from 'components/formikFields/FormikPhoneField';
import {locationModal} from 'components/GooglePlaces';
import Header from 'components/Header';
import {Icon} from 'components/Icon';
import Loader from 'components/Loader';
import {NetworkContext} from 'components/NetworkProvider';
import {Stack, StackItem} from 'components/Stack';
import UploadGallery from 'components/UploadGallery';
import {Formik, FormikProps} from 'formik';
import moment from 'moment';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Image, Platform, TouchableOpacity, View} from 'react-native';
import {CountryCode} from 'react-native-country-picker-modal';
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
import {
  companyError,
  useLazyGetWebsitesQuery,
  useSetCompanyDataMutation,
} from 'request/AddCompany';
import {useEditOfficeMutation} from 'request/EditOffice';
import {DropDownModel} from 'screens/AddTask';
import {useAppDispatch, useAppSelector} from 'store/hooks';
import {userDataAction} from 'store/Reducer';
import GPS from '../../../assets/svgs/GPS.svg';
import {
  Company,
  createCompanyRequestObj,
  InitialValues,
  onSelectCompanyLocation,
  resetCompanyData,
} from './constants';
import {Styles} from './index.styles';
import {AddCompanySchema} from './utils';
import DeviceInfo from 'react-native-device-info';

type Props = NativeStackScreenProps<SignedInStackParamList, 'AddCompany'>;
export const InitialAddCompanyScreen = (props: Props) => {
  const isEdit = props.route.params?.edit ?? false;
  const companyDetails = props.route.params?.companyData;
  const {t} = useTranslation();
  const translateY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });
  const {netStatus} = useContext(NetworkContext);

  const formikRef = useRef<FormikProps<Company> | null>(null);
  const [loader, setLoader] = useState<boolean>(false);
  const locationModalRef = useRef<locationModal>();
  const [imageData, setImageData] = useState<ImageSource[]>([]);
  const [visible, setIsVisible] = useState<boolean>(false);
  const [isSubmitClicked, setIsSubmitClicked] = useState<boolean>(false);
  const [swipeModal, setSwipeModal] = useState<boolean>(false);
  const [reset, setReset] = useState<boolean>(false);
  const [companyLogo, setCompanyLogo] = useState<Asset>();
  const [companyValue, setCompanyValue] = useState<string>('Google');
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>('IN');
  const [allCompanyData, setAllCompanyData] = useState<DropDownModel[]>([]);
  const {validations} = useAppSelector(state => state?.formanagement);

  const {userData} = useAppSelector(state => state.formanagement);
  const dispatch = useAppDispatch();

  const [getWebsites, {data: websiteResponse}] = useLazyGetWebsitesQuery();
  const [addCompany, {isSuccess, isError, error, data}] =
    useSetCompanyDataMutation();

  const [
    editCompany,
    {
      isError: editIsError,
      error: editError,
      isSuccess: editIsSuccess,
      data: editData,
    },
  ] = useEditOfficeMutation();

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

  const showAlert = () => AlertPermission(t('permissions:location'));
  const openModal = () =>
    props.navigation.navigate('GooglePlaces', {
      onSelect: onSelectPlace,
    });

  useEffect(() => {
    if (isEdit && companyDetails) {
      InitialValues.name = companyDetails.name;
      InitialValues.countryCode = companyDetails?.countryCode;
      InitialValues.contact = companyDetails.contact;
      InitialValues.officeTelephone = companyDetails.officeTelephone;
      InitialValues.address = companyDetails.officeAddress.address;
      InitialValues.landmark = companyDetails.officeAddress.landmark;
      InitialValues.country = companyDetails.officeAddress.country;
      InitialValues.state = companyDetails.officeAddress.state;
      InitialValues.city = companyDetails.officeAddress.city;
      InitialValues.zipcode = companyDetails.officeAddress.zipcode;
      InitialValues.website = companyDetails.website;
      locationModalRef.current = {
        lat: companyDetails.officeAddress.latlong?.latitude,
        lng: companyDetails.officeAddress.latlong?.longitude,
      };
      setCompanyLogo({uri: companyDetails.logo});
    }
  }, [companyDetails, isEdit]);

  useEffect(() => {
    getWebsites();
    return () => {
      resetData();
      setLoader(false);
      closeCompanyLogo();
      setSwipeModal(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isError && error) {
      setLoader(false);
      const err: any = error;
      if (err?.error) {
        showToast(err.error);
      } else {
        err?.data?.error
          ? err?.data?.error?.map((errorItem: companyError) =>
              errorItem.param.includes('officeAddress.zipcode')
                ? formikRef.current?.setFieldError('zipcode', errorItem.msg)
                : formikRef.current?.setFieldError(
                    errorItem.param,
                    errorItem.msg,
                  ),
            )
          : showToast(err?.data?.message);
      }
    } else if (isSuccess) {
      // let newUserData = userData;
      const {_id, contact, name, website, __v} = data!.data;
      let newUserData: any = {
        ...userData,
        companies: {_id, website, contact, name, __v},
        companyId: _id,
      };
      const asyncFunction = async () => {
        dispatch(userDataAction(newUserData));
        await AsyncStorage.setItem(
          STR_KEYS.LOGINUSERDATA,
          JSON.stringify(newUserData),
        );
      };
      asyncFunction();
      setLoader(false);
      getWebsites();
      showToast(data?.message);
      isSubmitClicked ? props.navigation.goBack() : null;
      resetData();
    }
    if (websiteResponse) {
      let companyData: DropDownModel[] = [];
      websiteResponse.length > 0 &&
        websiteResponse.map((item: string) =>
          companyData.push({
            label: item,
            value: item,
          }),
        );
      setAllCompanyData(companyData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, data, isSuccess, websiteResponse]);

  const closePanel = () => setSwipeModal(false);
  const closeCompanyLogo = () => {
    setCompanyLogo(undefined);
    setImageData([]);
  };

  const chooseFileGallery = () => {
    if (true) {
      let option: ImageLibraryOptions = {
        mediaType: 'photo',
        selectionLimit: 1,
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
            setCompanyLogo(assets![0]);
            imageData?.push({uri: assets![0].uri});
            setImageData(imageData);
          } else {
            showToast(t('addManager:imageError'));
          }
          closePanel();
        }
      });
    }
  };

  const resetData = () => {
    resetCompanyData();
    locationModalRef.current = {lat: undefined, lng: undefined};
    closeCompanyLogo();
    setIsSubmitClicked(false);
    setReset(true);
    formikRef.current?.resetForm();
  };

  useEffect(() => {
    if (editIsError && editError) {
      setLoader(false);
      const err: any = error;
      if (err?.error) {
        showToast(err.error);
      } else {
        err?.data?.error
          ? err?.data?.error?.map((errorItem: companyError) =>
              errorItem.param.includes('officeAddress.zipcode')
                ? formikRef.current?.setFieldError('zipcode', errorItem.msg)
                : formikRef.current?.setFieldError(
                    errorItem.param,
                    errorItem.msg,
                  ),
            )
          : showToast(err?.data?.message);
      }
    } else if (editIsSuccess) {
      setLoader(false);
      showToast(editData?.message);
      props.route.params?.callFetchProfileApi?.();
      props.route.params?.callFetchCompanyApi?.();
      isSubmitClicked ? props.navigation.goBack() : null;
      resetData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editError, editData, editIsSuccess]);

  const onSubmit = async (companyFormValues: Company) => {
    setLoader(true);
    let addCompanyLogo;

    if (companyLogo) {
      if (!companyLogo?.uri?.startsWith('http')) {
        addCompanyLogo = await getUploadDocument(
          companyLogo,
          `addCompany${moment().format()}`,
        );
      } else {
        addCompanyLogo = companyLogo.uri;
      }
    }
    const requestObj = createCompanyRequestObj(
      companyFormValues,
      addCompanyLogo,
      locationModalRef,
    );
    if (netStatus) {
      if (isEdit) {
        let newReqObject = {
          ...requestObj,
          companyId: companyDetails?._id,
        };
        editCompany(newReqObject);
      } else {
        addCompany(requestObj);
      }
    } else {
      showToast(t('noNetwork'));
      setLoader(false);
    }
  };

  const styles = Styles();

  const onSelectPlace = (
    value: GooglePlaceData | undefined,
    location: locationModal,
    currentLocation: string | undefined,
    pinCode?: string,
  ) => {
    onSelectCompanyLocation(
      value,
      location,
      currentLocation,
      pinCode,
      formikRef,
    );
    locationModalRef.current = location;
  };
  return (
    // <Stack>
    <Formik<Company>
      initialValues={InitialValues}
      innerRef={formikRef}
      validateOnMount
      onSubmit={onSubmit}
      validationSchema={AddCompanySchema}>
      {({setFieldValue, handleSubmit}) => {
        const addMore = () => {
          setIsSubmitClicked(false);
          // resetForm();
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
              label={
                isEdit
                  ? t('homePage:editOfficeLocation')
                  : t('homePage:addCompany')
              }
              translateY={translateY}
            />

            <Animated.ScrollView
              showsVerticalScrollIndicator={false}
              keyboardDismissMode="on-drag"
              onScroll={scrollHandler}
              scrollEventThrottle={16}>
              <KeyboardAwareScrollView bounces={false} overScrollMode={'never'}>
                <Stack spaceBelow={70}>
                  <StackItem childrenGap={16} spacing={16} spaceBelow={16}>
                    <FormikTextField
                      name="name"
                      value={InitialValues.name}
                      label={t('addCompany:name')}
                      placeholder={t('addCompany:name')}
                      onChangeInput={value => (InitialValues.name = value)}
                      keyboardType={'email-address'}
                      autoComplete={'off'}
                      maxLength={validations?.companyNameLimit.MAX}
                    />
                    {isEdit ? (
                      <FormikTextField
                        name="website"
                        value={InitialValues.website}
                        label={t('addCompany:URL')}
                        editable={false}
                      />
                    ) : (
                      <FormikDropdownPicker
                        options={allCompanyData}
                        value={companyValue}
                        name="website"
                        label={t('addCompany:URL')}
                        onSelect={item => {
                          setCompanyValue(item.label);
                          InitialValues.website = item.value;
                        }}
                        placeholder={t('addManager:dropdownPlaceholder')}
                      />
                    )}

                    <FormikPhoneField
                      // ref={phoneInput}
                      label={t('addCompany:contact')}
                      value={InitialValues.contact}
                      placeholder={t('addCompany:contactPlaceholder')}
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
                      name="contact"
                      onChangeInput={value => {
                        setReset(false);
                        InitialValues.contact = value;
                      }}
                    />
                    <FormikTextField
                      name="officeTelephone"
                      value={InitialValues.officeTelephone}
                      label={t('addCompany:officeTelephone')}
                      placeholder={t('addCompany:officeTelephonePlaceHolder')}
                      keyboardType={'number-pad'}
                      autoComplete={'off'}
                      onChangeInput={value =>
                        (InitialValues.officeTelephone = value)
                      }
                      maxLength={validations?.telephoneLimit.MAX}
                    />
                    <TouchableOpacity
                      onPress={() =>
                        takeLocationPermission(showAlert, openModal)
                      }>
                      <FormikTextField
                        name="address"
                        label={t('addCompany:address')}
                        placeholder={t('addCompany:address')}
                        RenderRightContainer={() => (
                          <GPS style={styles.gpsIcon} />
                        )}
                        editable={false}
                        // enableBackground={true}
                      />
                    </TouchableOpacity>
                    <FormikTextField
                      name="landmark"
                      label={t('addCompany:landmark')}
                      placeholder={t('addCompany:landmarkPlaceholder')}
                      keyboardType={'email-address'}
                      autoComplete={'off'}
                      maxLength={validations?.landmarkLimit.MAX}
                    />

                    <Stack horizontal center horizontalAlign="space-between">
                      <View style={styles.fieldView}>
                        <FormikTextField
                          name="country"
                          label={t('addCompany:country')}
                          placeholder={t(
                            'addCompany:countryDropdownPlaceholder',
                          )}
                          keyboardType={'email-address'}
                          autoComplete={'off'}
                          editable={false}
                          // enableBackground={true}
                        />
                      </View>
                      <View style={styles.fieldView}>
                        <FormikTextField
                          name="state"
                          label={t('addCompany:state')}
                          placeholder={t('addCompany:stateDropdownPlaceholder')}
                          keyboardType={'email-address'}
                          autoComplete={'off'}
                          editable={false}
                          // enableBackground={true}
                        />
                      </View>
                    </Stack>
                    <Stack
                      horizontal
                      style={styles.rowVerticalStyle}
                      horizontalAlign="space-between">
                      <View style={[styles.fieldView]}>
                        <FormikTextField
                          name="city"
                          value={InitialValues.city}
                          label={t('addCompany:city')}
                          placeholder={t('addCompany:cityDropdownPlaceholder')}
                          keyboardType={'email-address'}
                          autoComplete={'off'}
                          onChangeInput={value => (InitialValues.city = value)}
                          maxLength={validations?.cityLimit.MAX}
                        />
                      </View>
                      <View style={styles.fieldView}>
                        <FormikTextField
                          name="zipcode"
                          value={InitialValues.zipcode}
                          label={t('addCompany:zipcode')}
                          placeholder={t('addCompany:zipcode')}
                          keyboardType="email-address"
                          onChangeInput={value =>
                            (InitialValues.zipcode = value)
                          }
                          autoComplete={'off'}
                        />
                      </View>
                    </Stack>
                    <Stack>
                      <TextView
                        weight="regular"
                        variant={FontSizes.regular}
                        style={styles.label}>
                        {t('addCompany:logo')}
                      </TextView>
                      <TouchableOpacity
                        onPress={() =>
                          companyLogo ? setIsVisible(true) : setSwipeModal(true)
                        }
                        style={styles.companyLogo}>
                        {companyLogo ? (
                          <Stack>
                            <Image
                              source={{
                                uri: companyLogo?.uri,
                              }}
                              style={styles.companyLogoStyle}
                            />
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
            {isEdit ? (
              <PrimaryButton
                title={t('save')}
                onPress={onSave}
                style={styles.saveEditBtn}
              />
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
            {loader && <Loader />}
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
