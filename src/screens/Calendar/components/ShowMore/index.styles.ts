import {colors} from 'common/theme/colors';
import {AppFonts, FontSizes} from 'common/theme/font';
import {StyleSheet} from 'react-native';
import {respWidth} from 'screens/Calendar/utils/responsive';

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: respWidth(22),
    marginLeft: respWidth(2),
  },
  showMoreText: {
    fontSize: respWidth(FontSizes.xSmall),
    fontFamily: AppFonts.regular,
    textAlignVertical: 'center',
    color: colors.black,
  },
});
