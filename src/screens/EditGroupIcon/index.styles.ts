import {colors} from 'common/theme/colors';
import {StyleSheet} from 'react-native';

export const Styles = () => {
  const shareStyles = StyleSheet.create({
    header: {
      marginLeft: 20,
    },
    imageView: {
      marginTop: '40%',
    },
    image: {
      height: '75%',
      width: '100%',
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
    swipableView: {
      marginBottom: 20,
    },
    swipableModalDivide: {
      height: 1.5,
      width: '100%',
      backgroundColor: colors.grey_002,
      marginVertical: 20,
    },
    swipableShareText: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingBottom: 10,
    },
    bottomView: {
      backgroundColor: 'white',
    },
    bottomModal: {
      justifyContent: 'flex-end',
      margin: 0,
    },
    bottomModalView: {
      backgroundColor: 'white',
      padding: 15,
    },
  });
  return shareStyles;
};
