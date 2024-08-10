import {colors} from 'common/theme/colors';
import {Dimensions, StyleSheet} from 'react-native';

export const Styles = () => {
  const shareStyles = StyleSheet.create({
    containerStyles: {
      backgroundColor: colors.primary,
      borderRadius: 6,
      flexDirection: 'row',
      paddingHorizontal: 20,
      paddingVertical: 10,
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    stackWidth: {
      width: 80,
    },
    stackWidthChat: {
      width: Dimensions.get('screen').width / 2,
    },
    microphoneWidth: {
      width: 30,
    },
  });
  return shareStyles;
};
