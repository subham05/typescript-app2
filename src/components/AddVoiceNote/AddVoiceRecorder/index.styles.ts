import {colors} from 'common/theme/colors';
import {Dimensions, StyleSheet} from 'react-native';

export const Styles = () => {
  const shareStyles = StyleSheet.create({
    containerStyles: {
      paddingVertical: 10,
      alignItems: 'center',
    },
    microphoneWidth: {
      width: 100,
      height: 80,
    },
    buttonContainer: {
      width: Dimensions.get('screen').width / 2.5,
      height: 50,
      borderRadius: 3,
      alignItems: 'center',
      justifyContent: 'center',
    },
    startStopBtnContainer: {
      width: Dimensions.get('screen').width / 2.5,
      height: 50,
      borderRadius: 3,
      alignItems: 'center',
      justifyContent: 'center',
      borderColor: colors.primary,
      borderWidth: 2,
    },
    textColor: {color: colors.primary},
    textColorWhite: {color: colors.white},
    ml: {marginLeft: 12},
    btnWidth: {width: '100%'},
  });
  return shareStyles;
};
