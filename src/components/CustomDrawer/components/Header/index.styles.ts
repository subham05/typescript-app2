import {StyleSheet} from 'react-native';

export const Styles = () => {
  const mergeStyles = StyleSheet.create({
    image: {
      height: 80,
      width: 80,
      borderRadius: 50,
    },
    edit: {
      alignSelf: 'center',
    },
    middleView: {
      maxWidth: 190,
      marginLeft: 16,
    },
  });
  return mergeStyles;
};
