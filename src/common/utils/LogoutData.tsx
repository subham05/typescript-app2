import AsyncStorage from '@react-native-async-storage/async-storage';
import {STR_KEYS} from 'common/storage';
import {t} from 'i18next';
import {AuthContext} from 'navigation/router';
import {useContext} from 'react';
import {Alert} from 'react-native';
import {useAppDispatch} from 'store/hooks';
import {
  resetCompanyId,
  setStaffSubMenuList,
  userDataAction,
} from 'store/Reducer';

export const LogoutClearData = () => {
  const dispatch = useAppDispatch();
  const {signOut} = useContext(AuthContext);
  // await AsyncStorage.removeItem('UserType');
  // await AsyncStorage.getItem('UserType');
  // AsyncStorage.setItem(STR_KEYS.LOGINUSERDATA, '');
  dispatch(userDataAction(undefined));
  // signOut();
  // return console.log('function called');
  Alert.alert(t('logout:logout'), t('logout:logoutAlert'), [
    {
      text: 'Okay',
      onPress: async () => {
        await AsyncStorage.removeItem('UserType');
        await AsyncStorage.getItem('UserType');
        dispatch(resetCompanyId());
        AsyncStorage.setItem(STR_KEYS.LOGINUSERDATA, '');
        dispatch(userDataAction(undefined));
        dispatch(setStaffSubMenuList([]));
        signOut();
      },
    },
  ]);
};
