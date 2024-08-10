import {colors} from 'common/theme/colors';
import {AppFonts, FontSizes} from 'common/theme/font';
import {Dimensions, StyleSheet} from 'react-native';

export const Styles = () => {
  const mergeStyles = StyleSheet.create({
    inputText: {
      height: 80,
      borderWidth: 1,
      padding: 10,
      marginTop: 5,
      backgroundColor: colors.white,
      borderColor: colors.grey_002,
      fontFamily: AppFonts.medium,
      fontSize: FontSizes.regular,
      color: colors.primary_003,
      textAlignVertical: 'top',
      width: Dimensions.get('screen').width - 70,
      borderRadius: 3,
    },
    approve: {
      padding: 15,
      textAlign: 'center',
      color: colors.white,
    },
    approveButton: {
      marginTop: 15,
      backgroundColor: colors.primary,
      width: '47%',
      borderRadius: 3,
    },
    disapprove: {
      padding: 13,
      textAlign: 'center',
      color: colors.primary,
    },
    disapproveButton: {
      marginTop: 15,
      // backgroundColor: colors.white,
      width: '47%',
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: 3,
    },
    buttonView: {
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    share: {
      padding: 15,
      textAlign: 'center',
      color: colors.white,
    },
    shareButton: {
      marginBottom: 15,
      marginHorizontal: '30%',
      backgroundColor: colors.primary,
    },
    centeredView: {},
    modalView: {
      backgroundColor: 'white',
      padding: 15,
      borderRadius: 3,
    },
    shareVia: {
      paddingVertical: 15,
    },
    modal: {
      alignSelf: 'flex-end',
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
      width: '40%',
      alignSelf: 'center',
      borderRadius: 3,
    },
    centeredViewTop: {
      flex: 1,
      backgroundColor: colors.black_001,
    },
    modalMainViewTop: {
      alignSelf: 'flex-end',
      marginTop: 25,
      marginRight: 25,
    },
    modalViewTop: {
      backgroundColor: 'white',
      padding: 15,
    },
    viewTop: {
      alignItems: 'center',
    },
    shareTextTop: {
      textAlign: 'center',
      color: colors.black,
    },
    iconTop: {
      justifyContent: 'center',
      marginLeft: 20,
    },
  });
  return mergeStyles;
};
