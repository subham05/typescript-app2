import AsyncStorage from '@react-native-async-storage/async-storage';
import {STR_KEYS} from 'common/storage';
import {showToast} from 'common/utils/ToastMessage';
import Loader from 'components/Loader';
import {StackItem} from 'components/Stack';
import {AuthContext} from 'navigation/router';
import React, {useContext, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Alert} from 'react-native';
import {useLazyLogoutQuery} from 'request/Authentication';
import {CreateApi} from 'request/CreateApi';
import {Stack} from 'stack-container';
import {useAppDispatch, useAppSelector} from 'store/hooks';
import {
  resetCompanyId,
  setStaffSubMenuList,
  userDataAction,
} from 'store/Reducer';
import {MenuItem} from '../MenuItem';
import {styles} from './index.styles';
// import {resetCompanyId} from 'store/Reducer';

const CustomDrawerSecondList = (props: any) => {
  const {t} = useTranslation();

  const {signOut} = useContext(AuthContext);
  const dispatch = useAppDispatch();

  const {userData} = useAppSelector(state => state.formanagement);

  const [logout, {isLoading: logoutLoading}] = useLazyLogoutQuery();

  const [expandSetting, setExpandSettings] = useState<boolean>(false);

  const Logout = () => {
    Alert.alert(t('logout:logout'), t('logout:logoutAlert'), [
      {
        text: t('cancel'),
        onPress: () => {},
      },
      {
        text: t('yes'),
        onPress: async () => {
          logout({_id: userData?._id}).then(async res => {
            if (res.isSuccess) {
              // await AsyncStorage.removeItem(STR_KEYS.SELECTED_COMPANIES);
              // dispatch(resetCompanyId());
              dispatch(CreateApi?.util?.resetApiState());
              signOut();
              await AsyncStorage.removeItem('UserType');
              await AsyncStorage.getItem('UserType');
              AsyncStorage.setItem(STR_KEYS.LOGINUSERDATA, '');
              dispatch(userDataAction(undefined));
              dispatch(setStaffSubMenuList([]));

              dispatch(resetCompanyId());
            } else {
              showToast('Something went wrong');
            }
          });
        },
      },
    ]);
  };

  return (
    <>
      <StackItem childrenGap={2}>
        <Stack>
          <MenuItem
            icon="configure"
            reportIcon={expandSetting ? 'arrow_drop_up' : 'arrow_drop_down'}
            title={t('drawer:settings')}
            onPress={() => {
              setExpandSettings(!expandSetting);
            }}
            isSettings
          />
          {expandSetting && (
            <Stack style={styles.expandedSettings} childrenGap={2}>
              <MenuItem
                icon="change_password"
                title={t('drawer:changePass')}
                subMenu
                onPress={() => {
                  props.navigation.navigate('ChangePassword');
                }}
              />
              <MenuItem
                icon="change_language"
                title={t('drawer:changeLang')}
                subMenu
                onPress={() => {
                  props.navigation.navigate('ChangeLanguage');
                }}
              />
              <MenuItem
                icon="change_timezone"
                title={t('drawer:changeTimezone')}
                subMenu
                onPress={() => {
                  props.navigation.navigate('ChangeTimezone');
                }}
              />
            </Stack>
          )}
        </Stack>
        <MenuItem
          icon="aboutus"
          title={t('drawer:aboutUs')}
          onPress={() => {
            props.navigation.navigate('CMSScreen', {
              cameFrom: 'About us',
            });
          }}
        />
        <MenuItem
          icon="privacy"
          title={t('drawer:privacy')}
          onPress={() => {
            props.navigation.navigate('CMSScreen', {
              cameFrom: 'Privacy policy',
            });
          }}
        />
        <MenuItem
          icon="file_doc"
          title={t('drawer:termsConditions')}
          onPress={() => {
            props.navigation.navigate('CMSScreen', {
              cameFrom: 'Terms of service',
            });
          }}
        />
        <MenuItem
          icon="logout"
          title={t('drawer:logout')}
          onPress={() => {
            Logout();
          }}
        />
      </StackItem>
      {logoutLoading && <Loader message="Logging you out" />}
    </>
  );
};

export default CustomDrawerSecondList;
