import {colors} from 'common/theme/colors';
import {Dimensions, StyleSheet} from 'react-native';

export const Styles = () => {
  const shareStyles = StyleSheet.create({
    headingColor: {
      color: colors.black,
      marginTop: 10,
    },
    background: {
      backgroundColor: colors.primary,
      marginBottom: 16,
    },
    card: {
      marginVertical: 15,
      paddingTop: 10,
    },
    textColor: {
      color: colors.grey_009,
    },
    nameColor: {
      color: colors.primary_005,
      width: Dimensions.get('screen').width / 2.3,
    },
    text: {
      color: colors.primary_005,
      marginLeft: 10,
    },
    logo: {top: -10},
    source: {
      color: colors.primary_002,
      textAlign: 'right',
      right: 10,
      paddingBottom: 8,
    },
  });
  return shareStyles;
};
