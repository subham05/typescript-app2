import {colors} from 'common/theme/colors';
import {AppFonts, FontSizes} from 'common/theme/font';
import {Dimensions, Platform, StyleSheet} from 'react-native';

export const Styles = () => {
  const mergeStyles = StyleSheet.create({
    input: {
      height: 40,
      borderWidth: 1,
      padding: 10,
      marginTop: 5,
      backgroundColor: colors.white,
      borderColor: colors.white,
      fontFamily: AppFonts.medium,
      fontSize: FontSizes.regular,
      color: colors.primary_003,
    },
    inputText: {
      height: 40,
      borderWidth: 1,
      padding: 10,
      marginTop: 5,
      backgroundColor: colors.white,
      borderColor: colors.grey_002,
      fontFamily: AppFonts.medium,
      fontSize: FontSizes.regular,
      color: colors.primary_003,
    },
    inputDescription: {
      borderWidth: 1,
      paddingTop: 0,
      padding: 10,
      marginTop: 5,
      backgroundColor: colors.white,
      borderColor: colors.white,
      fontFamily: AppFonts.medium,
      fontSize: FontSizes.regular,
      alignItems: 'flex-start',
      color: colors.primary_003,
    },
    inputComment: {
      // height: 30,
      padding: 1,
      // bottom: 5,
      borderWidth: 1,
      width: Dimensions.get('screen').width / 1.8,
      backgroundColor: colors.white,
      borderColor: colors.white,
      fontFamily: AppFonts.medium,
      fontSize: FontSizes.regular,
      color: colors.primary_003,
      // marginTop: 10,
    },
    inputRow: {
      height: 40,
      borderWidth: 1,
      padding: 10,
      marginTop: 5,
      backgroundColor: colors.white,
      borderColor: colors.white,
      fontFamily: AppFonts.medium,
      fontSize: FontSizes.small,
      width: '47%',
    },
    label: {
      marginTop: 10,
      color: colors.grey_003,
    },
    optionLabel: {
      marginTop: 10,
      color: colors.black,
    },
    optionNoteLabel: {
      marginTop: 10,
      color: colors.red,
    },
    labelHead: {
      marginTop: 15,
      marginBottom: 10,
      color: colors.primary_003,
    },
    value: {
      marginBottom: 10,
    },
    buttonView: {
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    fieldView: {
      backgroundColor: colors.white,
    },
    icon: {
      justifyContent: 'center',
      backgroundColor: colors.white,
      height: 40,
      marginTop: 5,
      padding: 5,
      paddingLeft: '10%',
    },
    iconTime: {
      justifyContent: 'center',
      backgroundColor: colors.white,
      height: 40,
      marginTop: 5,
      padding: 5,
      paddingLeft: '16%',
    },
    attachmentView: {
      backgroundColor: colors.white,
      justifyContent: 'space-between',
      marginVertical: 5,
      marginRight: 5,
      borderRadius: 3,
    },
    attachment: {
      padding: 10,
    },
    attachmentIcon: {
      marginTop: 3,
      marginRight: 10,
    },
    emojiIcon: {
      marginTop: 6,
      marginRight: 10,
    },
    commentIcon: {
      marginTop: 8,
      marginRight: 10,
    },
    attachFilesIcon: {
      bottom: 13,
    },
    smallIcon: {
      marginRight: 5,
    },
    downloadIcon: {
      marginTop: 3,
      padding: 10,
    },
    attachmentName: {
      color: colors.black,
      width: 100,
    },
    dropIcon: {marginTop: 13},
    openBox: {
      backgroundColor: colors.white,
      paddingHorizontal: 15,
      // paddingVertical: 10,
      borderRadius: 3,
      // minHeight: 70,
    },
    paddingBox: {
      paddingVertical: 20,
      backgroundColor: colors.grey_001,
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
      paddingHorizontal: 20,
      paddingBottom: 15,
    },
    flatList: {paddingRight: 25},
    dateTime: {color: colors.grey_003, marginTop: 5},
    comment: {
      marginTop: 15,
      width: Dimensions.get('screen').width / 1.6,
    },
    menu: {
      // textAlign: 'center',
      color: colors.black,
      padding: 5,
      paddingHorizontal: 10,
    },
    filterWidth: {width: 150, borderRadius: 8},
    commentHead: {width: '86%'},
    horizontalStack: {marginTop: -10},
    commentStack: {
      backgroundColor: colors.white,
      paddingTop: 20,
      borderRadius: 3,
    },
    options: {position: 'absolute', right: -14, top: 3},
    fileName: {color: colors.primary},
    commentAttachment: {marginHorizontal: '12%', marginVertical: 5},
    centeredView: {},
    modalView: {
      backgroundColor: 'white',
      padding: 15,
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
    position: {marginTop: 2},
    pdfIcon: {height: 20, width: 20, marginRight: 12},
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginTop: 25,
    },
    pdf: {
      flex: 1,
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    },
    mic: {paddingTop: 14},
    view: {
      marginLeft: 10,
      marginTop: 5,
      // width: '75%',
    },
    bottomModalView: {
      backgroundColor: 'white',
      paddingTop: 15,
      maxHeight: '60%',
      height: Platform.OS === 'ios' ? '45%' : undefined,
    },
    bottomModal: {
      justifyContent: 'flex-end',
      margin: 0,
    },
    uploadFiles: {paddingBottom: 20},
    noData: {padding: 17},
    dataNotFound: {
      marginLeft: Dimensions.get('screen').width / 4.2,
      paddingTop: 16,
      paddingBottom: 16,
    },
    loadMore: {alignItems: 'center'},
    error: {
      fontSize: FontSizes.small,
      color: colors.red_002,
    },
    voiceNoteStackStyle: {
      paddingTop: 12,
    },
    NoVoiceFound: {
      flex: 1,
    },
    marginNote: {marginBottom: 16},
  });
  return mergeStyles;
};
