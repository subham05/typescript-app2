import {colors} from 'common/theme/colors';
import {Dimensions, StyleSheet} from 'react-native';

export const Styles = (finalMinutes: number) => {
  const mergeStyles = StyleSheet.create({
    time: {
      marginBottom: 113,
    },
    currentTime: {
      marginBottom: finalMinutes * 2,
      marginTop: -finalMinutes * 2,
      color: colors.orange,
    },
    circle: {
      borderWidth: 1,
      borderColor: colors.orange,
      borderRadius: 20,
      height: 20,
      width: 20,
      left: Dimensions.get('screen').width * 0.106,
      marginBottom: finalMinutes * 2,
      marginTop: -finalMinutes * 2,
      backgroundColor: colors.grey_001,
      zIndex: 1000,
    },
    view: {position: 'absolute', bottom: 60},
  });
  return mergeStyles;
};
