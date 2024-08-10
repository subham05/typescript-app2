import {TextView} from 'components';
import React from 'react';
import {View} from 'react-native';
import {ToastShowParams} from 'react-native-toast-message';
import {styles} from './index.styles';
interface successModal {
  toastWidth: number;
  toastProps: ToastShowParams;
}
const Success: React.FC<successModal> = ({toastWidth, toastProps}) => {
  return (
    <View style={[styles.toastContainer, {width: toastWidth}]}>
      <TextView variant={16} weight="regular" style={styles.toastText}>
        {toastProps.text1}
      </TextView>
    </View>
  );
};
export default Success;
