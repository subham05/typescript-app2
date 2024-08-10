import {colors} from 'common/theme/colors';
import {AppFonts, FontSizes} from 'common/theme/font';
import {StyleSheet} from 'react-native';
import {respHeight, respWidth} from 'screens/Calendar/utils/responsive';
import {eventHeightMultiplier} from '../EventCard';

export const styles = StyleSheet.create({
  container: {
    marginVertical: respHeight(20),
    width: respWidth(65),
    // borderWidth: 1,
  },
  mainView: {
    alignItems: 'center',
  },
  timeText: {
    fontSize: respWidth(FontSizes.small),
    fontFamily: AppFonts.regular,
    height: respHeight(20) * eventHeightMultiplier,
    textAlignVertical: 'center',
  },
  straightLine: {
    height: respHeight(80) * eventHeightMultiplier,
    width: 0.5,
    borderWidth: 0.7,
    borderColor: colors.orange,
    justifyContent: 'center',
  },
});
