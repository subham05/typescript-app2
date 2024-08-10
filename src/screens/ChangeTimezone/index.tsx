import AsyncStorage from '@react-native-async-storage/async-storage';
import {DrawerScreenProps} from '@react-navigation/drawer';
import {useFocusEffect} from '@react-navigation/native';
import {STR_KEYS} from 'common/storage';
import {FontSizes} from 'common/theme/font';
import {getLocation} from 'common/utils/getLocation';
import {AlertPermission} from 'common/utils/permission/Alert';
import {
  checkLocationPermission,
  getLocationPermission,
} from 'common/utils/permission/ReadLocation';
import {showToast} from 'common/utils/ToastMessage';
import {Container} from 'components';
import {DefaultButton, PrimaryButton} from 'components/Buttons';
import {DropdownPicker} from 'components/DropdownPicker';
import Header from 'components/Header';
import Loader from 'components/Loader';
import {Stack} from 'components/Stack';
import {DrawerNavParamList} from 'navigation/Stacks/DrawerNavigation';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {AppState, Platform} from 'react-native';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSharedValue} from 'react-native-reanimated';
import {
  ChangeTimezoneBody,
  GetAllTimezonesBody,
  useChangeTimezoneMutation,
  useGetAllTimezonesMutation,
} from 'request/Timezone';
import {DropDownModel} from 'screens/AddTask';
import {useAppDispatch, useAppSelector} from 'store/hooks';
import {userDataAction} from 'store/Reducer';
import {Styles} from './index.styles';

type Props = DrawerScreenProps<DrawerNavParamList, 'ChangeTimezone'>;
export const ChangeTimezoneScreen = (props: Props) => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const {userData} = useAppSelector(state => state.formanagement);
  const appState = useRef(AppState.currentState);
  // const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const dispatch = useAppDispatch();

  const [
    changeTimezone,
    {
      data: myDocumentData,
      isLoading: isChangeTimezoneLoading,
      isSuccess: isChangeTimezoneSuccess,
    },
  ] = useChangeTimezoneMutation();

  const [getAllTimezones, {}] = useGetAllTimezonesMutation();

  let [documentLabel, setDocumentLabel] = useState<string>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<DropDownModel[]>([]);
  const [selectedTimezone, setSelectedTimezone] = useState<
    string | undefined
  >();

  const [isLocationPermission, setIsLocationPermission] =
    useState<boolean>(false);

  useEffect(() => {
    if (isChangeTimezoneSuccess) {
      AsyncStorage.setItem(
        STR_KEYS.LOGINUSERDATA,
        JSON.stringify({
          ...userData,
          login: {
            ...userData?.login,
            timezone: selectedTimezone?.split('UTC')[0].trim(),
            utcOffset: `UTC${selectedTimezone?.split('UTC')[1]}`,
          },
        }),
      );
      dispatch(
        userDataAction({
          ...userData,
          login: {
            ...userData?.login,
            timezone: selectedTimezone?.split('UTC')[0].trim(),
            utcOffset: `UTC${selectedTimezone?.split('UTC')[1]}`,
          },
        }),
      );
      showToast(myDocumentData?.message);
      props.navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isChangeTimezoneSuccess]);

  const takeLocationPermission = () => {
    checkLocationPermission().then(res => {
      if (!res.isPermissionGranted) {
        if (res.result === 'denied') {
          getLocationPermission().then(resp => {
            if (resp.isPermissionGranted) {
              setIsLocationPermission(true);
            } else {
              setIsLocationPermission(false);
              AlertPermission(t('permissions:location'));
            }
          });
        } else if (res.result === 'blocked') {
          setIsLocationPermission(false);
          AlertPermission(t('permissions:location'));
        }
      } else {
        setIsLocationPermission(true);
      }
    });
  };

  const checkLocationSwitch = () => {
    return new Promise(resolve => {
      RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
        interval: 10000,
        fastInterval: 5000,
      })
        .then(locationData => resolve(locationData))
        .catch(() => setIsLocationPermission(false));
    });
  };

  const _getLocation = async () => {
    if (isLocationPermission) {
      let isEnabled =
        Platform.OS === 'android' && (await checkLocationSwitch());

      if (
        isEnabled === 'already-enabled' ||
        isEnabled === 'enabled' ||
        Platform.OS === 'ios'
      ) {
        setIsLoading(true);
        getLocation()
          .then((res: any) => {
            console.log('res ', res);

            AsyncStorage.getItem(STR_KEYS.LOGINUSERDATA).then(resp => {
              let dataObj = JSON.parse(resp);
              if (
                dataObj?.login?.timezone !== undefined &&
                dataObj?.login?.utcOffset !== undefined
              ) {
                setSelectedTimezone(
                  `${dataObj?.login?.timezone} ${dataObj?.login?.utcOffset}`,
                );
                documentLabel = `${dataObj?.login?.timezone} ${dataObj?.login?.utcOffset}`;
                setDocumentLabel(documentLabel);
              }
            });
            if (res) {
              res?.complete_address?.map(itemCountry => {
                if (itemCountry?.types?.includes('country')) {
                  let bodyObj: GetAllTimezonesBody = {
                    // country: 'US',
                    country: itemCountry?.short_name,
                  };
                  getAllTimezones(bodyObj)
                    .unwrap()
                    .then(resTimeZone => {
                      let arrData = [];
                      resTimeZone.map(item => {
                        arrData.push({
                          label: `${item?.zoneName} ${item?.gmtOffsetName}`,
                          value: `${item?.zoneName} ${item?.gmtOffsetName}`,
                        });
                      });
                      if (arrData.some(item => item.label === documentLabel)) {
                        null;
                      } else if (
                        documentLabel !== undefined &&
                        documentLabel !== ''
                      ) {
                        // arrData.push({
                        //   label: documentLabel,
                        //   value: documentLabel,
                        // });
                      }
                      setData(arrData);
                    });
                }
              });
            }
            AsyncStorage.getItem(STR_KEYS.LOGINUSERDATA).then(resp => {
              let dataObj = JSON.parse(resp);
              if (
                dataObj?.login?.timezone !== undefined &&
                dataObj?.login?.utcOffset !== undefined
              ) {
                setSelectedTimezone(
                  `${dataObj?.login?.timezone} ${dataObj?.login?.utcOffset}`,
                );
                setDocumentLabel(
                  `${dataObj?.login?.timezone} ${dataObj?.login?.utcOffset}`,
                );
              }
            });
            setIsLoading(false);
          })
          .catch(() => {
            setIsLoading(false);
          });
      }
    } else if (!isLocationPermission) {
      let arrData = [];
      arrData.push({
        label: `${userData?.login?.timezone} ${userData?.login?.utcOffset}`,
        value: `${userData?.login?.timezone} ${userData?.login?.utcOffset}`,
      });
      setData(arrData);
      AsyncStorage.getItem(STR_KEYS.LOGINUSERDATA).then(resp => {
        let dataObj = JSON.parse(resp);
        if (
          dataObj?.login?.timezone !== undefined &&
          dataObj?.login?.utcOffset !== undefined
        ) {
          setSelectedTimezone(
            `${dataObj?.login?.timezone} ${dataObj?.login?.utcOffset}`,
          );
          setDocumentLabel(
            `${dataObj?.login?.timezone} ${dataObj?.login?.utcOffset}`,
          );
        }
      });
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      _getLocation();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLocationPermission]),
  );

  useFocusEffect(
    useCallback(() => {
      let subscription: any;
      if (Platform.OS === 'ios') {
        subscription = AppState.addEventListener('change', nextAppState => {
          if (
            appState.current.match(/inactive|background/) &&
            nextAppState === 'active'
          ) {
            setTimeout(() => {
              takeLocationPermission();
            }, 600);
          }
          appState.current = nextAppState;
        });
      }
      setTimeout(() => {
        takeLocationPermission();
      }, 600);

      return () => {
        if (Platform.OS === 'ios') {
          subscription?.remove();
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const styles = Styles();
  return (
    <Container noSpacing>
      <Header
        label={t('timezone:head')}
        // navigationType="STACK"
        translateY={translateY}
      />
      <Stack style={styles.flex}>
        <KeyboardAwareScrollView contentContainerStyle={styles.scrollView}>
          <Stack spacing={16} spaceBelow={16} style={styles.flexOne}>
            <DropdownPicker
              label={t('timezone:selectTimezone')}
              options={data}
              value={documentLabel}
              // onSelect={val => {
              //   //setTitleValue(val.value); `${item?.zoneName} ${item?.gmtOffsetName}`
              //   setDocumentLabel(`${val?.zoneName} ${val?.gmtOffsetName}`);
              //   setSelectedTimezone(`${val?.zoneName} ${val?.gmtOffsetName}`);
              // }}
              onChange={(item: DropDownModel) => {
                setDocumentLabel(item.label);
                setSelectedTimezone(item.value);
              }}
              // placeholder={t('timezone:selectTimezone')}
              placeholder={
                documentLabel?.length! > 0
                  ? documentLabel
                  : t('timezone:selectTimezone')
              }
            />
          </Stack>

          <Stack spacing={16} horizontal horizontalAlign="space-between" center>
            <PrimaryButton
              title={t('save')}
              onPress={() => {
                let bodyObj: ChangeTimezoneBody = {
                  timezone: selectedTimezone?.split('UTC')[0].trim(),
                  utcOffset: selectedTimezone?.split('UTC')[1]
                    ? `UTC${selectedTimezone?.split('UTC')[1]}`
                    : '',
                  // country_long: 'Australia',
                };
                changeTimezone(bodyObj);
              }}
              style={styles.saveButton}
            />
            <DefaultButton
              title={t('cancel')}
              fontSize={FontSizes.small}
              onPress={() => {
                props.navigation.goBack();
              }}
              style={styles.addMoreButton}
            />
          </Stack>
        </KeyboardAwareScrollView>
      </Stack>

      {(isLoading || isChangeTimezoneLoading) && (
        <Loader message="Loading..." />
      )}
      {/* {isError && showToast('Something went wrong.')} */}
    </Container>
  );
};
