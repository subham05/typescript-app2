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
import {BackHandler, Image, Platform, TouchableOpacity} from 'react-native';
import {
  Asset,
  ImageLibraryOptions,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
// import PhoneInput from 'react-native-phone-number-input';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {companyError} from 'request/AddCompany';
import {
  useLazyAddNewContactQuery,
  useLazyDeleteContactQuery,
  useLazyEditContactQuery,
} from 'request/ContactRepository';
import {useAppSelector} from 'store/hooks';
import {CreateContactBottomPanel} from './components/BottomPanel';
import {InitialValues} from './constants';
import {Styles} from './index.styles';
import {ContactFormModel} from './types';
import {EditBusinessCardSchema} from './utils';
import DeviceInfo from 'react-native-device-info';
import {ProfileImageDetailsObj} from 'screens/AddEmployee';

type Props = NativeStackScreenProps<SignedInStackParamList, 'CreateContact'>;

export const CreateContactScreen = (props: Props) => {
  const {navigation} = props;
  const {t} = useTranslation();
  const [addContact, addContactResult] = useLazyAddNewContactQuery();
  // const [addContact, addContactResult] = useAddNewContactMutation();
  const [editContact, editContactResult] = useLazyEditContactQuery();
  const [deleteContact, deleteContactResult] = useLazyDeleteContactQuery();

  const {validations} = useAppSelector(state => state?.formanagement);

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  const {route} = {...props};
  const {edit, item} = {
    ...route.params,
  };
  /**********************************************************************State start ********************************************************************** */
  const [isPanelActive, setIsPanelActive] = useState(false);
  const [contactPhoto, setContactPhoto] = useState<Asset>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isContactNoError, setIsContactNoError] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isAltContactNoError, setIsAltContactNoError] =
    useState<boolean>(false);
  const [initialItemValue, setInitialItemValue] = useState<ContactFormModel>(
    item!,
  );
  const [reopenModal, setReopenModal] = useState<boolean>(false);
  const [selectedContactType, setSelectedContactType] = useState<
    string | undefined
  >(item ? item.contactType : 'PUBLIC');
  /**********************************************************************State End ********************************************************************** */

  const openPanel = () => {
    setIsPanelActive(true);
  };

  const closePanel = () => {
    setIsPanelActive(false);
  };
  /**********************************************************************UseEffect start ********************************************************************** */
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', _handleBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', _handleBackPress);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const _handleBackPress = () => {
    props.navigation.goBack();
    return true;
  };

  useEffect(() => {
    if (
      addContactResult?.isError ||
      editContactResult?.isError ||
      deleteContactResult?.isError
    ) {
      const err: any = addContactResult?.isError
        ? addContactResult?.error
        : editContactResult?.isError
        ? editContactResult?.error
        : deleteContactResult?.isError
        ? deleteContactResult?.error
        : null;
      if (err?.error) {
        showToast(err?.error?.data?.message);
      } else {
        err?.data?.error
          ? err?.data?.error?.map((errorItem: companyError) =>
              formikRef.current?.setFieldError(errorItem.param, errorItem.msg),
            )
          : showToast(
              Array.isArray(err?.data?.error)
                ? err?.data?.error[0]?.msg
                : err?.data?.message,
            );
        // showToast(err?.data?.error[0]?.msg);
      }
    }
    if (addContactResult?.currentData?.message) {
      showToast(addContactResult?.currentData?.message);
      navigation.goBack();
    }
    if (editContactResult?.currentData?.message) {
      showToast(editContactResult.currentData.message);
      navigation.goBack();
    }
    if (deleteContactResult?.currentData?.message) {
      showToast(deleteContactResult.currentData.message);
      navigation.goBack();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addContactResult, editContactResult, deleteContactResult]);
  const formikRef = useRef<FormikProps<ContactFormModel> | null>(null);
  useEffect(() => {
    if (edit && item) {
      const {
        companyName,
        alternateContact,
        alternateContactCountryCode,
        contactAddress,
        contactDepartment,
        contactDesignation,
        contactEmail,
        contactName,
        contactPhone,
        contactPhoneCountryCode,
        contactProfile,
        contactSector,
        contactType,
        _id,
      } = item;
      const tempInitialValueObj = {
        companyName: companyName,
        contactName: contactName,
        contactDesignation: contactDesignation,
        contactDepartment: contactDepartment,
        contactSector: contactSector,
        contactEmail: contactEmail![0],
        contactAddress: contactAddress,
        contactType: contactType,
        contactProfile: contactProfile,
        contactPhone: contactPhone,
        contactPhoneCountryCode: contactPhoneCountryCode,
        alternateContact: alternateContact,
        alternateContactCountryCode: alternateContactCountryCode,
        _id: _id,
      };
      setInitialItemValue(tempInitialValueObj);
      formikRef.current?.setFieldValue('contactEmail', contactEmail![0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);

  /**********************************************************************Image Upload function End ********************************************************************** */

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
            setContactPhoto(assets![0]);
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
            setContactPhoto(assets![0]);
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
            (statuses['ios.permission.CAMERA'] === 'blocked' ||
              statuses['android.permission.CAMERA'] === 'blocked') &&
              AlertPermission(t('permissions:camera'));
            isPermissionGranted && chooseFileCamera();
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
            const {isPermissionGranted, statuses} = resp;
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
  /**********************************************************************OnSubmit start ********************************************************************** */

  const onSubmit = async (values: ContactFormModel) => {
    const contactImageResult = contactPhoto
      ? await getUploadDocument(
          contactPhoto,
          `contactMedia${moment().format()}`,
        )
      : '';
    const contactImageObj: ProfileImageDetailsObj = {
      url: contactImageResult,
      profileFileExt: decodeURIComponent(contactPhoto?.fileName!)
        .split('.')
        .pop()!,
      profileFileName: contactPhoto?.fileName,
      type: contactPhoto?.type,
    };
    const {
      contactAddress,
      companyName,
      contactDepartment,
      contactDesignation,
      contactEmail,
      contactSector,
      contactName,
      alternateContactCountryCode,
      contactPhoneCountryCode,
      alternateContact,
      contactPhone,
      _id,
    } = values;
    const contactObject = edit
      ? {
          companyName: companyName,
          contactName: contactName,
          contactProfile: contactImageResult
            ? `${contactImageResult}`
            : initialItemValue.contactProfile,
          contactProfileDetails: contactImageResult
            ? contactImageObj
            : initialItemValue.contactImageObj,
          contactDesignation: contactDesignation,
          contactDepartment: contactDepartment,
          contactIndustry: '',
          contactField: '',
          contactSector: contactSector,
          workEmail: contactEmail,
          contactPhoneCountryCode: contactPhoneCountryCode
            ? contactPhoneCountryCode
            : '91',
          contactPhone: contactPhone,
          alternateContactCountryCode: alternateContact
            ? alternateContactCountryCode
              ? alternateContactCountryCode
              : '91'
            : '',
          alternateContact: alternateContact,
          contactAddress: contactAddress,
          contactType: selectedContactType,
          businessCardImage: contactImageResult
            ? `${contactImageResult}`
            : initialItemValue.contactProfile,
        }
      : {
          companyName: companyName,
          contactName: contactName,
          contactProfile: `${contactImageResult}`,
          contactProfileDetails: contactImageObj,
          contactDesignation: contactDesignation,
          contactDepartment: contactDepartment,
          contactIndustry: '',
          contactField: '',
          contactSector: contactSector,
          workEmail: contactEmail,
          contactPhoneCountryCode: contactPhoneCountryCode
            ? contactPhoneCountryCode
            : '91',
          contactPhone: contactPhone,
          alternateContactCountryCode: alternateContact
            ? alternateContactCountryCode
              ? alternateContactCountryCode
              : '91'
            : '',
          alternateContact: alternateContact,
          contactAddress: contactAddress,
          contactType: selectedContactType,
          businessCardImage: `${contactImageResult}`,
        };

    edit
      ? editContact({contactObj: contactObject, contactId: _id})
      : addContact(contactObject)
          .unwrap()
          .then(res => console.log('unwrap res->', res))
          .catch(err => console.log('unwrap err', err));
  };

  const renderLeftContainer = () => {
    return (
      // <TouchableOpacity onPress={() => }>
      <IconButton
        name="delete"
        onPress={() => setReopenModal(true)}
        color={colors.black}
        size={22}
      />
      // </TouchableOpacity>
    );
  };

  const styles = Styles();
  return (
    <Formik<ContactFormModel>
      initialValues={edit ? initialItemValue : InitialValues}
      innerRef={formikRef}
      enableReinitialize
      validateOnMount
      onSubmit={values => {
        onSubmit(values);
      }}
      validationSchema={EditBusinessCardSchema}>
      {({handleSubmit, setFieldValue}) => {
        return (
          <Container noSpacing>
            <Header
              navigationType="STACK"
              label={
                edit ? t('businessCard:editHead') : t('businessCard:createHead')
              }
              translateY={translateY}
              RenderLeftContainer={edit ? renderLeftContainer : undefined}
            />
            <Animated.ScrollView
              showsVerticalScrollIndicator={false}
              keyboardDismissMode="on-drag"
              onScroll={scrollHandler}
              scrollEventThrottle={16}>
              <KeyboardAwareScrollView bounces={false} overScrollMode={'never'}>
                <StackItem childrenGap={16} spacing={16} spaceBelow={180}>
                  <TouchableOpacity onPress={() => openPanel()}>
                    <StackItem childrenGap={10} spaceBelow={16}>
                      {edit &&
                      initialItemValue?.contactProfile !== 'image url' && // need to change condition
                      !contactPhoto ? (
                        <Image
                          source={{uri: initialItemValue?.contactProfile}}
                          style={styles.photoView}
                        />
                      ) : contactPhoto && contactPhoto.uri ? (
                        <Image
                          source={{
                            uri: contactPhoto?.uri,
                          }}
                          style={styles.photoView}
                        />
                      ) : (
                        <Stack style={styles.photoView}>
                          {edit && item && item.contactName ? (
                            <Persona name={item.contactName} size={72} />
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
                        {edit
                          ? t('contacts:changePhoto')
                          : t('contacts:addPhoto')}
                      </TextView>
                    </StackItem>
                  </TouchableOpacity>
                  <FormikTextField
                    name="companyName"
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
                    name="contactEmail"
                    label={t('businessCard:workEmail')}
                    placeholder={t('businessCard:workEmailPlaceholder')}
                    keyboardType={'email-address'}
                    autoComplete={'email'}
                    // value={InitialValues?.contactEmail}
                    // maxLength={validations?.email.MAX}
                  />
                  <FormikPhoneField
                    // ref={phoneInput}
                    label={t('businessCard:contactNumber')}
                    placeholder={t('businessCard:contactNumber')}
                    defaultCode="IN"
                    layout="second"
                    containerStyle={styles.contactContainerStyle}
                    onChangeCountry={country => {
                      setFieldValue(
                        'contactPhoneCountryCode',
                        `${country.callingCode[0]}`,
                      );
                    }}
                    name="contactPhone"
                  />
                  <FormikPhoneField
                    // ref={phoneInput}
                    label={t('businessCard:alternateNumber')}
                    placeholder={t('businessCard:alternateNumber')}
                    defaultCode="IN"
                    layout="second"
                    containerStyle={styles.contactContainerStyle}
                    onChangeCountry={country => {
                      setFieldValue(
                        'alternateContactCountryCode',
                        `${country.callingCode[0]}`,
                      );
                    }}
                    name="alternateContact"
                  />

                  <FormikTextField
                    name="contactAddress"
                    label={t('businessCard:address')}
                    placeholder={t('businessCard:address')}
                    keyboardType={'email-address'}
                    autoComplete={'postal-address'}
                    maxLength={validations?.address.MAX}
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
              <Stack spacing={16} spaceBelow={16}>
                <PrimaryButton
                  alignButton
                  title={t('save')}
                  onPress={() => {
                    handleSubmit();
                  }}
                />
              </Stack>
            </Animated.ScrollView>
            {addContactResult?.isLoading ||
              (editContactResult.isLoading && <Loader />)}
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
                itemId={item?._id!}
                reopenModal={reopenModal}
                setReopenModal={value => setReopenModal(value)}
                onDeleteClick={selectedItemId =>
                  deleteContact({contacts: [selectedItemId!]})
                }
              />
            )}
          </Container>
        );
      }}
    </Formik>
  );
};
