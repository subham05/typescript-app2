import {colors} from 'common/theme/colors';
import {AppFonts, FontSizes} from 'common/theme/font';
import {Dimensions, StyleSheet} from 'react-native';

export const Styles = () => {
  const shareStyles = StyleSheet.create({
    attachmentView: {
      // backgroundColor: colors.white,
      marginBottom: 16,
      borderRadius: 3,
    },
    attachmentIcon: {
      justifyContent: 'center',
      marginLeft: 10,
    },
    input: {
      height: 35,
      borderWidth: 1,
      padding: 10,
      marginTop: 5,
      backgroundColor: colors.white,
      borderColor: colors.white,
      fontFamily: AppFonts.medium,
      fontSize: FontSizes.small,
    },
    companyName: {
      maxWidth: 160,
    },
    selectAll: {
      justifyContent: 'flex-end',
      marginBottom: 16,
      right: 5,
    },
    selectAllText: {
      color: colors.primary_002,
      marginRight: 5,
    },
    share: {
      padding: 15,
      textAlign: 'center',
      color: colors.white,
    },
    shareButton: {
      marginBottom: 15,
      marginHorizontal: 16,
      backgroundColor: colors.primary,
    },
    modalDevide: {
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
      width: Dimensions.get('screen').width - 250,
    },
    view: {
      alignItems: 'center',
    },
    shareText: {
      textAlign: 'center',
      color: colors.black,
    },
    icon: {
      justifyContent: 'center',
      marginLeft: 20,
    },
    emptyCompoHeight: {height: Dimensions.get('screen').height},
  });
  return shareStyles;
};
