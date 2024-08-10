import {colors} from 'common/theme/colors';
import {StyleSheet} from 'react-native';

export const Styles = () => {
  const inviteStyles = StyleSheet.create({
    attachmentView: {
      backgroundColor: colors.white,
      marginBottom: 16,
      borderRadius: 3,
      marginRight: 16,
      marginTop: 20,
    },
    attachmentIcon: {
      justifyContent: 'center',
      marginLeft: 10,
    },
    selectAll: {
      justifyContent: 'flex-end',
      marginBottom: 16,
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
      marginHorizontal: 16,
      backgroundColor: colors.primary,
    },
    bottomModalView: {
      backgroundColor: 'white',
      paddingVertical: 15,
    },
    bottomModal: {
      justifyContent: 'flex-end',
      margin: 0,
    },
    modalDivide: {
      height: 1.5,
      width: '100%',
      backgroundColor: colors.grey_002,
      marginVertical: 20,
    },
    modalView: {
      marginLeft: 20,
    },
    modalText: {
      color: colors.black,
    },
    tooltipText: {
      color: colors.white,
    },
    companyNameHead: {
      maxWidth: 160,
    },
  });
  return inviteStyles;
};
