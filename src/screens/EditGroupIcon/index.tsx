import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {STR_KEYS} from 'common/storage';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {uploadDocument} from 'common/utils/Amazon-S3';
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
import Header from 'components/Header';
import {Icon} from 'components/Icon';
import {IconButton} from 'components/IconButtons';
import Loader from 'components/Loader';
import {NetworkContext} from 'components/NetworkProvider';
import {Persona} from 'components/Persona';
import {Stack, StackItem} from 'components/Stack';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useContext, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Dimensions,
  Image,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ImageLibraryOptions,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import Modal from 'react-native-modal';
import {useSharedValue} from 'react-native-reanimated';
import {
  ProfilePhotoBody,
  useLazyDeleteProfileImageQuery,
  useUpdateProfileImageMutation,
} from 'request/Profile';
import {UploadedFileModal} from 'screens/AddTask';
import {useAppDispatch, useAppSelector} from 'store/hooks';
import {userDataAction} from 'store/Reducer';
import {Styles} from './index.styles';
import DeviceInfo from 'react-native-device-info';
import {
  useDeleteGroupIconMutation,
  useEditGroupImageMutation,
} from 'request/Message';
import {groupDeleteIconModal} from 'request/Message/constants';
import ReactNativeBlobUtil from 'react-native-blob-util';
import {Image as ImageCompress} from 'react-native-compressor';
import {_isIOS} from 'common/utils/PlatformCheck';
import {formats} from 'components/FileDocumentsUploading/contants';
import {ProfileImageDetailsObj} from 'screens/AddEmployee';

export interface GroupImageDetailsObj {
  url: string | unknown;
  type: string | undefined;
  groupImageFileName: string | undefined;
  groupImageFileExt: string | undefined;
}

type Props = NativeStackScreenProps<SignedInStackParamList, 'EditGroupIcon'>;
export const EditGroupIconScreen = (props: Props) => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const {route} = {...props};
  const {profile, image, groupName, groupId} = {...route.params};

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [reopenModal, setReopenModal] = useState<boolean>(false);
  const deviceWidth = Dimensions.get('screen').width;

  const {netStatus} = useContext(NetworkContext);
  const {userData} = useAppSelector(state => state.formanagement);

  const [updateProfilePic, {isSuccess, data}] = useUpdateProfileImageMutation();
  const [deleteProfilePic, {isSuccess: deleteImgSuccess}] =
    useLazyDeleteProfileImageQuery();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [profileImage, setProfileImage] = useState<string>('');
  const [deleteIconVisible, setDeleteIconVisible] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const [
    deleteGroupPic,
    {
      data: deleteGroupIconData,
      isSuccess: deleteGroupIconSuccess,
      isLoading: deleteGroupIconLoading,
    },
  ] = useDeleteGroupIconMutation();

  const [
    updateGroupImage,
    {
      data: updateGroupIconData,
      isSuccess: updateGroupIconSuccess,
      isError: updateGroupIconError,
    },
  ] = useEditGroupImageMutation();

  const compressImage = async result => {
    const compressResult = await ImageCompress.compress(result.uri, {
      compressionMethod: 'auto',
    });
    let compressPath = _isIOS
      ? compressResult.replace('file:///', '')
      : compressResult;
    ReactNativeBlobUtil.fs.stat(compressPath).then(stats => {
      if (+(stats?.size! / (1024 * 1024)).toFixed(2) < 50) {
        const format = result.type!.split('/').pop();
        if (result && format !== formats.mp4) {
          let uploadObj: UploadedFileModal | undefined = {
            fileCopyUri: '',
            name: result?.fileName,
            size: stats?.size,
            type: result?.type,
            uri: 'file:///' + stats.path,
          };
          uploadPhoto([uploadObj]);
          // setUploadedFileData([uploadObj] as UploadedFileModal);
        } else {
          showToast(t('common:invalidFormat'));
        }
      } else {
        showToast(t('common:fileSizeLimit'));
      }
    });
  };

  const chooseFileCamera = () => {
    if (true) {
      let option: ImageLibraryOptions = {
        mediaType: 'photo',
        // quality: 0.3,
      };
      // var options = {
      //   noData: true,
      //   title: 'Select Image',
      //   maxWidth: 300,
      //   maxHeight: 300,
      //   customButtons: [
      //     {
      //       name: 'customOptionKey',
      //       title: '',
      //     },
      //   ],
      //   storageOptions: {
      //     path: 'images',
      //   },
      //   option,
      // };

      launchCamera(option, (response: any) => {
        if (response.didCancel) {
        }
        // else if (response.customButton) {
        //   Alert.alert(response.customButton);
        // }
        else {
          if (response.assets.length) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const file: UploadedFileModal[] = [
              {
                name: decodeURIComponent(response.assets[0].uri)
                  .split('/')
                  .pop(),
                type: response.assets[0].type,
                uri: response.assets[0].uri,
              },
            ];
            setIsLoading(true);
            compressImage(response.assets[0]);
            // uploadPhoto(file);
          }
        }
      });
    }
  };
  const chooseFileGallery = () => {
    if (true) {
      let option: ImageLibraryOptions = {
        mediaType: 'photo',
        selectionLimit: 1,
        // quality: 1,
      };
      // var options = {
      //   noData: true,
      //   title: 'Select Image',
      //   maxWidth: 300,
      //   maxHeight: 300,
      //   customButtons: [
      //     {
      //       name: 'customOptionKey',
      //       title: '',
      //     },
      //   ],
      //   storageOptions: {
      //     path: 'images',
      //   },
      //   mediaType: 'mixed',
      // };

      launchImageLibrary(option, (response: any) => {
        if (response.didCancel) {
        }
        // else if (response.error) {
        // }
        //  else if (response.customButton) {
        // }
        else {
          if (response.assets.length) {
            if (response.assets[0].type !== formats.imageGif) {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const file: UploadedFileModal[] = [
                {
                  name: decodeURIComponent(response.assets[0].uri)
                    .split('/')
                    .pop(),
                  type: response.assets[0].type,
                  uri: response.assets[0].uri,
                },
              ];
              setIsLoading(true);
              compressImage(response.assets[0]);
              // uploadPhoto(file);
            } else {
              showToast(t('common:pngJpeg'));
            }
          }
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
            if (!resp.isPermissionGranted) {
              AlertPermission(t('permissions:gallery'));
            } else {
              chooseFileGallery();
            }
          });
        } else if (res.result === 'blocked') {
          AlertPermission(t('permissions:gallery'));
        }
      } else {
        chooseFileGallery();
      }
    });
  };

  const renderMainContainer = () => {
    return (
      <TextView
        weight="medium"
        variant={FontSizes.regular}
        style={styles.header}>
        {profile ? t('accountPage:profileIcon') : t('group:groupIcon')}
      </TextView>
    );
  };
  const renderLeftContainer = () => {
    return (
      <IconButton
        name="edit"
        size={21}
        color={colors.black}
        onPress={() => {
          setReopenModal(true);
        }}
      />
      // <TouchableOpacity
      //   onPress={() => {
      //     setReopenModal(true);
      //   }}>
      //   <Icon name="edit" size={24} color={colors.black} />
      // </TouchableOpacity>
    );
  };

  const chooseFile = async (uploadFile: UploadedFileModal[]) => {
    if (netStatus) {
      if (uploadFile[0]?.size < Math.pow(10, 6)) {
        let docResult = await uploadDocument(
          uploadFile,
          `users/${userData?._id}/`,
        );
        return docResult[0] as string;
      } else {
        setIsLoading(false);
        showToast(t('common:fileSizeLimitTen'));
      }
    } else {
      setIsLoading(false);
      showToast(t('noNetwork'));
    }
  };

  const uploadPhoto = async (uploadFile: UploadedFileModal[]) => {
    await chooseFile(uploadFile)
      .then(res => {
        if (res) {
          let bodyObj;
          if (groupId) {
            const groupImageObj: GroupImageDetailsObj = {
              url: res,
              groupImageFileExt: decodeURIComponent(uploadFile[0]?.name!)
                .split('.')
                .pop()!,
              groupImageFileName: uploadFile[0]?.name!,
              type: uploadFile[0]?.type!,
            };
            bodyObj = {
              groupId: groupId,
              body: {groupImage: res, groupImageDetails: groupImageObj},
            };
            updateGroupImage(bodyObj);
          } else {
            const profileImageObj: ProfileImageDetailsObj = {
              url: res,
              profileFileExt: decodeURIComponent(uploadFile[0]?.name!)
                .split('.')
                .pop()!,
              profileFileName: uploadFile[0]?.name!,
              type: uploadFile[0]?.type!,
            };
            bodyObj = {
              profileImage: res,
              profileImageDetail: profileImageObj,
            } as ProfilePhotoBody;
            setProfileImage(res);
            updateProfilePic(bodyObj);
          }
        }
      })
      .catch(err => {
        console.log('err', err);
        setIsLoading(false);
      });
  };

  const deletePhoto = () => {
    deleteProfilePic({}).then(res => {
      setIsLoading(false);
      showToast(res.data?.message);
    });
  };

  useEffect(() => {
    if (isSuccess && userData) {
      AsyncStorage.setItem(
        STR_KEYS.LOGINUSERDATA,
        JSON.stringify({
          ...userData,
          profileUrl: profileImage,
        }),
      );
      dispatch(userDataAction({...userData, profileUrl: profileImage}));
      showToast(data?.message);
    }
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  useEffect(() => {
    if (deleteImgSuccess && userData) {
      AsyncStorage.setItem(
        STR_KEYS.LOGINUSERDATA,
        JSON.stringify({
          ...userData,
          profileUrl: '',
        }),
      );
      dispatch(userDataAction({...userData, profileUrl: ''}));
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteImgSuccess]);

  useEffect(() => {
    if (updateGroupIconSuccess) {
      setIsLoading(false);
      showToast(updateGroupIconData?.message);
      props.navigation.goBack();
    } else if (updateGroupIconError) {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateGroupIconSuccess, updateGroupIconError]);

  useEffect(() => {
    if (deleteGroupIconSuccess && deleteGroupIconData) {
      showToast(deleteGroupIconData.message);
      props.navigation.goBack();
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteGroupIconSuccess]);

  const styles = Styles();

  useEffect(() => {
    // console.log(userData?.profileUrl);
    setDeleteIconVisible(
      userData?.profileUrl?.length || image?.length ? true : false,
    );
  }, [userData?.profileUrl, image]);

  if (isLoading || deleteGroupIconLoading) {
    return <Loader />;
  }
  return (
    <Container noSpacing>
      <Header
        navigationType="STACK"
        translateY={translateY}
        RenderMainContainer={renderMainContainer}
        RenderLeftContainer={renderLeftContainer}
      />
      <Stack style={styles.imageView}>
        {profile ? (
          userData?.profileUrl !== '' ? (
            <Image
              source={{
                uri: userData?.profileUrl,
              }}
              style={styles.image}
            />
          ) : (
            <Persona name={userData?.name} size={deviceWidth} square />
            // <Image source={{uri: image}} style={styles.image} />
          )
        ) : image && image !== '' ? (
          <Image
            source={{
              uri: image,
            }}
            style={styles.image}
          />
        ) : (
          <Persona name={groupName} size={deviceWidth} square />
          // <Image source={{uri: image}} style={styles.image} />
        )}
      </Stack>
      {openModal ? (
        <Modal
          isVisible={openModal}
          onBackdropPress={() => setReopenModal(false)}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TextView
                weight="medium"
                variant={FontSizes.medium}
                style={styles.shareVia}>
                {profile
                  ? t('accountPage:removeIconAlert')
                  : t('group:removeIconAlert')}
              </TextView>
              <Stack horizontal style={styles.modal}>
                <TextView
                  weight="semibold"
                  variant={FontSizes.regular}
                  style={styles.reopenModal}
                  onPress={() => setOpenModal(false)}>
                  {t('cancel')}
                </TextView>
                <TextView
                  weight="semibold"
                  variant={FontSizes.regular}
                  style={styles.reopenModal}
                  onPress={() => {
                    setOpenModal(false);
                    if (profile) {
                      deletePhoto();
                    } else {
                      let bodyObj: groupDeleteIconModal = {
                        groupId: groupId!,
                      };
                      deleteGroupPic(bodyObj);
                    }
                  }}>
                  {t('group:remove')}
                </TextView>
              </Stack>
            </View>
          </View>
        </Modal>
      ) : (
        <></>
      )}
      {reopenModal ? (
        <Modal
          isVisible={reopenModal}
          style={styles.bottomModal}
          onBackdropPress={() => setReopenModal(false)}>
          <View style={styles.bottomView}>
            <View style={styles.bottomModalView}>
              <Stack
                spacing={8}
                spaceBelow={16}
                style={styles.swipableView}
                horizontal
                horizontalAlign="space-between">
                <TextView weight="medium" variant={FontSizes.medium}>
                  {t('group:chooseFrom')}
                </TextView>
                {deleteIconVisible && (
                  <IconButton
                    name="delete"
                    size={27}
                    color={colors.primary_003}
                    onPress={() => {
                      setReopenModal(false);
                      setOpenModal(true);
                    }}
                  />
                )}

                {/* <TouchableOpacity
                  onPress={() => {
                    setReopenModal(false);
                    setOpenModal(true);
                  }}>
                  <Icon name="delete" size={27} color={colors.primary_003} />
                </TouchableOpacity> */}
              </Stack>
              <Stack
                spacing={16}
                spaceBelow={16}
                horizontal
                horizontalAlign="space-evenly">
                <TouchableOpacity
                  onPress={() => {
                    setReopenModal(false);
                    takePermissionCamera();
                  }}>
                  <StackItem childrenGap={10} style={styles.swipableShareText}>
                    <Icon name="camera" size={28} color={colors.primary} />
                    <TextView weight="medium" variant={FontSizes.xMedium}>
                      {t('group:camera')}
                    </TextView>
                  </StackItem>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setReopenModal(false);
                    if (Platform.OS === 'ios') {
                      takePermissionGallery();
                    } else if (
                      parseInt(DeviceInfo.getSystemVersion(), 10) < 13
                    ) {
                      takePermissionGallery();
                    } else {
                      chooseFileGallery();
                    }
                  }}>
                  <StackItem childrenGap={10} style={styles.swipableShareText}>
                    <Icon
                      name="photo_gallary"
                      size={28}
                      color={colors.primary}
                    />
                    <TextView weight="medium" variant={FontSizes.xMedium}>
                      {t('group:gallery')}
                    </TextView>
                  </StackItem>
                </TouchableOpacity>
              </Stack>
            </View>
          </View>
        </Modal>
      ) : (
        <></>
      )}
    </Container>
  );
};
