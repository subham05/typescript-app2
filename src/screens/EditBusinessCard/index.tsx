import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {getUploadDocument} from 'common/utils/Amazon-S3';
import {AlertPermission} from 'common/utils/permission/Alert';
import {
  checkCameraPermission,
  getCameraPermission,
} from 'common/utils/permission/ReadCamera';
import {
  checkGalleryPermission,
  getGalleryPermission,
} from 'common/utils/permission/ReadGallery';
import {showToast} from 'common/utils/ToastMessage';
import {Container, TextView} from 'components';
import {PrimaryButton} from 'components/Buttons';
import DeleteModal from 'components/DeleteModal';
import {FormikTextField} from 'components/formikFields';
import {FormikPhoneField} from 'components/formikFields/FormikPhoneField';
import Header from 'components/Header';
import {Icon} from 'components/Icon';
import {IconButton} from 'components/IconButtons';
import Loader from 'components/Loader';
import {Persona} from 'components/Persona';
import {Stack, StackItem} from 'components/Stack';
import {Formik, FormikProps} from 'formik';
import moment from 'moment';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Alert, Image, Platform, TouchableOpacity} from 'react-native';
import {
  Asset,
  ImageLibraryOptions,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {
  useAddBusinessCardMutation,
  useGetBusinessCardDataMutation,
} from 'request/AddBusinessCard';
import {addBusinessCardModel} from 'request/AddBusinessCard/constant';
import {companyError} from 'request/AddCompany';
import {useAppSelector} from 'store/hooks';
import {CreateContactBottomPanel} from './components/BottomPanel';
import {InitialValues} from './constants';
import {Styles} from './index.styles';
import {EditBusinessCardSchema} from './utils';
import ImagePicker, {Image as CropImage} from 'react-native-image-crop-picker';
import DeviceInfo from 'react-native-device-info';
type Props = NativeStackScreenProps<SignedInStackParamList, 'EditBusinessCard'>;

export const EditBusinessCard = (props: Props) => {
  const {t} = useTranslation();
  const translateY = useSharedValue(0);
  const {ocrData, edit} = props.route.params;
  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  const formikRef = useRef<FormikProps<addBusinessCardModel> | null>(null);
  const [isPanelActive, setIsPanelActive] = useState<boolean>(false);
  const [reopenModal, setReopenModal] = useState<boolean>(false);
  const [orcUrl, setOcrUrl] = useState<string>();
  const [croppedImg, setCroppedImg] = useState<string>();
  const [loader, setLoader] = useState<boolean>(false);
  const [companyLogo, setCompanyLogo] = useState<Asset>();
  const [selectedContactType, setSelectedContactType] = useState<
    string | undefined
  >('PUBLIC');
  const {validations} = useAppSelector(state => state?.formanagement);

  const [
    getBusinessCard,
    {
      data: businessCardData,
      isSuccess: businessCardSuccess,
      error: businessCardError,
      isError: businessCardIsError,
    },
  ] = useGetBusinessCardDataMutation();

  const [addBusinessCard, {data, isLoading, isSuccess, isError, error}] =
    useAddBusinessCardMutation();

  useEffect(() => {
    if (ocrData) {
      setLoader(true);
      getBusinessCardData();
    }
    return () => {
      InitialValues.companyName = '';
      InitialValues.contactPhone = '';
      InitialValues.alternateContact = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ocrData]);
  const getUploadCroppedImg = async (cropImage: CropImage) => {
    const croppedObj = {
      fileName: Platform.OS === 'ios' ? cropImage.filename : '',
      fileSize: cropImage.size,
      height: cropImage.height,
      type: cropImage.mime,
      uri: cropImage.path,
      width: cropImage.width,
    };
    const croppedImage = await getUploadDocument(
      croppedObj,
      `businessCardMedia${moment().format()}`,
    );
    if (croppedImage) {
      setCroppedImg(`${croppedImage}`);
      const obj = {imageUrl: croppedImage};
      getBusinessCard(obj);
    }
  };
  const getBusinessCardData = async () => {
    const imageUrl = await getUploadDocument(
      ocrData,
      `businessCardMedia${moment().format()}`,
    );
    if (imageUrl) {
      setOcrUrl(`${imageUrl}`);
      openCropper(`${imageUrl}`);
    }
  };
  const openCropper = (imageUrl: string) => {
    ImagePicker.openCropper({
      mediaType: 'photo',
      path: imageUrl,
    })
      .then(image => {
        getUploadCroppedImg(image);
      })
      .catch(() => {
        showAlert(imageUrl);
      });
  };
  const showAlert = (imageUrl: string) => {
    Alert.alert(t('businessCard:cropTitle'), t('businessCard:cropImgAlert'), [
      {
        text: 'Select',
        onPress: () => openCropper(imageUrl),
      },
    ]);
  };
  const getPhoneNumber = (cardTextArray: string[]) => {
    const phoneRegex =
      /^(([a-z A-Z]+.|@|@.|#|!|%|©|&|])\s+)?[\+]?([0-9][\s]?|[0-9]?)([(][0-9]{3}[)][\s\.]?|[0-9]{3}[-\s\.]?)[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    const getPhone = cardTextArray.filter(item => phoneRegex.test(item.trim()));
    const contactPhone =
      getPhone.length > 0
        ? getPhone[0].trim().length > 12
          ? getPhone[0]
              .trim()
              .slice(getPhone[0].trim().length - 12, getPhone[0].trim().length)
          : getPhone[0].trim()
        : '';
    const alternate =
      getPhone.length > 1
        ? getPhone[1].trim().length > 12
          ? getPhone[1]
              .trim()
              .slice(getPhone[1].trim().length - 12, getPhone[1].trim().length)
          : getPhone[1].trim()
        : contactPhone;
    formikRef.current?.setFieldValue('contactPhone', contactPhone);
    formikRef.current?.setFieldValue('alternateContact', alternate);
    const getId =
      getPhone.length > 0
        ? cardTextArray.findIndex(text => text === getPhone[0])
        : -1;
    if (getId !== -1) {
      cardTextArray.splice(getId, 1);
    }
    const getId1 =
      getPhone.length > 1
        ? cardTextArray.findIndex(text => text === getPhone[1])
        : -1;
    if (getId !== -1) {
      cardTextArray.splice(getId1, 1);
    }
    getMailAddress(cardTextArray);
  };
  const getMailAddress = (cardTextArray: string[]) => {
    const mailReg1 = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    const mailReg = /@\w+(\.\w+)/;
    const getMail = cardTextArray.find(item => mailReg.test(item.trim()));
    if (getMail && mailReg1.test(getMail)) {
      formikRef.current?.setFieldValue('workEmail', getMail);
    } else {
      const getMailArray = getMail?.split(/\s+/);
      const getWorkMail = getMailArray?.find(item => mailReg1.test(item));
      formikRef.current?.setFieldValue('workEmail', getWorkMail || '');
    }
    const getId = getMail
      ? cardTextArray.findIndex(text => text === getMail)
      : -1;
    if (getId !== -1) {
      cardTextArray.splice(getId, 1);
    }
    getContactName(cardTextArray);
  };
  const getContactName = (cardTextArray: string[]) => {
    const nameRegex = /^\w+\s+\w+/;
    const getName = cardTextArray.find(item => nameRegex.test(item.trim()));
    formikRef.current?.setFieldValue('companyName', getName);
    formikRef.current?.setFieldValue('contactName', getName);
    const getId = getName
      ? cardTextArray.findIndex(text => text === getName)
      : -1;
    if (getId !== -1) {
      cardTextArray.splice(getId, 1);
    }
    getContactDesignation(cardTextArray);
  };
  const getContactDesignation = (cardTextArray: string[]) => {
    const designationRegex = /^\w+\S/;
    const getDesignation = cardTextArray.find(item =>
      designationRegex.test(item.trim()),
    );
    formikRef.current?.setFieldValue('contactDesignation', getDesignation);
    formikRef.current?.setFieldValue('contactDepartment', getDesignation);
    const getId = getDesignation
      ? cardTextArray.findIndex(text => text === getDesignation)
      : -1;
    if (getId !== -1) {
      cardTextArray.splice(getId, 1);
    }
    const getAddress = cardTextArray.join(',');
    formikRef.current?.setFieldValue('contactAddress', getAddress);
  };
  useEffect(() => {
    if (error && isError) {
      const err: any = error;
      if (err?.error) {
        showToast(err.error);
      } else {
        err?.data?.error
          ? err?.data?.error?.map((errorItem: companyError) =>
              formikRef.current?.setFieldError(errorItem.param, errorItem.msg),
            )
          : showToast(err?.data?.message);
      }
    }
    if (data && isSuccess) {
      showToast(data.message);
      formikRef.current?.resetForm();
      InitialValues.companyName = '';
      props.navigation.goBack();
      setCompanyLogo(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isSuccess, isError, error]);

  useEffect(() => {
    if (businessCardError && businessCardIsError) {
      const err: any = businessCardError;
      if (err?.error) {
        showToast(err.error);
      } else {
        err?.data?.error
          ? showToast(err?.data?.error![0]?.msg)
          : showToast(err?.data?.message);
      }
      setLoader(false);
    }
    if (businessCardData && businessCardSuccess && !businessCardError) {
      const {message} = businessCardData;
      showToast(message);
      // InitialValues.companyName = businessCardData?.data?.text;
      // formikRef.current?.setFieldValue(
      //   'companyName',
      //   businessCardData?.data?.text,
      // );
      const cardText = businessCardData?.data?.text;
      const cardTextArray = cardText.split(',');

      getPhoneNumber(cardTextArray);
      setLoader(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessCardData, businessCardError]);

  const openPanel = () => setIsPanelActive(true);

  const closePanel = () => setIsPanelActive(false);

  const chooseFileCamera = () => {
    if (true) {
      let option: ImageLibraryOptions = {
        mediaType: 'photo',
      };
      launchCamera(option, response => {
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
          } else {
            showToast(t('addManager:imageError'));
          }
          closePanel();
        }
      });
    }
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
            setCompanyLogo(assets![0]);
          } else {
            showToast(t('addManager:imageError'));
          }
          closePanel();
        }
      });
    }
  };

  const takePermissionCamera = () => {
    checkCameraPermission().then(res => {
      if (!res.isPermissionGranted) {
        if (res.result === 'denied') {
          getCameraPermission().then(resp => {
            const {statuses, isPermissionGranted} = resp;
            isPermissionGranted && chooseFileCamera();
            (statuses['ios.permission.CAMERA'] === 'blocked' ||
              statuses['android.permission.CAMERA'] === 'blocked') &&
              AlertPermission(t('permissions:camera'));
          });
        } else if (res.result === 'blocked') {
          AlertPermission(t('permissions:camera'));
        }
      } else {
        chooseFileCamera();
      }
    });
  };

  const takePermissionGallery = () => {
    checkGalleryPermission().then(res => {
      if (!res.isPermissionGranted) {
        if (res.result === 'denied') {
          getGalleryPermission().then(resp => {
            const {statuses, isPermissionGranted} = resp;
            isPermissionGranted && chooseFileGallery();
            (statuses['android.permission.READ_EXTERNAL_STORAGE'] ===
              'blocked' ||
              statuses['ios.permission.PHOTO_LIBRARY'] === 'blocked') &&
              AlertPermission(t('permissions:gallery'));
          });
        } else if (res.result === 'blocked') {
          AlertPermission(t('permissions:gallery'));
        }
      } else {
        chooseFileGallery();
      }
    });
  };

  const onSubmit = async (addBusinessCardFormValues: addBusinessCardModel) => {
    console.log('Innn');
    let contactLogo;
    if (companyLogo) {
      contactLogo = await getUploadDocument(
        companyLogo,
        `businessCardProfile${moment().format()}`,
      );
    }
    const {
      contactPhoneCountryCode,
      alternateContactCountryCode,
      alternateContact,
    } = addBusinessCardFormValues;
    addBusinessCardFormValues.contactProfile = `${contactLogo}`;
    // addBusinessCardFormValues.businessCardImage = orcUrl;
    // addBusinessCardFormValues.cropImage = croppedImg;
    addBusinessCardFormValues.businessCardImage = {
      url: orcUrl,
      type: ocrData?.type,
      businessCardFileExt: decodeURIComponent(ocrData?.fileName!)
        .split('.')
        .pop(),
      businessCardFileName: ocrData?.fileName,
    };
    addBusinessCardFormValues.cropImage = {
      url: croppedImg,
      type: ocrData?.type,
      businessCardFileExt: decodeURIComponent(ocrData?.fileName!)
        .split('.')
        .pop(),
      businessCardFileName: ocrData?.fileName,
    };
    addBusinessCardFormValues.contactType = selectedContactType;
    addBusinessCardFormValues.contactPhoneCountryCode = contactPhoneCountryCode
      ? contactPhoneCountryCode
      : '91';
    addBusinessCardFormValues.alternateContactCountryCode = alternateContact
      ? alternateContactCountryCode
        ? alternateContactCountryCode
        : '91'
      : '';
    addBusinessCard(addBusinessCardFormValues);
  };

  const renderLeftContainer = () => {
    return (
      <IconButton
        name="delete"
        onPress={() => setReopenModal(true)}
        color={colors.black}
        size={22}
      />
    );
  };

  const styles = Styles();
  return (
    <Formik<addBusinessCardModel>
      initialValues={InitialValues}
      innerRef={formikRef}
      onSubmit={onSubmit}
      validationSchema={EditBusinessCardSchema}>
      {({handleSubmit, setFieldValue, values}) => {
        return (
          <Container noSpacing>
            <Header
              navigationType="STACK"
              label={t('businessCard:head')}
              translateY={translateY}
              RenderLeftContainer={edit ? renderLeftContainer : undefined}
            />
            {/* <TouchableOpacity
              onPress={getBusinessCardData}
              style={{width: 70, height: 40, backgroundColor: 'red'}}>
              <Text>Click me</Text>
            </TouchableOpacity> */}
            <Animated.ScrollView
              showsVerticalScrollIndicator={false}
              onScroll={scrollHandler}
              scrollEventThrottle={16}>
              <KeyboardAwareScrollView bounces={false} overScrollMode={'never'}>
                <StackItem childrenGap={16} spacing={16} spaceBelow={180}>
                  <TouchableOpacity onPress={() => openPanel()}>
                    <StackItem childrenGap={10} spaceBelow={16}>
                      {edit || (companyLogo && companyLogo?.fileName) ? (
                        <Image
                          source={{
                            uri: companyLogo?.uri,
                          }}
                          style={styles.photoView}
                        />
                      ) : (
                        <Stack style={styles.photoView}>
                          {edit ? (
                            <Persona name={values.contactName} size={72} />
                          ) : (
                            <Icon
                              name="camera"
                              color={colors.white}
                              size={22}
                            />
                          )}
                        </Stack>
                      )}

                      <TextView
                        weight="regular"
                        variant={FontSizes.regular}
                        style={styles.photoText}>
                        {t('contacts:changePhoto')}
                      </TextView>
                    </StackItem>
                  </TouchableOpacity>
                  <FormikTextField
                    name="companyName"
                    value={InitialValues.companyName}
                    placeholder={t('businessCard:companyName')}
                    keyboardType={'email-address'}
                    autoComplete={'off'}
                    maxLength={validations?.companyNameLimit.MAX}
                  />
                  <FormikTextField
                    name="contactName"
                    label={t('businessCard:contactName')}
                    placeholder={t('businessCard:contactName')}
                    keyboardType={'email-address'}
                    autoComplete={'off'}
                    maxLength={validations?.nameLength.MAX}
                  />
                  <FormikTextField
                    name="contactDesignation"
                    label={t('businessCard:designation')}
                    placeholder={t('businessCard:designation')}
                    keyboardType={'email-address'}
                    autoComplete={'off'}
                    maxLength={validations?.designationLength.MAX}
                  />
                  <FormikTextField
                    name="contactIndustry"
                    label={t('businessCard:industry')}
                    placeholder={t('businessCard:industry')}
                    keyboardType={'email-address'}
                    autoComplete={'off'}
                    maxLength={validations?.companyContactIndustry.MAX}
                  />
                  <FormikTextField
                    name="contactDepartment"
                    label={t('businessCard:department')}
                    placeholder={t('businessCard:department')}
                    keyboardType={'email-address'}
                    autoComplete={'off'}
                    maxLength={validations?.departmentLength.MAX}
                  />
                  <FormikTextField
                    name="contactSector"
                    label={t('businessCard:sector')}
                    placeholder={t('businessCard:sector')}
                    keyboardType={'email-address'}
                    autoComplete={'off'}
                    maxLength={validations?.companyContactSector.MAX}
                  />
                  <FormikTextField
                    name="contactField"
                    label={t('businessCard:field')}
                    placeholder={t('businessCard:fieldPlaceHolder')}
                    keyboardType={'email-address'}
                    autoComplete={'off'}
                    maxLength={validations?.companyContactField.MAX}
                  />
                  <FormikTextField
                    name="workEmail"
                    label={t('businessCard:workEmail')}
                    placeholder={t('businessCard:workEmailPlaceholder')}
                    keyboardType={'email-address'}
                    autoComplete={'email'}
                    // maxLength={validations?.email.MAX}
                  />
                  <FormikPhoneField
                    // ref={phoneInput}
                    label={t('businessCard:contactNumber')}
                    placeholder={t('businessCard:contactNumberPlaceholder')}
                    defaultCode="IN"
                    layout="second"
                    containerStyle={styles.contactContainerStyle}
                    onChangeCountry={country =>
                      setFieldValue(
                        'contactPhoneCountryCode',
                        `${country.callingCode[0]}`,
                      )
                    }
                    name="contactPhone"
                  />
                  <FormikPhoneField
                    // ref={phoneInput}
                    label={t('businessCard:alternateNumber')}
                    placeholder={t('businessCard:alternateNumberPlaceholder')}
                    defaultCode="IN"
                    layout="second"
                    containerStyle={styles.contactContainerStyle}
                    onChangeCountry={country =>
                      setFieldValue(
                        'alternateContactCountryCode',
                        `${country.callingCode[0]}`,
                      )
                    }
                    name="alternateContact"
                  />

                  <FormikTextField
                    name="contactAddress"
                    label={t('businessCard:address')}
                    placeholder={t('businessCard:address')}
                    keyboardType={'email-address'}
                    autoComplete={'postal-address'}
                    // maxLength={100}
                  />
                  <StackItem horizontal childrenGap={16}>
                    {
                      <TouchableOpacity
                        onPress={() => setSelectedContactType('PUBLIC')}>
                        <StackItem
                          horizontal
                          verticalAlign="center"
                          childrenGap={10}>
                          <Icon
                            name="public_mark"
                            size={20}
                            color={
                              selectedContactType === 'PUBLIC'
                                ? colors.primary
                                : colors.primary_008
                            }
                          />
                          <TextView
                            weight="regular"
                            variant={FontSizes.regular}
                            style={{
                              color:
                                selectedContactType === 'PUBLIC'
                                  ? colors.primary
                                  : colors.primary_008,
                            }}>
                            {t('contacts:markPublic')}
                          </TextView>
                        </StackItem>
                      </TouchableOpacity>
                    }

                    {
                      <TouchableOpacity
                        onPress={() => setSelectedContactType('PRIVATE')}>
                        <StackItem
                          horizontal
                          verticalAlign="center"
                          childrenGap={10}>
                          <Icon
                            name="private_mark"
                            size={20}
                            color={
                              selectedContactType === 'PRIVATE'
                                ? colors.primary
                                : colors.primary_008
                            }
                          />
                          <TextView
                            weight="regular"
                            variant={FontSizes.regular}
                            style={{
                              color:
                                selectedContactType === 'PRIVATE'
                                  ? colors.primary
                                  : colors.primary_008,
                            }}>
                            {t('contacts:markPrivate')}
                          </TextView>
                        </StackItem>
                      </TouchableOpacity>
                    }
                  </StackItem>
                </StackItem>
              </KeyboardAwareScrollView>
            </Animated.ScrollView>
            <Stack spacing={16} spaceBelow={16}>
              <PrimaryButton title={t('save')} onPress={handleSubmit} />
            </Stack>
            {isPanelActive && (
              <CreateContactBottomPanel
                panelState={isPanelActive}
                onPressClose={() => closePanel()}
                props={props}
                isCameraOpen={value => {
                  if (value) {
                    takePermissionCamera();
                  }
                }}
                isGalleryOpen={value => {
                  if (value) {
                    if (Platform.OS === 'ios') {
                      takePermissionGallery();
                    } else if (
                      parseInt(DeviceInfo.getSystemVersion(), 10) < 13
                    ) {
                      takePermissionGallery();
                    } else {
                      chooseFileGallery();
                    }
                  }
                }}
              />
            )}
            {reopenModal && (
              <DeleteModal
                // itemId={item?._id!}
                reopenModal={reopenModal}
                setReopenModal={value => setReopenModal(value)}
                onDeleteClick={() => {}}
              />
            )}
            {(isLoading || loader) && <Loader />}
          </Container>
        );
      }}
    </Formik>
  );
};
