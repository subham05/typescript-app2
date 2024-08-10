import {colors} from 'common/theme/colors';
import {StyleSheet} from 'react-native';

export const Styles = StyleSheet.create({
  leftIconStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    marginBottom: 5,
    paddingHorizontal: 10,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  container: {marginHorizontal: 20},
  rowMainContainer: {flex: 1, padding: 8},
  textInput: {
    backgroundColor: colors.white,
    color: colors.black,
    borderRadius: 0,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  row: {
    backgroundColor: 'transparent',
    padding: 0,
  },
  headerContainer: {height: 50},
  gpsIcon: {width: 20, height: 20},
  locationTitle: {
    color: colors.black,
    marginHorizontal: 20,
    marginBottom: 8,
  },
  iconContainer: {marginTop: 5},
  rowContainer: {
    marginLeft: 15,
    justifyContent: 'center',
  },
  secondaryText: {color: colors.primary_003},
});
