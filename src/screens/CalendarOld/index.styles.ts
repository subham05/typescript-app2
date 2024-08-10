import {colors} from 'common/theme/colors';
import {Dimensions, StyleSheet} from 'react-native';

export const Styles = () => {
  const mergeStyles = StyleSheet.create({
    eventsContainer: {
      marginTop: 15,
    },
    companyNameHead: {
      maxWidth: 160,
    },
    calendar: {
      height: 250,
    },
    calendarHeader: {
      marginLeft: 15,
    },
    calendarHead: {
      marginVertical: 15,
    },
    headLeft: {
      marginLeft: 16,
    },
    headRight: {
      marginLeft: Dimensions.get('screen').width * 0.31,
    },
    days: {
      color: colors.primary,
    },
    day: {
      color: colors.grey_003,
    },
    icon: {
      borderRadius: 80,
      borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center',
      paddingRight: 7,
      height: 25,
      width: 25,
      marginBottom: -10,
    },
    timeView: {
      marginTop: 50,
      flex: 0.3,
    },
    timeLast: {
      marginBottom: 0,
    },
    flexView: {
      flex: 0.7,
    },
    verticalLine: {
      height: '98%',
      width: 1,
      backgroundColor: colors.orange,
      marginHorizontal: 20,
    },
    modalDivide: {
      height: 1.5,
      width: '100%',
      backgroundColor: colors.grey_002,
      marginVertical: 10,
    },
    centeredView: {
      flex: 1,
      backgroundColor: colors.black_001,
    },
    modalMainView: {
      alignSelf: 'flex-end',
      marginTop: 25,
      marginRight: 25,
    },
    modalView: {
      backgroundColor: 'white',
      padding: 15,
      width: Dimensions.get('screen').width - 200,
    },
    view: {
      alignItems: 'center',
    },
    shareText: {
      color: colors.black,
      paddingVertical: 10,
      marginLeft: 20,
    },
    filterWidth: {
      width: 166,
      height: 126,
      justifyContent: 'center',
      marginTop: 22,
    },
    floatingButton: {bottom: 10},
  });
  return mergeStyles;
};
