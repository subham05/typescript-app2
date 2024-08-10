import {StackActions} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {AlertPermission} from 'common/utils/permission/Alert';
import {
  checkCameraPermission,
  getCameraPermission,
} from 'common/utils/permission/ReadCamera';
import {Container, TextView} from 'components';
import {FloatingButton} from 'components/FloatingButton';
import Header from 'components/Header';
import {RippleIconButton} from 'components/IconButtons';
import {Stack} from 'components/Stack';
import {MaterialTextField} from 'components/TextField/MaterialTextField';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useContext, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ImageLibraryOptions, launchCamera} from 'react-native-image-picker';
import {useSharedValue} from 'react-native-reanimated';
import {AddGroupNameList} from './components/AddGroupNameList';
import {Styles} from './index.styles';
import {
  useCreateGrpFromTaskMutation,
  useGroupChatAddMutation,
} from 'request/Message';
import {UploadedFileModal} from 'screens/AddTask';
import {uploadDocument} from 'common/utils/Amazon-S3';
import {NetworkContext} from 'components/NetworkProvider';
import {useAppSelector} from 'store/hooks';
import {showToast} from 'common/utils/ToastMessage';
import {Persona} from 'components/Persona';
import {groupTaskAddBody} from 'request/Message/constants';
import {GroupImageDetailsObj} from 'screens/EditGroupIcon';
import {View} from 'react-native';

type Props = NativeStackScreenProps<SignedInStackParamList, 'AddGroupName'>;
export const AddGroupNameScreen = (props: Props) => {
  const {t} = useTranslation();
  const {selectedMemberList, isFromTask = false, taskId} = props.route.params!;
  const [groupMembersId, setGroupMembersId] = useState<string[]>([]);
  const [addGroupChat, {data: groupAddedSuccess, isError}] =
    useGroupChatAddMutation();

  const [
    createTaskGroup,
    {data: grpFromTaskData, isSuccess: isSuccessGrpTask, isError: isErrGrpTask},
  ] = useCreateGrpFromTaskMutation();

  const [profileImage, setProfileImage] = useState<string>('');
  const [profileImageObj, setProfileImageObj] = useState<UploadedFileModal[]>();
  const {netStatus} = useContext(NetworkContext);
  const [lock, setLock] = useState<boolean>(false);
  const {userData} = useAppSelector(state => state.formanagement);
  let reg2 = /[a-zA-Z]/;

  useEffect(() => {
    let companyData: string[] = [];
    selectedMemberList?.map(item => {
      companyData.push(item?._id);
    });
    setGroupMembersId(companyData);
  }, [selectedMemberList]);
  const translateY = useSharedValue(0);

  const [name, setName] = useState<string>('');

  useEffect(() => {
    if (groupAddedSuccess) {
      showToast(groupAddedSuccess.message);
      const popAction = StackActions.pop(2);
      props.navigation.dispatch(popAction);
      setLock(false);
    } else if (isError) {
      setLock(false);
    }
  }, [groupAddedSuccess, props.navigation, isError]);
  const addGroupRequest = useMemo(() => {
    let newObj = {};
    const groupImageObj: GroupImageDetailsObj = {
      url: profileImage,
      groupImageFileExt: decodeURIComponent(profileImageObj?.[0]?.name!)
        .split('.')
        .pop()!,
      groupImageFileName: profileImageObj?.[0]?.name!,
      type: profileImageObj?.[0]?.type!,
    };
    if (profileImage) {
      newObj.groupImage = profileImage;
      newObj.groupImageDetails = groupImageObj;
    }

    newObj.groupName = name;

    return {
      ...newObj,
      groupMembers: groupMembersId,
      groupType: 'Chat',
    };
  }, [groupMembersId, name, profileImage, profileImageObj]);

  const createGroup = () => {
    if (reg2.test(addGroupRequest.groupName)) {
      addGroupChat(addGroupRequest);
    } else {
      showToast(t('group:validationForname'));
    }
  };

  const chooseFileCamera = () => {
    if (true) {
      let option: ImageLibraryOptions = {
        mediaType: 'photo',
      };

      launchCamera(option, response => {
        if (response.didCancel) {
        } else if (response.errorCode) {
          if (response.errorCode === 'permission') {
            // moveToDeviceSettings();
          }
        } else {
          if (response?.assets?.length) {
            const file: UploadedFileModal[] = [
              {
                name: decodeURIComponent(response?.assets[0]?.uri)
                  .split('/')
                  .pop(),
                type: response.assets[0].type,
                uri: response.assets[0].uri,
              },
            ];
            // setIsLoading(true);
            uploadPhoto(file);
          }
        }
      });
    }
  };

  const uploadPhoto = async (uploadFile: UploadedFileModal[]) => {
    setProfileImageObj(uploadFile);
    await chooseFile(uploadFile)
      .then(res => {
        if (res) {
          // const bodyObj = {profileImage: res} as ProfilePhotoBody;
          setProfileImage(res);
        }
      })
      .catch(() => {});
  };

  const chooseFile = async (uploadFile: UploadedFileModal[]) => {
    if (netStatus) {
      let docResult = await uploadDocument(
        uploadFile,
        `users/${userData?._id}/`,
      );
      return docResult[0] as string;
    } else {
      showToast(t('noNetwork'));
    }
  };
  const takePermission = () => {
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

  const renderMainContainer = () => {
    return (
      <TextView
        weight="medium"
        variant={FontSizes.regular}
        style={styles.header}>
        {t('group:createGroup')}
      </TextView>
    );
  };

  const styles = Styles();

  useEffect(() => {
    if (lock) {
      if (!isFromTask) {
        createGroup();
      } else {
        const bodyObj: groupTaskAddBody = {
          groupImage: profileImage,
          groupName: name,
          groupType: 'Task',
          taskId: taskId!,
        };
        createTaskGroup(bodyObj);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lock]);

  useEffect(() => {
    if (grpFromTaskData && isSuccessGrpTask) {
      showToast(grpFromTaskData.message);
      const popAction = StackActions.popToTop();
      props.navigation.dispatch(popAction);
      setLock(false);
    } else if (isErrGrpTask) {
      setLock(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grpFromTaskData, isSuccessGrpTask, isErrGrpTask]);

  return (
    <Container noSpacing>
      <Header
        navigationType="STACK"
        translateY={translateY}
        RenderMainContainer={renderMainContainer}
      />
      <Stack spacing={20} horizontal style={styles.iconNameView}>
        <Stack style={styles.camera}>
          {profileImage !== '' ? (
            <Persona name={''} image={profileImage || ''} size={48} />
          ) : (
            <RippleIconButton
              name="add_photo"
              size={24}
              color={colors.primary}
              isGroup
              onPress={() => takePermission()}
            />
          )}
        </Stack>
        {/* <Ripple style={styles.camera} onPress={() => takePermission()}>
          <Icon name="add_photo" size={24} color={colors.black} />
        </Ripple> */}
        <Stack>
          <MaterialTextField
            placeholder={t('group:groupSubjectPlaceholder')}
            onChangeText={setName}
            value={name}
            materialContainerStyle={styles.materialContainerStyle}
            maxLength={50}
          />
        </Stack>
      </Stack>
      <Stack spacing={16} spaceBelow={16}>
        <TextView
          weight="regular"
          variant={FontSizes.small}
          style={styles.text}>
          {t('group:provideTitle')}
        </TextView>
        <View style={styles.rltView}>
          <TextView
            weight="regular"
            variant={FontSizes.small}
            style={styles.head}>
            {t('group:members')}: {selectedMemberList?.length}
          </TextView>
          <AddGroupNameList selectedMemberList={selectedMemberList} />
        </View>
      </Stack>
      {/* <FloatingRightTickButton name="check_circle_selected" /> */}
      <Stack style={styles.floatingButton}>
        <FloatingButton
          name="done"
          onPress={() => setLock(true)}
          styles={styles.floatingIcon}
          size={35}
        />
      </Stack>
    </Container>
  );
};
