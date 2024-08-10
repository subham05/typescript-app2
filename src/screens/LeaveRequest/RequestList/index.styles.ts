import {colors} from 'common/theme/colors';
import {StyleSheet} from 'react-native';
import {respHeight} from 'screens/Calendar/utils/responsive';

export const styles = StyleSheet.create({
  outerMainView: {
    marginHorizontal: 20,
    marginVertical: 9,
    padding: 20,
    backgroundColor: colors.white,
    borderRadius: 2,
  },
  appliedText: {
    color: colors.primary_003,
  },
  date: {
    color: colors.black,
    marginLeft: 5,
  },
  secondaryView: {
    marginTop: respHeight(8),
  },
  buttonsMainView: {
    marginTop: respHeight(20),
  },
  button: {
    width: '45%',
    height: 40,
  },
  footerSpacing: {
    marginBottom: respHeight(50),
  },
});
