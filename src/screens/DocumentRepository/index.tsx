import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/core';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {STR_KEYS} from 'common/storage';
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
import {_isIOS} from 'common/utils/PlatformCheck';
import {showToast} from 'common/utils/ToastMessage';
import {Container, TextView} from 'components';
import {formats} from 'components/FileDocumentsUploading/contants';
import Header from 'components/Header';
import {Icon} from 'components/Icon';
import {IconButton} from 'components/IconButtons';
import Loader from 'components/Loader';
import {Stack} from 'components/Stack';
import {SearchTextField} from 'components/TextField';
import {ToolTip} from 'components/Tooltip';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Keyboard, Platform, TouchableOpacity} from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import {Image as ImageCompress} from 'react-native-compressor';
import DeviceInfo from 'react-native-device-info';
import {
  ImageLibraryOptions,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import {
  // useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {
  docInterface,
  useGetDocumentMutation,
  useGetShareWithMeDocumentsMutation,
} from 'request/DocumentRepository';
import {ContactRepositoryHeader} from 'screens/_ManagerScreens/SharedContacts/components/Header';
import {useAppSelector} from 'store/hooks';
import {DocumentRepositoryBottomPanel} from './components/BottomPanel';
import {DocumentRepositoryList} from './components/DocumentRepositoryList';
import {Styles} from './index.styles';
// import {documentRepositoryList} from './mockData';

type Props = NativeStackScreenProps<
  SignedInStackParamList,
  'DocumentRepository'
>;
export const DocumentRepositoryScreen = (props: Props) => {
  const {t} = useTranslation();
  const {params} = props.route;
  const translateY = useSharedValue(0);

  // const dispatch = useDispatch();

  // const scrollHandler = useAnimatedScrollHandler(event => {
  //   translateY.value = event.contentOffset.y;
  // });

  const [tooltipSeen, setTooltipSeen] = useState<string | null>('');

  AsyncStorage.getItem(STR_KEYS.TOOLTIP_DOCUMENT_SEEN).then(res => {
    setTooltipSeen(res);
  });

  // const [swipeModal, setSwipeModal] = useState<boolean>(false);

  const [isPanelActive, setIsPanelActive] = useState(false);
  const [search, setSearchText] = useState<string>('');
  const [pageNo, setPageNo] = useState(1);
  const [searchShare, setSearchShareText] = useState<string>('');
  const [sharePageNumber, setSharePageNumber] = useState(1);
  const [refresh, setRefresh] = useState(false);
  const [selectedHeader, setSelectedHeader] = useState<string>(
    t('document:myDoc'),
  );
  const {companyId} = useAppSelector(state => state?.formanagement);

  useEffect(() => {
    if (companyId?.length) {
      setDocumentState([]);
      setPageNo(1);
    }
  }, [companyId]);
  useEffect(() => {
    if (params?.isShareWithMe) {
      setSelectedHeader(t('contacts:sharedWithMe'));
    }
    if (params?._id) {
      setDocumentState([]);
      setPageNo(1);
      trigger(getBodyObj);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);
  useEffect(() => {
    if (selectedHeader === t('document:myDoc')) {
      if (search.length) {
        setDocumentState([]);
        setPageNo(1);
      } else {
        setDocumentState([]);
        setPageNo(1);
      }
    } else {
      if (searchShare.length) {
        setShareWithMedocState([]);
        setSharePageNumber(1);
      } else {
        setShareWithMedocState([]);
        setSharePageNumber(1);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, searchShare]);

  const getBodyObj = useMemo(() => {
    return {
      companyId: companyId?.map(({_id}) => _id),
      searchText: search,
      pageNo: pageNo,
    };
  }, [search, pageNo, companyId]);
  const getShareRequestObj = useMemo(() => {
    return {
      companyId: companyId?.map(({_id}) => _id),
      searchText: searchShare,
      pageNo: sharePageNumber,
    };
  }, [searchShare, sharePageNumber, companyId]);
  const [
    trigger,
    {
      data: myDocumentData,
      // isError: isDocumentError,
      isLoading: isDocumentLoading,
      isSuccess: isDocumentSuccess,
      // isUninitialized: isDocumentUninitialized,
    },
  ] = useGetDocumentMutation();
  const [
    getShareWithMeList,
    {
      data: shareDocData,
      // isError: isDocumentError,
      isLoading: isShareDocLoading,
      isSuccess: isShareDocSuccess,
      // isUninitialized: isDocumentUninitialized,
    },
  ] = useGetShareWithMeDocumentsMutation();

  const [documentState, setDocumentState] = useState<docInterface[]>([]);
  const [shareWithMeDocState, setShareWithMedocState] = useState<
    docInterface[]
  >([]);

  useFocusEffect(
    useCallback(() => {
      if (refresh) {
        selectedHeader === t('document:myDoc')
          ? setDocumentState([])
          : setShareWithMedocState([]);
      }
      selectedHeader === t('document:myDoc')
        ? trigger(getBodyObj)
        : getShareWithMeList(getShareRequestObj);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getBodyObj, getShareRequestObj, refresh, selectedHeader]),
  );

  useEffect(() => {
    if (myDocumentData?.data?.nodes?.length && isDocumentSuccess) {
      pageNo === 1
        ? setDocumentState(myDocumentData?.data?.nodes)
        : setDocumentState(prev => prev.concat(myDocumentData?.data?.nodes));
    }
    if (shareDocData && isShareDocSuccess) {
      const {nodes} = shareDocData.data;
      sharePageNumber === 1
        ? setShareWithMedocState(nodes)
        : setShareWithMedocState(prev => prev.concat(nodes));
    }
    setRefresh(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myDocumentData, isDocumentSuccess, shareDocData, isShareDocSuccess]);

  const viewDocument = (id: string) => {
    props.navigation.navigate({
      name: 'ViewFile',
      params: {
        id,
        isShared: selectedHeader === t('document:myDoc') ? false : true,
      },
    });
  };

  const openPanel = () => {
    Keyboard.dismiss();
    setIsPanelActive(true);
  };

  const closePanel = () => {
    setIsPanelActive(false);
  };

  const compressImage = result => {
    return new Promise(async (resolve, reject) => {
      try {
        const compressResult = await ImageCompress.compress(result.uri, {
          compressionMethod: 'auto',
        });

        const compressPath = _isIOS
          ? compressResult.replace('file:///', '')
          : compressResult;
        const stats = await ReactNativeBlobUtil.fs.stat(compressPath);

        if (stats.size / (1024 * 1024) >= 1) {
          showToast(t('common:fileSizeLimit'));
          reject('File size exceeds the limit');
        } else {
          const format = result.type.split('/').pop();
          if (result && format === formats.mp4) {
            showToast(t('common:invalidFormat'));
            reject('Invalid file format');
          } else {
            const uploadObj = {
              fileCopyUri: '',
              name: result.fileName,
              size: stats.size,
              type: result.type,
              uri: 'file:///' + stats.path,
            };
            resolve(uploadObj);
          }
        }
      } catch (error) {
        reject(error);
      }
    });
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
        } else {
          const {assets} = response;
          // const source = {uri: response.uri};
          closePanel();
          //** assets to pass */
          compressImage(assets![0]).then(res => {
            if (res) {
              props.navigation.navigate('CreateDocument', {
                attachment: true,
                asset: res,
              });
            }
          });
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
            // moveToDeviceSettings();
            closePanel();
          }
        } else {
          // const source = {uri: response.uri};
          const {assets} = response;
          compressImage(assets![0]).then(res => {
            if (res) {
              props.navigation.navigate('CreateDocument', {
                attachment: true,
                asset: res,
              });
            }
          });
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
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('SelectCompany');
          }}>
          <Stack horizontal>
            <TextView
              weight="semibold"
              variant={FontSizes.medium}
              numberOfLines={1}
              style={styles.companyNameHead}>
              {companyId?.length > 1
                ? t('addManager:allSelectedCompany')
                : companyId![0]?.name}
            </TextView>
            <Icon name="arrow_selection" size={24} color={colors.black} />
          </Stack>
        </TouchableOpacity>
        {tooltipSeen === 'false' || tooltipSeen === null ? (
          <ToolTip
            data={t('document:tooltip')}
            icon="upload"
            type="Document"
            onPress={val => setTooltipSeen(val)}
          />
        ) : (
          <IconButton
            name="upload"
            size={24}
            color={colors.black}
            onPress={() => {
              openPanel();
            }}
          />
        )}
      </Stack>
    );
  };

  const styles = Styles();
  return (
    <Container noSpacing>
      <Header
        label={t('document:documentRepository')}
        translateY={translateY}
        RenderLeftContainer={renderLeftContainer}
      />
      {/* <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}> */}
      <Stack spacing={16} style={styles.attachmentView}>
        <SearchTextField
          setSearchValue={val => {
            selectedHeader === t('document:myDoc')
              ? setSearchText(val.trim())
              : setSearchShareText(val.trim());
          }}
          // eslint-disable-next-line no-empty-character-class
          pattern1={/[]/}
          pattern2={
            /^[ A-Za-z0-9~`!@#$%^&*+=\-[\]\\';,_-©®™✓°¥€¢£√π÷¶•∆/{}()|\\"':<>?\s]*$/
          }
          // closeIconStyle={closeIconStyle}
          // placeholder="searchTask"
          // autoFocus={true}
        />
      </Stack>
      <ContactRepositoryHeader
        header1={t('document:myDoc')}
        header2={t('contacts:sharedWithMe')}
        isHeader
        selectedValue={selectedHeader}
        onPress={value => {
          selectedHeader === t('document:myDoc')
            ? setPageNo(1)
            : setSharePageNumber(1);
          setSelectedHeader(value);
        }}
      />

      {/* {!myDocumentData?.length && <EmptyComponent />} */}
      {selectedHeader === t('document:myDoc') ? (
        <Stack spacing={16} spaceBelow={16}>
          <DocumentRepositoryList
            isShareWithMeTab={false}
            data={documentState}
            dataLength={myDocumentData?.data.nodes.length}
            stateDataLength={documentState.length}
            isLoading={pageNo > 1 && isDocumentLoading}
            setPageNo={() => {
              if (myDocumentData?.data.pageInfo.hasNextPage) {
                setPageNo(prev => prev + 1);
              }
            }}
            onRefresh={() => {
              setRefresh(true);
              setPageNo(1);
            }}
            isSuccess={isDocumentSuccess}
            onPress={id => {
              viewDocument(id);
            }}
          />
        </Stack>
      ) : (
        <Stack spacing={16} spaceBelow={16}>
          <DocumentRepositoryList
            isShareWithMeTab
            data={shareWithMeDocState}
            dataLength={shareDocData?.data.nodes.length}
            stateDataLength={shareWithMeDocState.length}
            isLoading={sharePageNumber > 1 && isShareDocLoading}
            setPageNo={() => {
              if (shareDocData?.data.pageInfo.hasNextPage) {
                setSharePageNumber(prev => prev + 1);
              }
            }}
            onRefresh={() => {
              setRefresh(true);
              setSharePageNumber(1);
            }}
            isSuccess={isShareDocSuccess}
            onPress={id => {
              viewDocument(id);
            }}
          />
        </Stack>
      )}
      {/* </Animated.ScrollView> */}
      {isPanelActive && (
        <DocumentRepositoryBottomPanel
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
              } else if (parseInt(DeviceInfo.getSystemVersion(), 10) < 13) {
                takePermissionGallery();
              } else {
                chooseFileGallery();
              }
            }
          }}
          isCopyText={() => {}}
        />
      )}
      {/* {swipeModal && (
        <Modal
          isVisible={swipeModal}
          onBackdropPress={() => setSwipeModal(false)}
          style={styles.bottomModal}>
          <View style={styles.bottomModalView}>
            <TouchableOpacity
              onPress={() => {
                takePermissionCamera();
                setSwipeModal(false);
              }}>
              <StackItem childrenGap={10} horizontal style={styles.modalView}>
                <Icon name="camera" size={28} color={colors.primary} />
                <TextView
                  weight="medium"
                  variant={FontSizes.xMedium}
                  style={styles.modalText}>
                  {t('takePhoto')}
                </TextView>
              </StackItem>
            </TouchableOpacity>
            <View style={styles.modalDivide} />
            <TouchableOpacity
              onPress={() => {
                takePermissionGallery();
                setSwipeModal(false);
              }}>
              <StackItem childrenGap={10} horizontal style={styles.modalView}>
                <Icon name="upload" size={28} color={colors.primary} />
                <TextView
                  weight="medium"
                  variant={FontSizes.xMedium}
                  style={styles.modalText}>
                  {t('uploadGallery')}
                </TextView>
              </StackItem>
            </TouchableOpacity>
            <View style={styles.modalDivide} />
            <TouchableOpacity
              onPress={() => {
                takePermissionGallery();
                setSwipeModal(false);
              }}>
              <StackItem childrenGap={10} horizontal style={styles.modalView}>
                <Icon name="file_copy" size={28} color={colors.primary} />
                <TextView
                  weight="medium"
                  variant={FontSizes.xMedium}
                  style={styles.modalText}>
                  {t('copy_Paste')}
                </TextView>
              </StackItem>
            </TouchableOpacity>
          </View>
        </Modal>
      )} */}
      {((isDocumentLoading && pageNo === 1 && !search.length) ||
        (isShareDocLoading &&
          sharePageNumber === 1 &&
          !searchShare.length)) && <Loader />}
    </Container>
  );
};
