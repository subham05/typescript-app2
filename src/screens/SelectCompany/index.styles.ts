import {colors} from 'common/theme/colors';
import {StyleSheet} from 'react-native';

export const Styles = () => {
  const mergeStyles = StyleSheet.create({
    flex: {flex: 1},
    companiesContainer: {
      paddingBottom: 40,
    },
    attachmentView: {
      backgroundColor: colors.white,
      marginBottom: 16,
    },
    attachmentIcon: {
      justifyContent: 'center',
      marginLeft: 10,
    },
    selectAll: {
      justifyContent: 'flex-end',
      marginBottom: 16,
    },
    selectAllText: {
      color: colors.primary_002,
      marginRight: 5,
    },
  });
  return mergeStyles;
};
