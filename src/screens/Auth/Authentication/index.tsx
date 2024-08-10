import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {imageSources} from 'assets/images';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {MaterialTextField} from 'components/TextField';
import {NavContext, RootStackParamList} from 'navigation/router';
import React, {useContext, useEffect} from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import {SafeAreaView} from 'react-native-safe-area-context';
import TouchID from 'react-native-touch-id';
import {Stack} from 'stack-container';
import Logo from '../../../../src/assets/svgs/LogoApp.svg';

type Props = NativeStackScreenProps<RootStackParamList, 'Authentication'>;
export const AuthenticationScreen = ({}: Props) => {
  // const [navContextState] = useReducer(navigationReducer, navInitialState);
  // const {isWalkthroughDone, isPermissionTaken, isCompanySelected} = {
  //   ...navContextState,
  // };

  const {saveAuthentication} = useContext(NavContext);
  useEffect(() => {
    TouchID.authenticate('Touch your finger print sensor to authenticate')
      .then(() => {
        saveAuthentication();
      })
      .catch(() => {});
  }, [saveAuthentication]);

  const RenderRightContainer = () => {
    return (
      <>
        <TouchableOpacity onPress={saveAuthentication}>
          <TextView
            weight="regular"
            variant={FontSizes.regular}
            style={styles.pin}>
            Use PIN
          </TextView>
        </TouchableOpacity>
        <View style={styles.border} />
      </>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.primary} />
      <KeyboardAvoidingView
        behavior="height"
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 20}>
        <Stack>
          <View style={styles.imageBackgroundContainer}>
            <Image
              source={imageSources.splash}
              style={{height: Dimensions.get('screen').height}}
            />
            <Logo style={styles.lottieViewContainer} />
          </View>
          <Modal isVisible={true}>
            <Stack style={styles.selectLanguageBox}>
              <Stack spacing={36} spaceBelow={16} center style={styles.view}>
                <TextView weight="medium" variant={FontSizes.medium}>
                  Enter phone screen lock pattern, PIN, password or fingerprint
                </TextView>
              </Stack>
              <Stack spacing={43} spaceBelow={16}>
                <TextView
                  weight="regular"
                  variant={FontSizes.regular}
                  style={{color: colors.grey_003}}>
                  Unlock For.Management
                </TextView>
              </Stack>
              <Stack spacing={43} spaceBelow={16}>
                <MaterialTextField
                  backgroundColor={colors.white}
                  borderColor={colors.grey_008}
                  RenderRightContainer={RenderRightContainer}
                  materialContainerStyle={{
                    width: Dimensions.get('screen').width - 150,
                  }}
                  keyboardType={'number-pad'}
                />
              </Stack>
              <Stack spacing={43} center spaceBelow={16}>
                <TextView
                  weight="regular"
                  variant={FontSizes.regular}
                  style={{color: colors.grey_003}}>
                  Touch the fingerprint sensor
                </TextView>
              </Stack>
              {/* <Stack spacing={43} center spaceBelow={16}>
                <Image source={imageSources.fingerprint} />
              </Stack> */}
            </Stack>
          </Modal>
        </Stack>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackgroundContainer: {
    flex: 1,
    // bottom: 200,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: colors.primary,
  },
  lottieViewContainer: {
    width: 150,
    height: 150,
    position: 'absolute',
    alignSelf: 'center',
    paddingBottom: 500,
  },
  selectLanguageBox: {
    position: 'absolute',
    bottom: -20,
    left: -20,
    backgroundColor: colors.white,
    height: 350,
    width: Dimensions.get('screen').width,
    borderTopRightRadius: 28,
    borderTopLeftRadius: 28,
  },
  view: {paddingTop: '10%'},
  pin: {
    color: colors.primary_007,
    marginTop: 10,
    paddingBottom: 14,
  },
  border: {
    borderBottomWidth: 2,
    borderBottomColor: colors.grey_008,
  },
});
