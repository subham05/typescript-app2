import {colors} from 'common/theme/colors';
import {StyleSheet} from 'react-native';

export const Styles = () => {
  const shareStyles = StyleSheet.create({
    option: {
      borderRightWidth: 2,
      borderRightColor: colors.grey_002,
    },
    optionText: {
      marginLeft: 5,
      color: colors.white,
      paddingRight: 20,
    },
    modal: {
      alignSelf: 'flex-end',
    },
    reopenModal: {
      padding: 15,
      color: colors.primary,
    },
    bottomView: {
      backgroundColor: colors.primary,
      paddingVertical: 13,
      paddingLeft: 5,
    },
    centeredViewDelete: {},
    modalViewDelete: {
      backgroundColor: 'white',
      padding: 15,
    },
    shareViaDelete: {
      padding: 15,
    },
    modalDelete: {
      alignSelf: 'flex-end',
    },
    reopenModalDelete: {
      padding: 15,
      color: colors.primary,
    },
    shareTextDelete: {
      textAlign: 'center',
      color: colors.black,
    },
    cancel: {
      marginTop: 30,
    },
  });
  return shareStyles;
};
