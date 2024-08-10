import {colors} from 'common/theme/colors';
import {Dimensions, StyleSheet} from 'react-native';

export const PointsEarnedStyles = StyleSheet.create({
  emails: {
    height: 40,
    backgroundColor: colors.white,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('screen').width / 3.5,
  },
  container: {
    padding: 20,
    borderRadius: 3,
    backgroundColor: colors.white,
  },
  stack: {
    marginLeft: '-5%',
  },
  text: {
    color: colors.primary_003,
  },
  totalAssigned: {
    color: colors.primary,
  },
  inProgress: {
    color: colors.blue_002,
  },
  overdue: {
    color: colors.orange,
  },
  bottom: {
    marginBottom: 15,
  },
  percentage1: {
    backgroundColor: colors.primary_002,
    height: 15,
    width: 15,
    // borderRadius: 7.5,
    marginRight: 5,
    marginLeft: 10,
  },
  percentage2: {
    backgroundColor: colors.grey_008,
    height: 15,
    width: 15,
    // borderRadius: 7.5,
    marginRight: 5,
    marginLeft: 10,
  },
});
