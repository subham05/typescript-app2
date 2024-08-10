import {colors} from 'common/theme/colors';
import {StyleSheet} from 'react-native';

export const Styles = () => {
  const mergeStyles = StyleSheet.create({
    photoView: {
      height: 72,
      width: 72,
      borderRadius: 36,
      backgroundColor: colors.primary_003,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      alignSelf: 'center',
    },
    contactContainerStyle: {
      height: 50,
      width: '100%',
      backgroundColor: colors.white,
    },
    photoText: {color: colors.primary_003, textAlign: 'center'},
  });
  return mergeStyles;
};
