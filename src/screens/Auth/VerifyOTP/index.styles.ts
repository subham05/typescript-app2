import {colors} from 'common/theme/colors';
import {StyleSheet} from 'react-native';

export const Styles = StyleSheet.create({
  flex: {flex: 1},
  flexScroll: {flexGrow: 1, justifyContent: 'space-between'},
  backIcon: {
    marginTop: 10,
  },
  topImage: {
    position: 'absolute',
    right: 0,
  },
  bottomImage: {
    position: 'absolute',
    left: 0,
    bottom: 0,
  },
  mainStack: {
    flex: 1,
    marginTop: 130,
  },
  signIn: {
    marginTop: 20,
  },
  timer: {
    marginTop: 20,
    color: colors.primary_002,
  },
  paddingButton: {
    marginBottom: 15,
  },
  resendOTP: {
    color: colors.primary_002,
  },
  resendOTPDisabled: {
    color: colors.primary_005,
  },
  root: {flex: 1, padding: 20},
  codeFieldRoot: {marginTop: 20},
  cell: {
    width: 70,
    height: 67,
    lineHeight: 70,
    borderWidth: 2,
    borderColor: colors.grey_001,
    textAlign: 'center',
    backgroundColor: colors.white,
    borderRadius: 3,
  },
  focusCell: {
    borderColor: colors.grey_001,
  },
});
