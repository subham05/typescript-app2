import {colors} from 'common/theme/colors';
import {Dimensions, StyleSheet} from 'react-native';

export const Styles = () => {
  const inviteStyles = StyleSheet.create({
    flexStyle: {
      flex: 1,
    },
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
    bottomModalView: {
      backgroundColor: 'white',
      paddingVertical: 15,
      paddingBottom: Dimensions.get('screen').height / 15,
    },
    bottomModal: {
      justifyContent: 'flex-end',
      margin: 0,
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
    companyNameHead: {
      maxWidth: 160,
    },
    marginStyle: {
      marginBottom: 32,
    },
  });
  return inviteStyles;
};
