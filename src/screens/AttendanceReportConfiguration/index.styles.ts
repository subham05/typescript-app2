import {colors} from 'common/theme/colors';
import {Dimensions, StyleSheet} from 'react-native';

export const Styles = () => {
  const inviteStyles = StyleSheet.create({
    head: {marginVertical: 16},
    icon: {
      height: 20,
      width: 20,
      borderRadius: 20,
      borderWidth: 2,
      // marginRight: 20,
    },
    days: {
      height: 34,
      width: Dimensions.get('screen').width / 9,
      borderRadius: 3,
      justifyContent: 'center',
      alignItems: 'center',
      // marginRight: 10,
    },
    calendar: {marginLeft: -13},
    centeredView: {
      // flex: 1,
      // justifyContent: 'center',
      // alignItems: 'center',
      // backgroundColor: colors.black_001,
      // width: '100%',
    },
    modalView: {
      backgroundColor: 'white',
      padding: 15,
      width: Dimensions.get('screen').width - 38,
      borderRadius: 6,
    },
    shareVia: {
      padding: 15,
    },
    modal: {
      alignSelf: 'flex-end',
      marginBottom: 16,
      marginTop: 10,
    },
    reopenModal: {
      padding: 15,
      color: colors.primary,
    },
    image: {
      height: 47,
      width: 47,
    },
    shareText: {
      textAlign: 'center',
      color: colors.black,
    },
    cancel: {
      marginTop: 30,
    },
    dividerTop: {marginTop: 6},
  });
  return inviteStyles;
};
