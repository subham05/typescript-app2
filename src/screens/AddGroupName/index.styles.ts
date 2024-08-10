import {colors} from 'common/theme/colors';
import {Dimensions, StyleSheet} from 'react-native';

export const Styles = () => {
  const shareStyles = StyleSheet.create({
    header: {
      marginLeft: 10,
    },
    iconNameView: {
      marginTop: 15,
    },
    camera: {
      marginTop: 2,
      backgroundColor: colors.white,
      borderRadius: 24,
      marginRight: 15,
      height: 48,
      width: 48,
      justifyContent: 'center',
      alignItems: 'center',
    },
    input: {
      height: 40,
      width: '80%',
      borderWidth: 1,
      padding: 10,
      marginTop: 5,
      backgroundColor: colors.white,
      borderColor: colors.white,
      marginLeft: 15,
    },
    head: {
      color: colors.grey_003,
      textAlign: 'left',
    },
    text: {
      color: colors.grey_003,
      marginTop: 10,
      marginBottom: 15,
      textAlign: 'left',
    },
    floatingButton: {
      alignSelf: 'flex-end',
      marginRight: 16,
    },
    floatingIcon: {justifyContent: 'center', alignItems: 'center'},
    materialContainerStyle: {
      width: Dimensions.get('screen').width - 100,
      borderColor: colors.white,
      // left: -1,
    },
    rltView: {alignSelf: 'flex-start'},
  });
  return shareStyles;
};
