import {colors} from 'common/theme/colors';
import {AppFonts, FontSizes} from 'common/theme/font';
import {StyleSheet} from 'react-native';
import {respHeight, respWidth} from 'screens/Calendar/utils/responsive';

export const styles = StyleSheet.create({
  container: {
    marginVertical: respHeight(30),
    marginLeft: respWidth(5),

    // borderWidth: 1,
  },
  outerCard: {
    position: 'absolute',
    paddingVertical: respWidth(2),
  },
  innerCard: {
    backgroundColor: colors.white,
    borderRadius: respWidth(3),
    alignItems: 'flex-start',
    overflow: 'hidden',
    borderColor: colors.grey_005,
  },
  colorStrip: {
    width: respWidth(5),
    height: '100%',
    borderTopLeftRadius: respWidth(3),
    borderBottomLeftRadius: respWidth(3),
    marginRight: respWidth(5),
  },
  headerView: {
    flex: 0.95,
    // justifyContent: 'space-between',
  },
  titleText: {
    color: colors.primary,
    fontSize: respWidth(FontSizes.regular),
  },
  description: {
    fontSize: respWidth(FontSizes.xSmall),
    fontFamily: AppFonts.regular,
  },
  timeText: {
    fontSize: respWidth(FontSizes.small),
    paddingBottom: respHeight(5),
  },
  position: {
    position: 'absolute',
  },
});
