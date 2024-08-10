import {colors} from 'common/theme/colors';
import React, {useEffect, useReducer} from 'react';
import {ActivityIndicator, StatusBar, StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
// import Logo from '../../../../src/assets/svgs/LogoApp.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {STR_KEYS} from 'common/storage';
import LottieView from 'lottie-react-native';
import {
  authActions,
  authStackReducer,
  initialState,
} from 'navigation/Reducers/authStackReducer';
import {useAppDispatch} from 'store/hooks';
import {
  setCompanyIdAction,
  setStatusColor,
  setValidations,
  // setValidations,
  userDataAction,
} from 'store/Reducer';
import {useGetMasterCollectionQuery} from 'request/MasterCollection';

export function SplashScreen() {
  const loading: boolean = true;
  return <SplashView loading={loading} />;
}

interface SplashViewProps {
  loading: boolean;
}
const SplashView: React.FC<SplashViewProps> = ({loading}) => {
  const [authContextState, dispatchAuth] = useReducer(
    authStackReducer,
    initialState,
  );
  const {} = {...authContextState};

  const dispatch = useAppDispatch();

  const {data: masterData, isSuccess: isMasterSuccess} =
    useGetMasterCollectionQuery();

  useEffect(() => {
    if (isMasterSuccess) {
      dispatch(setValidations(masterData!.validationLength));
      dispatch(setStatusColor(masterData!.TaskStatusColor));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [masterData]);

  useEffect(() => {
    AsyncStorage.setItem(STR_KEYS.ACTIVE_CHAT_ID, '');
    AsyncStorage.setItem(STR_KEYS.AUTHENTICATION, 'false');
    dispatchAuth({
      type: authActions.IS_AUTHENTICATED,
      isAuthenticated: false,
      payload: undefined,
      userType: undefined,
    });
    AsyncStorage.getItem(STR_KEYS.LOGINUSERDATA).then(res => {
      if (res) {
        let user = JSON.parse(res!);
        console.log('user', user);
        dispatch(userDataAction(user));
        AsyncStorage.getItem(STR_KEYS.SELECTED_COMPANIES).then(response => {
          dispatch(setCompanyIdAction(JSON.parse(response!)));
        });
      }
    });
  }, [dispatch]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.primary} />
      <View style={styles.imageBackgroundContainer}>
        <LottieView
          autoPlay
          loop={false}
          style={styles.lottieViewContainer}
          source={require('../../../assets/lottie/logo_animation.json')}
        />
      </View>

      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator color={'white'} />
        </View>
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lottieViewContainer: {width: 150, height: 150},
  imageBackgroundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  loaderContainer: {
    position: 'absolute',
    zIndex: 200,
    width: '100%',
    height: 100,
    bottom: 10,
  },
});
