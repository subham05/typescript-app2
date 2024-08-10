import {colors} from 'common/theme/colors';
import {StyleSheet} from 'react-native';

export const Styles = () => {
  const mergeStyles = StyleSheet.create({
    eventsContainer: {
      paddingHorizontal: 20,
      paddingBottom: 40,
      marginTop: 16,
    },
    companyName: {
      marginLeft: 10,
    },
    companyNameHead: {
      width: 160,
    },
    pendingTask: {
      textAlign: 'center',
      color: colors.black,
      padding: 10,
      paddingHorizontal: 23,
    },
  });
  return mergeStyles;
};
