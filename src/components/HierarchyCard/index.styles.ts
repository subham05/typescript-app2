import {colors} from 'common/theme/colors';
import {AppFonts, FontSizes} from 'common/theme/font';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    width: 140,
    height: 70,
  },
  displayPic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 5,
  },
  card: {
    backgroundColor: colors.white,
    height: '100%',
    width: '100%',
    borderRadius: 3,
  },
  innerCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  strip: {
    width: 3,
    height: '100%',
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
  },
  titleWithImg: {
    fontFamily: AppFonts.medium,
    fontSize: FontSizes.medium,
    color: colors.black,
    textAlign: 'center',
  },
  title: {
    fontFamily: AppFonts.regular,
    fontSize: FontSizes.regular,
    color: colors.black,
  },
  flex: {
    flex: 1,
  },
  designation: {
    fontFamily: AppFonts.regular,
    fontSize: FontSizes.xSmall,
    color: colors.primary_003,
  },
});
