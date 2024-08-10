import {colors} from 'common/theme/colors';
import {Dimensions, StyleSheet} from 'react-native';

export const Styles = () => {
  const mergeStyles = StyleSheet.create({
    container: {
      padding: 10,
      borderRadius: 3,
    },
    fileIcon: {
      alignSelf: 'center',
    },
    view: {
      marginLeft: 10,
      marginTop: 3,
      width: Dimensions.get('screen').width - 94,
    },
    dateWidth: {width: '44%'},
    nameWidth: {width: '53%'},
    waveformWidth: {width: '80%', overflow: 'hidden', paddingLeft: 3},
    durationWidth: {width: '15%'},
    text: {
      color: colors.grey_003,
    },
    duration: {right: 10},
    mic: {position: 'absolute', right: -2, bottom: -7},
    share: {
      position: 'absolute',
      right: 8,
      bottom: -1,
      backgroundColor: colors.grey_001,
    },

    modal: {
      height: 97,
      width: 166,
      backgroundColor: colors.white,
      borderTopLeftRadius: 6,
      borderBottomLeftRadius: 6,
      borderBottomRightRadius: 6,
      justifyContent: 'center',
      paddingLeft: 20,
      marginLeft: Dimensions.get('screen').width / 3,
      position: 'absolute',
      // top: 77,
    },
    waveForm: {
      height: 20,
      width: Dimensions.get('screen').width / 2.5,
    },
    line: {
      height: 1,
      width: Dimensions.get('screen').width / 2,
      backgroundColor: colors.primary,
    },
    pausePlayIcon: {marginRight: 5},
  });
  return mergeStyles;
};
