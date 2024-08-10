import {colors} from 'common/theme/colors';
import {Dimensions, StyleSheet} from 'react-native';

export const Styles = () => {
  const inviteStyles = StyleSheet.create({
    head: {marginBottom: 16},
    icon: {
      height: 20,
      width: 20,
      borderRadius: 10,
    },
    column: {
      height: 63,
      backgroundColor: colors.white,
      borderTopRightRadius: 6,
      borderTopLeftRadius: 6,
      // justifyContent: 'flex-start',
      paddingLeft: 10,
      elevation: 10,
      marginBottom: 10,
    },
    line: {height: 43, width: 0.5, backgroundColor: colors.grey_008},
    workingHours: {
      width: Dimensions.get('screen').width / 4,
      left: -10,
    },
  });
  return inviteStyles;
};
