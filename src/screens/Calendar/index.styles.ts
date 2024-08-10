import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {StyleSheet} from 'react-native';
import {respHeight} from './utils/responsive';

export const Styles = StyleSheet.create({
  eventsContainer: {
    marginTop: 5,
  },
  companyNameHead: {
    maxWidth: 160,
  },
  calendarStripHeight: {
    height: 40,
    marginHorizontal: 10,
  },
  highlightedDateContainer: {
    backgroundColor: colors.primary,
    //borderRadius: 5,
    paddingTop: respHeight(8),
    height: 32,
    width: 32,
    padding: 2,
  },
  dateNumberStyle: {
    color: colors.black,
    fontSize: FontSizes.small,
    // fontFamily: AppFonts.light,
    fontWeight: '500',
  },
  knob: {
    width: 30,
    height: 3,
    borderRadius: 1,
    backgroundColor: colors.grey_013,
  },
  knobMainView: {
    alignSelf: 'center',
    padding: 8,
  },
  companyName: {
    maxWidth: 160,
  },
});
