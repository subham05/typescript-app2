import {colors} from 'common/theme/colors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  toastContainer: {
    height: 50,
    backgroundColor: colors.grey_001,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    marginHorizontal: 50,
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    zIndex: 9999,
    elevation: 10,
  },
  toastText: {color: colors.black, paddingHorizontal: 15},
});
