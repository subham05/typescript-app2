import {StyleSheet} from 'react-native';

export const Styles = () => {
  const mergeStyles = StyleSheet.create({
    swipable: {
      marginTop: '10%',
    },
    line: {
      marginTop: 18,
    },
    icon: {
      marginTop: 10,
    },
  });
  return mergeStyles;
};
