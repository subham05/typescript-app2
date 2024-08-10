import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {AlertPermission} from 'common/utils/permission/Alert';
import {
  checkCameraPermission,
  getCameraPermission,
} from 'common/utils/permission/ReadCamera';
import {
  checkGalleryPermission,
  getGalleryPermission,
} from 'common/utils/permission/ReadGallery';
import {TextView} from 'components';
import {Icon} from 'components/Icon';
import {Stack} from 'components/Stack';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Platform, TouchableOpacity, View} from 'react-native';
import {
  Asset,
  ImageLibraryOptions,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import {SwipeablePanel} from 'rn-swipeable-panel';
import {Styles} from './index.styles';
import DeviceInfo from 'react-native-device-info';

interface BottomPanelProps {
  panelState: boolean;
  onPressEditBusinessCard: (assets?: Asset) => void;
  onPressClose: () => void;
  onPressBusinessCard?: () => void;
}

export const BottomPanel: React.FC<BottomPanelProps> = ({
  panelState,
  onPressEditBusinessCard,
  onPressClose,
  // onPressBusinessCard,
}) => {
  const {t} = useTranslation();

  const panelProps = {
    fullWidth: true,
    openLarge: false,
    onlySmall: true,
    showCloseButton: false,
    onClose: () => closePanel(),
    onPressCloseButton: () => closePanel(),
    closeOnTouchOutside: true,
    smallPanelHeight: 300,
    // ...or any prop you want
  };

  const [isPanelActive, setIsPanelActive] = useState(panelState);

  const closePanel = () => {
    setIsPanelActive(false);
    onPressClose();
  };
  const onSelectPhoto = async (assets: Asset) => {
    closePanel();
    onPressEditBusinessCard(assets);
  };
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
        }
        // else if (response.customButton) {
        //   Alert.alert(response.customButton);
        // }
        else {
          const {assets} = response;
          onSelectPhoto(assets![0]);
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
        }
        // else if (response.error) {
        // }
        //  else if (response.customButton) {
        //   Alert.alert(response.customButton);
        // }
        else {
          const {assets} = response;
          onSelectPhoto(assets![0]);
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

  const styles = Styles();
  return (
    <SwipeablePanel {...panelProps} isActive={isPanelActive}>
      <Stack style={styles.swipableView}>
        <TouchableOpacity
          onPress={() => {
            closePanel();
            onPressClose();
            takePermissionCamera();
          }}>
          <Stack horizontal>
            <Icon name="camera" size={28} color={colors.primary} />
            <TextView
              weight="medium"
              variant={FontSizes.xMedium}
              style={styles.swipableShareText}>
              {t('takePhoto')}
            </TextView>
          </Stack>
        </TouchableOpacity>
        <View style={styles.swipableModalDivide} />
        <TouchableOpacity
          onPress={() => {
            closePanel();
            onPressClose();
            if (Platform.OS === 'ios') {
              takePermissionGallery();
            } else if (parseInt(DeviceInfo.getSystemVersion(), 10) < 13) {
              takePermissionGallery();
            } else {
              chooseFileGallery();
            }
          }}>
          <Stack horizontal>
            <Icon name="upload" size={28} color={colors.primary} />
            <TextView
              weight="medium"
              variant={FontSizes.xMedium}
              style={styles.swipableShareText}>
              {t('uploadGallery')}
            </TextView>
          </Stack>
        </TouchableOpacity>
        <View style={styles.swipableModalDivide} />
        {/* <TouchableOpacity
          onPress={() => {
            closePanel();
            onPressClose();
            onPressBusinessCard();
          }}>
          <Stack horizontal>
            <Icon name="business_card" size={28} color={colors.primary} />
            <TextView
              weight="medium"
              variant={FontSizes.xMedium}
              style={styles.swipableShareText}>
              {t('businessCard:businessCard')}
            </TextView>
          </Stack>
        </TouchableOpacity> */}
      </Stack>
    </SwipeablePanel>
  );
};
