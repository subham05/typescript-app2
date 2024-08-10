import {colors} from 'common/theme/colors';
import {StyleSheet} from 'react-native';

export const Styles = () => {
  const mergeStyles = StyleSheet.create({
    view: {
      marginTop: 5,
    },
    smallLabel: {
      color: colors.primary_003,
      marginBottom: 5,
      width: 65,
    },
    smallIcon: {
      marginRight: 5,
    },
    date: {
      marginTop: 3,
    },
    priority: {
      marginLeft: 4,
    },
    button: {
      width: '30%',
      alignSelf: 'flex-end',
    },
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
  });
  return mergeStyles;
};
