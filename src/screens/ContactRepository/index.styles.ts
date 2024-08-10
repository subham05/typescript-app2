import {colors} from 'common/theme/colors';
import {AppFonts, FontSizes} from 'common/theme/font';
import {Dimensions, StyleSheet} from 'react-native';

export const Styles = () => {
  const shareStyles = StyleSheet.create({
    head: {marginBottom: 16},
    attachmentView: {
      backgroundColor: colors.white,
      marginBottom: 16,
    },
    attachmentIcon: {
      justifyContent: 'center',
      marginLeft: 10,
    },
    mainView: {
      flex: 1,
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
    selectAll: {
      justifyContent: 'flex-end',
      marginBottom: 16,
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
      height: 2,
      width: '100%',
      backgroundColor: colors.grey_002,
    },
    view: {
      alignItems: 'center',
    },
    shareText: {
      textAlign: 'center',
      color: colors.black,
    },
    menuText: {
      // textAlign: 'center',
      color: colors.black,
      paddingVertical: 10,
    },
    icon: {
      justifyContent: 'center',
      marginLeft: 20,
    },
    contactView: {
      marginLeft: 16,
    },
    contactSelected: {
      marginRight: 20,
      borderBottomWidth: 3,
      borderBottomColor: colors.primary,
      width: 110,
      paddingBottom: 10,
    },
    contactNotSelected: {
      marginRight: 20,
      width: 90,
      paddingBottom: 10,
    },
    contactText: {
      textAlign: 'center',
    },
    swipableView: {
      marginTop: '10%',
      marginLeft: 25,
    },
    swipablemodalDevide: {
      height: 1.5,
      width: '100%',
      backgroundColor: colors.grey_002,
      marginVertical: 20,
    },
    swipableshareText: {
      marginLeft: 10,
      textAlign: 'center',
      color: colors.black,
    },
    option: {
      borderRightWidth: 2,
      borderRightColor: colors.grey_002,
    },
    optionText: {
      marginLeft: 5,
      color: colors.white,
      paddingRight: 20,
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
    bottomView: {
      backgroundColor: colors.primary,
      paddingVertical: 15,
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
    bottomOptions: {
      flex: 0.073,
    },
    menuContainer: {
      width: 150,
      marginTop: 22,
      height: 126,
      justifyContent: 'center',
    },
    filterMenuContainer: {
      width: 180,
      marginTop: 22,
      height: 171,
      justifyContent: 'center',
    },
    menu: {right: 3, top: 15},
    fab: {bottom: -50},
    floatingButton: {marginBottom: Dimensions.get('screen').height / 17},
    titleStyle: {
      color: colors.red_001,
      width: 140,
      paddingVertical: 0,
      textAlign: 'right',
    },

    companyName: {
      maxWidth: 160,
    },
  });
  return shareStyles;
};
