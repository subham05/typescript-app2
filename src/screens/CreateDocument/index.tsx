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
import {DefaultButton} from 'components/Buttons';
import {FormikTextField} from 'components/formikFields';
import Header from 'components/Header';
import {Icon} from 'components/Icon';
import {IconButton} from 'components/IconButtons';
import Loader from 'components/Loader';
import {NetworkContext} from 'components/NetworkProvider';
import {Stack, StackItem} from 'components/Stack';
import {Formik, FormikProps} from 'formik';
import moment from 'moment';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions} from 'react-native';
import ImagePicker, {Image as CropImage} from 'react-native-image-crop-picker';
import {
  Asset,
  ImageLibraryOptions,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import ImageView from 'react-native-image-viewing';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSharedValue} from 'react-native-reanimated';
import {ImageSource} from 'react-native-vector-icons/Icon';
import {companyError} from 'request/AddCompany';
import {
  useCreateDocumentMutation,
  useGetDocumentDataMutation,
  useEditDocumentMutation,
  createDocQueryBody,
} from 'request/DocumentRepository';
import {DocumentRepositoryBottomPanel} from 'screens/DocumentRepository/components/BottomPanel';
import {useAppSelector} from 'store/hooks';
import {InitialValues} from './contants';
import {Styles} from './index.styles';
import {AddDocumentModel} from './types';
import {AddDocumentSchema} from './utils';
import DeviceInfo from 'react-native-device-info';
import {Platform} from 'react-native';

type Props = NativeStackScreenProps<SignedInStackParamList, 'CreateDocument'>;
export const CreateDocumentScreen = (props: Props) => {
  const {netStatus} = React.useContext(NetworkContext);
  const {t} = useTranslation();
  const translateY = useSharedValue(0);

  const {route} = {...props};
  const {attachment, asset, edit, DocData} = {
    ...route.params,
  };

  const formikRef = useRef<FormikProps<AddDocumentModel> | undefined>();

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [loader, setLoader] = useState(false);
  const [imageUrlState, setImageUrlState] = useState<string | unknown>('');
  const [croppedImageUrlState, setCroppedImageUrl] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [imageData, setImageData] = useState<ImageSource[]>([]);
  const [isPanelActive, setIsPanelActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Asset | undefined>(
    undefined,
  );
  const fileSize = useRef<number | undefined>(0);
  const {companyId, validations} = useAppSelector(
    state => state?.formanagement,
  );
  const [
    createDocument,
    {data: addDocData, isLoading, isError, isSuccess, error},
  ] = useCreateDocumentMutation();
  const [
    editDocument,
    {
      data: editDocData,
      isLoading: isEditLoading,
      isError: isEditError,
      isSuccess: isEditSuccess,
      error: editError,
    },
  ] = useEditDocumentMutation();
  const [
    getDocumentDataApi,
    {
      data: documentScanData,
      isSuccess: isSuccessDocScan,
      // error: errorDocScan,
      isError: isErrorDocScan,
      isLoading: isLoadingDocScan,
    },
  ] = useGetDocumentDataMutation();
  useEffect(() => {
    if (isSuccessDocScan && documentScanData?.data?.text?.length) {
      const {data: scanData, message} = documentScanData;
      showToast(message);
      const extractTitle = scanData?.text.substring(0, 15);
      setTitle(extractTitle);
      formikRef.current?.setFieldValue('title', extractTitle);
      setDescription(scanData?.text.substring(0, 250));
      formikRef.current?.setFieldValue(
        'description',
        scanData?.text.substring(0, 250),
      );
    } else if (isErrorDocScan) {
      showToast();
    }
  }, [documentScanData, isSuccessDocScan, isErrorDocScan]);
  useEffect(() => {
    if (DocData && edit) {
      const {
        title: Doctitle,
        description: docDesc,
        attachment: docAttachment,
      } = DocData;
      setTitle(Doctitle);
      setDescription(docDesc);
      formikRef.current?.setFieldValue('title', Doctitle);
      formikRef.current?.setFieldValue('description', docDesc);
      if (docAttachment) {
        fileSize.current = Number(DocData?.size);
        setImageUrlState(docAttachment?.url);
        let imageUrlData = [...imageData, {uri: docAttachment?.url}];
        setImageData(imageUrlData);
        setCroppedImageUrl(docAttachment?.url);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [DocData]);
  const onSubmit = (values: AddDocumentModel) => {
    let obj: createDocQueryBody = {
      companyId: edit
        ? DocData?.companyId?.map(item => item?._id)
        : companyId?.map(item => item?._id),
      title: values.title,
      description: values.description,
      isAttachment: attachment || false,
      ...(attachment && {
        attachment: edit
          ? uploadedFiles
            ? {
                url: imageUrlState,
                type: uploadedFiles?.type,
                documentFileName: uploadedFiles?.fileName!,
                documentFileExt: decodeURIComponent(uploadedFiles?.fileName!)
                  .split('.')
                  .pop(),
              }
            : imageUrlState.length
            ? {
                url: imageUrlState,
                type: DocData?.attachment?.type,
                documentFileName: DocData?.attachment?.documentFileName!,
                documentFileExt: DocData?.attachment?.documentFileExt,
              }
            : null
          : {
              url: imageUrlState,
              type: asset?.type,
              documentFileName: asset?.name!,
              documentFileExt: decodeURIComponent(asset?.name!)
                .split('.')
                .pop(),
            },
        cropImage: croppedImageUrlState,
        size: fileSize.current?.toString(),
      }),
    };
    if (
      edit &&
      DocData?.attachment &&
      imageUrlState !== DocData?.attachment?.url
    ) {
      obj = {
        ...obj,
        deletedAttachments: {
          url: DocData?.attachment.url,
          type: DocData?.attachment.type!,
          documentFileName: DocData?.name!,
          documentFileExt: decodeURIComponent(DocData?.name!).split('.').pop(),
        },
      };
    }
    //**Api call here */
    edit
      ? editDocument({docId: DocData?._id, docObj: obj})
      : createDocument({docObj: obj});
  };

  const getDocumentData = async (editImageUpload?: Asset) => {
    fileSize.current = editImageUpload
      ? editImageUpload?.fileSize
      : asset?.size || asset?.fileSize;
    // const imageUrl = await getUploadDocument(
    //   {...asset, name: `moment_${moment().format('YYYYMMDDHHSS')}`},
    //   `document_repo/media/${moment().format('YYYYMMDDHHSS')}/`,
    // );
    let date = new Date();
    let timeFormat = date.valueOf().toString();
    let imageObj = {
      name: `document_${timeFormat}.${asset?.type?.split('/').pop()}`,
      type: asset?.type,
      uri: asset?.uri,
    };
    const imageUrl = await getUploadDocument(
      editImageUpload ? editImageUpload : imageObj,
      `document_repo/${moment().format('YYYYMMDDHH')}/`,
    );
    if (imageUrl) {
      setUploadedFiles(editImageUpload);
      setImageUrlState(imageUrl);
      let imageUrlData = [...imageData, {uri: imageUrl}];
      setImageData(imageUrlData);
      edit ? setCroppedImageUrl(`${imageUrl}`) : cropImage(imageUrl);
    }
  };

  const croppedImage = async (cropImage: CropImage) => {
    const croppedImageObj = {
      name: `moment_${moment().format('YYYYMMDDHHSS')}`,
      // Platform.OS === 'ios'
      //   ? cropImage.filename
      //   : cropImage.path.split('/').pop(),
      // fileName: cropImage.filename,
      fileSize: cropImage.size,
      height: cropImage.height,
      type: cropImage.mime,
      uri: cropImage.path,
      width: cropImage.width,
    };
    try {
      const croppedImageUpload = await getUploadDocument(
        croppedImageObj,
        `document_repo/media/${moment().format('YYYYMMDDHH')}/`,
      );
      if (croppedImageUpload) {
        setCroppedImageUrl(`${croppedImageUpload}`);
        const obj = {imageUrl: croppedImageUpload};
        setLoader(false);
        getDocumentDataApi(obj);
      }
    } catch (errorLog) {
      setLoader(false);
    }
  };

  const cropImage = (imageUploadUrl: string | unknown) => {
    ImagePicker.openCropper({
      mediaType: 'photo',
      path: imageUploadUrl,
    })
      .then(image => {
        croppedImage(image);
      })
      .catch(() => {
        setLoader(false);
      });
  };

  useEffect(() => {
    if (asset) {
      setLoader(true);
      getDocumentData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asset]);

  useEffect(() => {
    if (isSuccess || isEditSuccess) {
      if (edit) {
        showToast(editDocData?.message);
        props.navigation.navigate('ViewFile', {
          id: DocData?._id,
          isShared: false,
        });
      } else {
        showToast(addDocData?.message);
        props.navigation.navigate({
          name: 'DocumentRepository',
          params: {_id: addDocData?.data._id},
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isEditSuccess]);

  useEffect(() => {
    if ((isError && error) || (isEditError && editError)) {
      const err: any = edit ? editError : error;
      if (err?.error) {
        showToast(err.error);
      } else {
        err?.data?.error.map((errorItem: companyError) =>
          formikRef.current?.setFieldError(errorItem.param, errorItem.msg),
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, isError, isEditError, editError]);
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
        } else if (response.errorCode) {
          if (response.errorCode === 'permission') {
            // moveToDeviceSettings();
          }
        } else {
          const {assets} = response;
          getDocumentData(assets![0]);
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
        } else if (response.errorCode) {
          if (response.errorCode === 'permission') {
            closePanel();
          }
        } else {
          const {assets} = response;
          getDocumentData(assets![0]);
        }
        closePanel();
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
  const renderLeftContainer = () => {
    return (
      <Stack horizontal>
        <IconButton
          name="upload"
          size={24}
          color={imageData.length > 0 ? colors.grey_003 : colors.black}
          onPress={() =>
            imageData.length > 0
              ? showToast(t('document:attachemntWarning'))
              : openPanel()
          }
        />
      </Stack>
    );
  };
  const styles = Styles();
  return (
    <Formik<AddDocumentModel>
      initialValues={InitialValues}
      validateOnMount
      innerRef={formikRef}
      onSubmit={onSubmit}
      validationSchema={AddDocumentSchema}>
      {({handleSubmit}) => {
        return (
          <Container noSpacing>
            <Header
              label={
                edit ? t('document:editDocument') : t('document:addDocument')
              }
              navigationType="STACK"
              translateY={translateY}
              RenderPrivateToggle={edit ? renderLeftContainer : undefined}
              labelVieStyle={{width: Dimensions.get('screen').width - 35}}
            />
            <Stack style={styles.flex}>
              <KeyboardAwareScrollView
                contentContainerStyle={styles.scrollViewStyle}>
                <StackItem
                  style={styles.StackItemStyle}
                  childrenGap={16}
                  spacing={16}
                  spaceBelow={16}>
                  <FormikTextField
                    name="title"
                    label={t('document:title')}
                    placeholder={t('document:title')}
                    placeholderTextColor={colors.grey_005}
                    onChangeText={setTitle}
                    value={title}
                    maxLength={validations?.documentTitle.MAX}
                    keyboardType={'email-address'}
                  />
                  <FormikTextField
                    name="description"
                    label={t('document:description')}
                    placeholder={t('document:description')}
                    placeholderTextColor={colors.grey_005}
                    onChangeText={setDescription}
                    value={description}
                    multiline
                    style={styles.fixedDescriptionHeight}
                    numberOfLines={4}
                    maxLength={validations?.documentDescription.MAX}
                    keyboardType={'email-address'}
                  />
                  {attachment && imageData.length > 0 && (
                    <Stack>
                      <TextView
                        weight="regular"
                        variant={FontSizes.regular}
                        style={styles.label}>
                        {t('document:attachment')}
                      </TextView>
                      <Stack
                        horizontal
                        style={styles.attachmentView}
                        onTouchEnd={() => edit && setIsVisible(true)}>
                        <Stack horizontal style={styles.attachment}>
                          <Icon
                            name="photo_gallary"
                            size={22}
                            style={styles.attachmentIcon}
                            color={colors.black}
                          />
                          <TextView
                            weight="regular"
                            variant={FontSizes.medium}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={styles.attachmentName}>
                            {/* {decodeURIComponent(imageUrlState)
                              .split('/')
                              .pop() || ''} */}
                            {uploadedFiles
                              ? `image.${decodeURIComponent(
                                  uploadedFiles?.fileName!,
                                )
                                  .split('.')
                                  .pop()}`
                              : DocData?.attachment
                              ? DocData?.attachment?.documentFileExt
                                ? `image.${DocData?.attachment?.documentFileExt}`
                                : `image.${decodeURIComponent(
                                    DocData?.attachment?.documentFileName!,
                                  )
                                    .split('.')
                                    .pop()}`
                              : `image.${decodeURIComponent(asset?.name!)
                                  .split('.')
                                  .pop()}`}
                          </TextView>
                        </Stack>
                        {edit ? (
                          <IconButton
                            name="close"
                            size={22}
                            style={styles.downloadIcon}
                            color={colors.black}
                            onPress={() => {
                              setCroppedImageUrl('');
                              setImageUrlState('');
                              setImageData([]);
                            }}
                          />
                        ) : (
                          <IconButton
                            name="visibility"
                            size={22}
                            style={styles.downloadIcon}
                            color={colors.black}
                            onPress={() => {
                              setIsVisible(true);
                            }}
                          />
                        )}
                      </Stack>
                      <ImageView
                        keyExtractor={(_, indexKey) => indexKey.toString()}
                        images={imageData}
                        imageIndex={0}
                        visible={isVisible}
                        onRequestClose={() => setIsVisible(false)}
                      />
                    </Stack>
                  )}
                </StackItem>
                <Stack style={styles.saveButtonStack}>
                  <Stack
                    spacing={16}
                    horizontal
                    horizontalAlign="center"
                    center>
                    <DefaultButton
                      title={t('save')}
                      fontSize={FontSizes.small}
                      onPress={() => {
                        // props.navigation.goBack();
                        if (netStatus) {
                          handleSubmit();
                        } else {
                          showToast(t('noNetwork'));
                        }
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
            {isLoading && <Loader message="Creating document..." />}
            {isEditLoading && <Loader message="Editing document..." />}
            {loader && <Loader message="Uploading image..." />}
            {isLoadingDocScan && <Loader message="Scanning document..." />}
            {isPanelActive && (
              <DocumentRepositoryBottomPanel
                panelState={isPanelActive}
                onPressClose={() => closePanel()}
                props={props}
                isHideCopyPaste
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
            {/* {isError && showToast()} */}
          </Container>
        );
      }}
    </Formik>
  );
};
