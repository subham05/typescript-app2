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
  ImageLibraryOptions,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import {SwipeablePanel} from 'rn-swipeable-panel';
import {Styles} from './index.styles';
import DeviceInfo from 'react-native-device-info';

interface BottomPanelProps {
  panelState: boolean;
  onPressEditBusinessCard: () => void;
  onPressClose: () => void;
}

export const BottomPanel: React.FC<BottomPanelProps> = ({
  panelState,
  onPressEditBusinessCard,
  onPressClose,
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
    // ...or any prop you want
  };

  const [isPanelActive, setIsPanelActive] = useState(panelState);

  const closePanel = () => {
    setIsPanelActive(false);
    onPressClose();
  };

  const chooseFileCamera = () => {
    if (true) {
      let option: ImageLibraryOptions = {
        mediaType: 'photo',
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
          // const source = {uri: response.uri};
          closePanel();
          // this.setState({
          //   filePath: response,
          //   fileData: response.data,
          //   fileUri: response.uri
          // });
        }
      });
    }
  };
  const chooseFileGallery = () => {
    if (true) {
      let option: ImageLibraryOptions = {
        mediaType: 'photo',
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

      launchImageLibrary(option, response => {
        if (response.didCancel) {
        }
        // else if (response.error) {
        // }
        //  else if (response.customButton) {
        //   Alert.alert(response.customButton);
        // }
        else {
          // const source = {uri: response.uri};
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
              weight="bold"
              variant={FontSizes.medium}
              style={styles.swipableshareText}>
              {t('takePhoto')}
            </TextView>
          </Stack>
        </TouchableOpacity>
        <View style={styles.swipablemodalDevide} />
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
              weight="bold"
              variant={FontSizes.medium}
              style={styles.swipableshareText}>
              {t('uploadGallery')}
            </TextView>
          </Stack>
        </TouchableOpacity>
        <View style={styles.swipablemodalDevide} />
        <TouchableOpacity
          onPress={() => {
            closePanel();
            onPressClose();
            onPressEditBusinessCard();
          }}>
          <Stack horizontal>
            <Icon name="business_card" size={28} color={colors.primary} />
            <TextView
              weight="bold"
              variant={FontSizes.medium}
              style={styles.swipableshareText}>
              {t('contacts:editCard')}
            </TextView>
          </Stack>
        </TouchableOpacity>
      </Stack>
    </SwipeablePanel>
  );
};
