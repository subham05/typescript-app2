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
    head: {
      color: colors.grey_003,
    },
    text: {
      color: colors.grey_003,
      marginTop: 10,
      marginBottom: 15,
    },
    floatingButton: {
      marginTop: 40,
      marginRight: 10,
      alignSelf: 'flex-end',
    },
    floatingIcon: {justifyContent: 'center', alignItems: 'center'},
    materialContainerStyle: {
      width: Dimensions.get('screen').width - 32,
      left: -1,
    },
  });
  return shareStyles;
};
