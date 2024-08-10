import {colors} from 'common/theme/colors';
import {AppFonts, FontSizes} from 'common/theme/font';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  scrollView: {
    paddingHorizontal: 20,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  titleStack: {
    flex: 1,
  },
  mainTitleView: {
    marginLeft: 15,
  },
  companyName: {
    fontFamily: AppFonts.semibold,
    fontSize: FontSizes.medium,
  },
  companyWebsite: {
    fontFamily: AppFonts.light,
    fontSize: FontSizes.small,
  },
  bottomStack: {
    marginVertical: 20,
  },
  gpsIcon: {
    width: 20,
    height: 20,
    tintColor: colors.primary_003,
  },
  fieldView: {
    width: '47%',
  },
});
