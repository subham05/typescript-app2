import {StyleSheet} from 'react-native';

export const Styles = () => {
  const shareStyles = StyleSheet.create({
    audioWaveforms: {
      borderRadius: 1,
      borderWidth: 1,
      // borderColor: colors.grey_015,
      marginLeft: 2,
      width: 2,
    },
    waveformView: {
      flexDirection: 'row',
      position: 'relative',
      alignItems: 'center',
      marginLeft: 10,
    },
    slider: {
      height: 40,
      position: 'absolute',
      marginLeft: -15,
      zIndex: 1,
    },
  });
  return shareStyles;
};
