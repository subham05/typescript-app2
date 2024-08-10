import {colors} from 'common/theme/colors';
import {Dimensions, StyleSheet} from 'react-native';

export const Styles = () => {
  const mergeStyles = StyleSheet.create({
    container: {
      paddingTop: 10,
      borderRadius: 3,
    },
    image: {
      height: 50,
      width: 50,
      borderRadius: 25,
    },
    view: {
      marginTop: 3,
    },
    icon: {
      justifyContent: 'center',
    },
    number: {
      color: colors.grey_003,
    },
    option: {
      borderRightWidth: 2,
      borderRightColor: colors.primary_002,
    },
    optionText: {
      marginLeft: 5,
      color: colors.primary,
      paddingRight: 20,
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.black_001,
    },
    modalView: {
      backgroundColor: 'white',
      padding: 15,
      width: Dimensions.get('screen').width - 30,
    },
    shareVia: {
      padding: 15,
    },
    modal: {
      alignSelf: 'flex-end',
    },
    reopenModal: {
      padding: 15,
      color: colors.primary,
    },
    shareText: {
      textAlign: 'center',
      color: colors.black,
    },
    cancel: {
      marginTop: 30,
    },
    viewDevide: {
      marginVertical: 10,
      height: 2,
      width: '100%',
      backgroundColor: colors.grey_002,
    },
    listDivider: {marginTop: 10},
  });
  return mergeStyles;
};
