import {colors} from 'common/theme/colors';
import {Dimensions, StyleSheet} from 'react-native';

export const Styles = () => {
  const mergeStyles = StyleSheet.create({
    openBox: {
      backgroundColor: colors.grey_012,
      paddingHorizontal: 15,
      // paddingVertical: 10,
      borderRadius: 3,
      // minHeight: 70,
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
    pdfIcon: {height: 20, width: 20, marginRight: 12},
    dataNotFound: {
      marginLeft: Dimensions.get('screen').width / 4.2,
      paddingTop: 16,
      paddingBottom: 16,
    },
    flatList: {paddingRight: 25},
    rtlView: {textAlign: 'left'},
  });
  return mergeStyles;
};
