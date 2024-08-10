import {colors} from 'common/theme/colors';
import {StyleSheet} from 'react-native';
import {respHeight} from 'screens/Calendar/utils/responsive';

export const Styles = () => {
  const shareStyles = StyleSheet.create({
    floatingButton: {
      // alignSelf: 'flex-end',

      position: 'absolute',
      bottom: 40,
      right: 15,
    },
    attachmentView: {
      backgroundColor: colors.white,
      marginBottom: 16,
      borderRadius: 3,
    },
    attachmentIcon: {
      justifyContent: 'center',
      marginLeft: 10,
    },
    floatingIcon: {justifyContent: 'center', alignItems: 'center'},
    extraHeight: {
      height: respHeight(100),
    },
    spacing: {
      marginLeft: 4,
    },
  });
  return shareStyles;
};
