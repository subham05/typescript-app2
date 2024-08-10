import {colors} from 'common/theme/colors';
import {Dimensions, StyleSheet} from 'react-native';
import {respHeight} from 'screens/Calendar/utils/responsive';

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
    },
    chart: {
      marginLeft: -17,
      height: respHeight(400),
    },
    statusView: {
      top: -10,
      left: 7,
    },
    overdue: {
      left: -12,
    },
    reOpened: {
      left: -118,
    },
    mic: {top: 16},
    // filterMenu: {marginTop: 10, width: '73%'},
    filterMenu: {marginTop: 10, marginRight: 40},
    dropdown: {
      width: 130,
      backgroundColor: colors.grey_001,
      paddingLeft: 10,
    },
    modalView: {
      backgroundColor: colors.white,
      padding: 15,
      width: Dimensions.get('screen').width - 30,
    },
    pieChart: {marginTop: 50},
    lineChart: {marginTop: 10},
    selected: {
      backgroundColor: colors.primary,
      height: 10,
      width: 10,
      borderRadius: 10,
      // marginBottom: '50%',
      marginRight: 5,
    },
    notSelected: {
      backgroundColor: colors.primary_003,
      height: 6,
      width: 6,
      borderRadius: 10,
      // marginBottom: '50%',
      marginRight: 5,
    },
    chartSeparator: {width: 50},
    dot: {marginLeft: '49%'},
    mainLegendView: {
      marginHorizontal: 40,
    },
  });
  return mergeStyles;
};
