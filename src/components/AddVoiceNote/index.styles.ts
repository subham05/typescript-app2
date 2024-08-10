import {colors} from 'common/theme/colors';
import {Dimensions, StyleSheet} from 'react-native';

export const Styles = () => {
  const shareStyles = StyleSheet.create({
    addVoiceContainer: {
      backgroundColor: colors.white,
      paddingHorizontal: 20,
      paddingTop: 40,
    },
    title: {
      backgroundColor: colors.grey_001,
      borderRadius: 5,
      width: Dimensions.get('screen').width - 32,
      paddingHorizontal: 20,
      color: colors.black,
    },
    containerWidth: {width: Dimensions.get('screen').width - 30},
    titleHeight: {height: 25},
    isError: {borderColor: colors.red, borderWidth: 0.5},
    closeStyle: {alignSelf: 'flex-end'},
    colorStyle: {color: colors.primary_003},
    mb: {marginBottom: 7, textAlign: 'left'},
    titleStyle: {marginBottom: 20, textAlign: 'center'},
    margin: {margin: 0, justifyContent: 'flex-end'},
  });
  return shareStyles;
};
