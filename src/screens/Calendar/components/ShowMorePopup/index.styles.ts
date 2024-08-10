import {colors} from 'common/theme/colors';
import {AppFonts, FontSizes} from 'common/theme/font';
import {StyleSheet} from 'react-native';
import {respHeight, respWidth} from 'screens/Calendar/utils/responsive';

export const styles = StyleSheet.create({
  outerMainView: {
    backgroundColor: colors.grey_001,
    height: '85%',
    borderRadius: respWidth(5),
    padding: respWidth(20),
  },
  closeIcon: {
    alignSelf: 'flex-end',
  },
  flatListView: {
    marginTop: respHeight(20),
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: respWidth(3),
    marginVertical: respHeight(10),
  },
  colorStrip: {
    width: respWidth(5),
    height: '100%',
    borderTopLeftRadius: respWidth(3),
    borderBottomLeftRadius: respWidth(3),
    marginRight: respWidth(5),
  },
  displayFrame: {
    paddingBottom: respHeight(10),
    paddingTop: respHeight(10),
    flex: 1,
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
});
