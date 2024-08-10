import {StyleSheet} from 'react-native';

export const Styles = () => {
  const mergeStyles = StyleSheet.create({
    expandedReport: {
      marginLeft: 35,
      marginTop: 8,
    },
    image: {
      height: 20,
      width: 20,
      marginTop: 13,
      left: -1,
    },
    performance: {
      marginTop: -3,
    },
  });
  return mergeStyles;
};
