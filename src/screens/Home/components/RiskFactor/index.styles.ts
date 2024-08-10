import {colors} from 'common/theme/colors';
import {globalScreenWidth} from 'common/utils/ScreenDimensions';
import {StyleSheet} from 'react-native';

export const Styles = () => {
  const mergeStyles = StyleSheet.create({
    eventsContainer: {
      paddingHorizontal: 20,
      paddingBottom: 40,
    },
    companyName: {
      width: 160,
    },
    count: {
      color: colors.grey_001,
      padding: 2,
      textAlign: 'center',
      borderRadius: 10,
      height: 20,
      width: 20,
      top: 12,

      left: 12,
      overflow: 'hidden',
      marginTop: -5,
    },
    icon: {
      marginTop: 10,
    },
    assignedDot: {
      height: 12,
      width: 12,
      // backgroundColor: colors.grey_008,
      borderRadius: 10,
      marginRight: 5,
      marginTop: 3,
      overflow: 'hidden',
    },
    completedDot: {
      height: 12,
      width: 12,
      // backgroundColor: colors.green_002,
      borderRadius: 10,
      marginRight: 5,
      marginTop: 3,
      overflow: 'hidden',
    },
    inprogressDot: {
      height: 12,
      width: 12,
      // backgroundColor: colors.blue_002,
      borderRadius: 10,
      marginRight: 5,
      marginTop: 3,
      overflow: 'hidden',
    },
    resolvedDot: {
      height: 12,
      width: 12,
      // backgroundColor: colors.primary_002,
      borderRadius: 10,
      marginRight: 5,
      marginTop: 3,
      overflow: 'hidden',
    },
    reopenedDot: {
      height: 12,
      width: 12,
      // backgroundColor: colors.primary,
      borderRadius: 10,
      marginRight: 5,
      marginTop: 3,
      overflow: 'hidden',
    },
    overdueDot: {
      height: 12,
      width: 12,
      // backgroundColor: colors.orange,
      borderRadius: 10,
      marginRight: 5,
      marginTop: 3,
      overflow: 'hidden',
    },
    chartView: {
      backgroundColor: colors.white,
      marginBottom: 16,
      borderRadius: 3,
      paddingBottom: 53,
    },
    chart: {
      marginLeft: -17,
    },
    statusView: {
      top: 20,
      left: 7,
      paddingBottom: 93,
    },
    overdue: {
      left: -12,
    },
    reOpened: {
      left: -5,
    },
    mic: {top: 16},
    filterMenu: {width: '50%', position: 'absolute', right: 30, top: '11%'},
    dropdown: {
      width: 130,
      backgroundColor: colors.grey_001,
      paddingLeft: 10,
    },
    modalView: {
      backgroundColor: colors.white,
      padding: 15,
      width: globalScreenWidth - 30,
    },
    pieChart: {marginTop: 90},
    lineChart: {marginTop: 10},
  });
  return mergeStyles;
};
