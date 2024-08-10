import {colors} from 'common/theme/colors';
import {StyleSheet} from 'react-native';

export const Styles = () => {
  const mergeStyles = StyleSheet.create({
    swipable: {
      marginTop: '8%',
    },
    line: {
      height: 1,
      backgroundColor: colors.grey_002,
      marginTop: 10,
    },
    icon: {
      marginTop: 10,
    },
    modalView: {
      marginLeft: 20,
    },
    modalText: {
      color: colors.black,
    },
  });
  return mergeStyles;
};
