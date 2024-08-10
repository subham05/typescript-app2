import {colors} from 'common/theme/colors';
import {Dimensions, StyleSheet} from 'react-native';

export const Styles = () => {
  const mergeStyles = StyleSheet.create({
    photoView: {
      height: 48,
      width: 48,
      borderRadius: 36,
      backgroundColor: colors.primary_003,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      alignSelf: 'center',
    },
    container: {
      paddingTop: 15,
      borderRadius: 3,
    },
    image: {
      height: 50,
      width: 50,
      borderRadius: 25,
    },
    view: {
      marginTop: 3,
      width: Dimensions.get('screen').width - 120,
    },
    icon: {
      justifyContent: 'center',
    },
    iconImage: {
      top: 33,
      right: 0,
      position: 'absolute',
    },
    number: {
      color: colors.grey_003,
    },
    optionView: {
      marginTop: 15,
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
      // backgroundColor: colors.black_001,
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
    viewDivide: {
      marginTop: 10,
      height: 2,
      width: '100%',
      backgroundColor: colors.grey_002,
    },
    background: {
      backgroundColor: colors.primary,
      // marginBottom: 16,
      marginTop: 10,
      paddingBottom: 16,
    },
    card: {
      marginVertical: 15,
      paddingTop: 10,
    },
    textColor: {
      color: colors.grey_009,
    },
    nameColor: {color: colors.primary_005},
    text: {
      color: colors.primary_005,
      marginLeft: 10,
    },
    logo: {top: -10},
    modalOptionView: {
      // marginLeft: 10,
      backgroundColor: 'transparent',
      // paddingVertical: 20,
      // top: -16,
      paddingLeft: 10,
    },
    edit: {marginVertical: 20, alignSelf: 'flex-end'},
    source: {color: colors.primary_002, textAlign: 'right', right: 16},
    businessCard: {marginTop: 10},
  });
  return mergeStyles;
};
