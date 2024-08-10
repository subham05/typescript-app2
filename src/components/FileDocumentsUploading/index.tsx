import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {AlertPermission} from 'common/utils/permission/Alert';
import {
  checkStoragePermission,
  getStoragePermission,
} from 'common/utils/permission/ReadStorage';
import {showToast} from 'common/utils/ToastMessage';
import {Icon} from 'components/Icon';
import {TextView} from 'components/TextView';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Platform, StyleSheet, TouchableOpacity} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import DocumentPicker from 'react-native-document-picker';
import {UploadedFileModal} from 'screens/AddTask';
import {Stack} from 'stack-container';
import {formats} from './contants';
import {Image as ImageCompress} from 'react-native-compressor';
import ReactNativeBlobUtil from 'react-native-blob-util';
import {_isIOS} from 'common/utils/PlatformCheck';
import {StyleProp, TextStyle} from 'react-native';

interface FileDocumentsUploadingModal {
  title?: string;
  isMultipleFileUpload?: boolean;
  setUploadedFileData: (data?: any) => void;
  icon?: string;
  iconColor?: string;
  iconStyle?: StyleProp<TextStyle>;
}
const FileDocumentUploading: React.FC<FileDocumentsUploadingModal> = ({
  title,
  isMultipleFileUpload,
  setUploadedFileData,
  icon = 'attach_file',
  iconColor,
  iconStyle,
}) => {
  const {t} = useTranslation();

  const takePermissionStorage = () => {
    checkStoragePermission().then(res => {
      if (!res.isPermissionGranted) {
        if (res.result === 'denied') {
          // showToast('Needs Storage permission for Attaching docs')
          getStoragePermission().then(resp => {
            // showToast('Needs Storage permission for Attaching docs')
            !resp.isPermissionGranted
              ? AlertPermission(t('permissions:storage'))
              : resp.isPermissionGranted && isMultipleFileUpload
              ? uploadMultipleFiles()
              : uploadSingleFile();
          });
        } else if (res.result === 'blocked') {
          AlertPermission(t('permissions:storage'));
        }
      } else {
        isMultipleFileUpload ? uploadMultipleFiles() : uploadSingleFile();
      }
    });
  };

  const compressImage = async result => {
    const compressResult = await ImageCompress.compress(
      result[0]?.fileCopyUri,
      {
        compressionMethod: 'auto',
      },
    );

    let compressPath = _isIOS
      ? compressResult.replace('file:///', '')
      : compressResult;
    ReactNativeBlobUtil.fs.stat(compressPath).then(stats => {
      if (+(stats?.size! / (1024 * 1024)).toFixed(2) < 50) {
        const format = result[0].type!.split('/').pop();
        if (result && format !== formats.mp4) {
          let uploadObj: UploadedFileModal | undefined = {
            fileCopyUri: '',
            name: result[0]?.name,
            size: stats?.size,
            type: result[0]?.type,
            uri: 'file:///' + stats.path,
          };
          setUploadedFileData([uploadObj] as UploadedFileModal);
        } else {
          showToast(t('common:invalidFormat'));
        }
      } else {
        showToast(t('common:fileSizeLimit'));
      }
    });
  };

  const uploadSingleFile = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [
          DocumentPicker.types.images,
          DocumentPicker.types.pdf,
          DocumentPicker.types.xls,
          DocumentPicker.types.xlsx,
        ],
        copyTo: 'documentDirectory',
      });
      let type = result[0].type?.split('/');
      const format = result[0].type!.split('/').pop();
      if (
        type![0]?.toLowerCase() === formats.image &&
        format !== formats.mp4 &&
        format?.toLowerCase() !== formats.gif
      ) {
        compressImage(result);
      } else {
        if (+(result[0].size! / (1024 * 1024)).toFixed(2) < 50) {
          if (
            result &&
            format !== formats.mp4 &&
            format?.toLowerCase() !== formats.gif
          ) {
            setUploadedFileData(result as UploadedFileModal);
          } else {
            showToast(t('common:invalidFormat'));
          }
        } else {
          showToast(t('common:fileSizeLimit'));
        }
      }
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
      } else {
        throw error;
      }
    }
  };

  const uploadMultipleFiles = async () => {
    try {
      const result = await DocumentPicker.pickMultiple({
        type: [
          DocumentPicker.types.images,
          DocumentPicker.types.pdf,
          DocumentPicker.types.xls,
          DocumentPicker.types.xlsx,
        ],
      });
      if (result) {
        setUploadedFileData(result);
      }
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
      } else {
        throw error;
      }
    }
  };

  return (
    <Stack childrenGap={5}>
      <TouchableOpacity
        onPress={() => {
          if (Platform.OS === 'ios') {
            takePermissionStorage();
          } else if (parseInt(DeviceInfo.getSystemVersion(), 10) < 13) {
            takePermissionStorage();
          } else {
            isMultipleFileUpload ? uploadMultipleFiles() : uploadSingleFile();
          }
        }}>
        <Stack horizontal>
          <Icon
            name={icon}
            size={22}
            color={iconColor ? iconColor : colors.primary}
            style={iconStyle ? iconStyle : styles.icon}
          />
          {title && (
            <TextView
              weight="medium"
              variant={FontSizes.medium}
              style={styles.attachFile}>
              {title}
            </TextView>
          )}
        </Stack>
      </TouchableOpacity>
    </Stack>
  );
};

export default FileDocumentUploading;
const styles = StyleSheet.create({
  icon: {
    marginTop: 20,
    right: 5,
    marginLeft: 5,
  },
  attachFile: {
    color: colors.primary,
    marginTop: 16,
    // marginBottom: 10,
  },
});
