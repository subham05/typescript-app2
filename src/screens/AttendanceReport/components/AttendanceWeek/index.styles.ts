import {colors} from 'common/theme/colors';
import {globalScreenWidth} from 'common/utils/ScreenDimensions';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  view: {
    height: 53,
    backgroundColor: colors.white,
    borderRadius: 6,
    marginBottom: 10,
  },
  date: {
    height: 53,
    backgroundColor: colors.primary,
    width: globalScreenWidth / 7,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  time: {
    justifyContent: 'flex-start',
    width: globalScreenWidth / 1.2,
    marginTop: 3,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 13,
  },
  holiday: {
    color: colors.yellow,
    left: -10,
  },
  leave: {
    color: colors.blue_001,
    left: -10,
  },
  absent: {
    color: colors.red_001,
    left: -10,
  },
  checkIn: {
    width: globalScreenWidth / 4.5,
    marginLeft: 16,
  },
  onLeaveModal: {
    height: 77,
    width: 166,
    backgroundColor: colors.white,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: globalScreenWidth / 3.5,
  },
  workingHours: {
    width: globalScreenWidth / 3,
  },
  top: {
    marginTop: 4,
  },
  marginTop: {marginTop: 6},
  filterWidth: {
    height: 67,
    width: 116,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: globalScreenWidth / 3,
    marginTop: 22,
  },
});
