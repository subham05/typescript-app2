import {colors} from 'common/theme/colors';
import {StyleSheet} from 'react-native';

export const Styles = () => {
  const mergeStyles = StyleSheet.create({
    location: {
      width: 200,
    },
    view: {
      // borderWidth: 1,
    },
    circle: {
      height: 214,
      width: 214,
      borderRadius: 107,
      overflow: 'hidden',
      justifyContent: 'center',
      alignItems: 'center',
    },
    bottomView: {
      marginTop: 50,
    },
    bottomTimeView: {
      width: 100,
    },
    checkInOut: {
      color: colors.white,
      top: 20,
      left: 2,
    },
    positionView: {
      justifyContent: 'center',
      flex: 1,
    },
    dateColor: {
      color: colors.primary_003,
    },
  });
  return mergeStyles;
};
