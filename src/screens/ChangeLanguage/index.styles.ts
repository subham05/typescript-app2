import {colors} from 'common/theme/colors';
import {Dimensions, StyleSheet} from 'react-native';

export const Styles = StyleSheet.create({
  text: {
    marginTop: '10%',
    textAlign: 'center',
    marginHorizontal: 26,
    marginBottom: '8%',
  },
  mainStack: {
    flex: 1,
    // marginTop: Dimensions.get('screen').height * 0.03,
  },
  selectLanguageBox: {
    backgroundColor: colors.white,
    height: 300,
    width: '100%',
    borderTopRightRadius: 28,
    borderTopLeftRadius: 28,
  },
  image: {
    height: Dimensions.get('screen').height / 2.5,
    width: '100%',
    // marginTop: 16,
    position: 'absolute',
    bottom: 10,
  },
  backIcon: {
    position: 'absolute',
    left: 20,
    top: 35,
  },
});
