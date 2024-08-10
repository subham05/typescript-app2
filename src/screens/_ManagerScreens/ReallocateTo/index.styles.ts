import {colors} from 'common/theme/colors';
import {StyleSheet} from 'react-native';

export const Styles = () => {
  const inviteStyles = StyleSheet.create({
    attachmentView: {
      backgroundColor: colors.white,
      marginBottom: 16,
      borderRadius: 3,
    },
    attachmentIcon: {
      justifyContent: 'center',
      marginLeft: 10,
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
    invite: {
      padding: 15,
      textAlign: 'center',
      color: colors.white,
    },
    inviteButton: {
      marginBottom: 15,
      backgroundColor: colors.primary,
    },
    ok: {
      padding: 15,
      textAlign: 'center',
      color: colors.white,
    },
    okButton: {
      marginBottom: 15,
      marginHorizontal: 16,
      backgroundColor: colors.primary,
    },
    centeredView: {},
    modalView: {
      backgroundColor: 'white',
      padding: 15,
    },
    view: {
      alignItems: 'center',
    },
    image: {
      height: 120,
      width: 120,
      marginTop: 20,
    },
    shareText: {
      textAlign: 'center',
      color: colors.black,
      marginTop: 20,
    },
    cancel: {
      marginTop: 30,
    },
  });
  return inviteStyles;
};
