import {colors} from 'common/theme/colors';
import {_isIOS} from 'common/utils/PlatformCheck';
import {globalScreenHeight} from 'common/utils/ScreenDimensions';
import {StyleSheet} from 'react-native';
import {respHeight} from 'screens/Calendar/utils/responsive';

export const Styles = () => {
  const shareStyles = StyleSheet.create({
    backIcon: {
      marginTop: 10,
    },
    groupIcon: {
      height: globalScreenHeight / 2.6,
      width: '100%',
      backgroundColor: colors.grey_008,
      alignItems: 'center',
      // paddingTop: Dimensions.get('screen').height * 0.08,
      marginBottom: 20,
      justifyContent: 'center',
    },
    header: {
      position: 'absolute',
      width: '100%',
      zIndex: 10,
    },
    head: {
      marginTop: 10,
    },
    view: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 15,
    },
    address: {
      color: colors.grey_003,
    },
    contactInfoHead: {
      marginLeft: 10,
    },
    text: {
      color: colors.primary,
    },
    back: {
      top: 5,
      left: 16,
    },
    stickHeader: {
      width: '100%',
      height: _isIOS ? 50 : 60,
      // backgroundColor: colors.white,
      zIndex: 1,
      paddingTop: !_isIOS ? respHeight(11) : 0,
      // top: _isIOS ? -5 : undefined,
    },
    headerr: {
      position: 'absolute',
      width: '100%',
      top: 48,
      marginTop: _isIOS ? undefined : respHeight(-37),
      zIndex: _isIOS ? undefined : 1000,
      // top: 5,
      // zIndex: 1000,
      backgroundColor: colors.white,
      height: _isIOS ? 50 : 60,
    },
    container: {
      paddingBottom: 10,
      marginHorizontal: 10,
    },
    messageContainer: {
      paddingBottom: 10,
    },
    marginVertical: {
      marginTop: 30,
    },
    titleMargin: {
      marginBottom: 15,
    },
    rtlView: {textAlign: 'left'},
  });
  return shareStyles;
};
