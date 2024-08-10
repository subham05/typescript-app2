import {colors} from 'common/theme/colors';
import {AppFonts, FontSizes} from 'common/theme/font';
import {StyleSheet} from 'react-native';

export const Styles = () => {
  const shareStyles = StyleSheet.create({
    bubble: {
      maxWidth: '50%',
      minWidth: '30%',
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
    header: {
      marginTop: 10,
    },
    headerTop: {
      marginTop: 16,
      marginRight: 10,
    },
    groupIcon: {
      height: 40,
      width: 40,
      padding: 7,
      borderRadius: 20,
      backgroundColor: colors.primary_004,
      marginHorizontal: 10,
      marginTop: 5,
    },
    horizontalLine: {
      marginTop: 15,
    },
    name: {
      justifyContent: 'center',
    },
    renderInputToolBar: {
      backgroundColor: colors.white,
      height: 40,
      width: '80%',
      alignItems: 'center',
      marginLeft: 10,
      marginBottom: 10,
    },
    mic: {
      marginLeft: 10,
      marginBottom: 10,
    },
    view: {
      width: 16,
      height: '100%',
      backgroundColor: colors.grey_001,
      borderTopColor: colors.grey_001,
    },
    smallView: {
      width: 5,
      height: '100%',
      backgroundColor: colors.grey_001,
    },
    TextInput: {
      width: '58%',
      marginLeft: 10,
    },
    sendIcon: {
      // marginBottom: 10,
      backgroundColor: colors.primary,
      paddingLeft: 13,
      padding: 10,
      // marginRight: 7,
      borderRadius: 2,
      // marginBottom: 2,
      // borderRightWidth: 15,
      // borderRightColor: colors.grey_001,
    },
    iconsBottom: {
      marginBottom: 10,
      marginRight: 10,
    },
    nameTime: {
      color: colors.grey_003,
    },
    textViewLeft: {
      marginTop: 10,
      backgroundColor: colors.white,
      borderTopLeftRadius: 6,
      borderTopRightRadius: 6,
      borderBottomRightRadius: 6,
    },
    textViewRight: {
      marginBottom: 10,
      backgroundColor: colors.grey_008,
      borderTopLeftRadius: 6,
      borderTopRightRadius: 6,
      borderBottomLeftRadius: 6,
    },
    text: {
      padding: 12,
      marginBottom: 3,
    },
    tickIcon: {
      marginLeft: 10,
      marginRight: 10,
    },
    headName: {
      marginLeft: 10,
    },
    timeTickView: {
      alignSelf: 'flex-end',
    },
    groupName: {marginLeft: 10, marginTop: 3},
    timeTick: {position: 'absolute', right: 0, bottom: 0, top: 5},
    renderDay: {
      color: colors.primary,
      fontSize: 14,
      fontFamily: AppFonts.regular,
    },
    receiverImage: {
      height: 158,
      width: 152,
      borderTopLeftRadius: 6,
      borderTopRightRadius: 6,
      borderBottomRightRadius: 6,
      borderWidth: 3,
      borderColor: colors.grey_008,
    },
    senderImage: {
      height: 158,
      width: 152,
      borderTopLeftRadius: 6,
      borderTopRightRadius: 6,
      borderBottomLeftRadius: 6,
      borderWidth: 3,
      borderColor: colors.grey_008,
    },
    receiverFileSize: {color: colors.white},
    docxView: {
      height: 57,
      width: '110%',
      right: 20,
      backgroundColor: colors.grey_008,
      borderTopLeftRadius: 6,
      borderTopRightRadius: 6,
      borderBottomLeftRadius: 6,
    },
    docxFileName: {
      height: 35,
      width: '90%',
      backgroundColor: colors.grey_013,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 10,
      marginBottom: 3,
      marginTop: 5,
      borderTopLeftRadius: 6,
      borderTopRightRadius: 6,
      borderBottomLeftRadius: 6,
    },
    dot: {
      height: 3,
      width: 3,
      borderRadius: 3,
      backgroundColor: colors.white,
    },
    docxFooter: {marginLeft: 10},
  });
  return shareStyles;
};
