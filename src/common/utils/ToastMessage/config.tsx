import React from 'react';
import {Dimensions} from 'react-native';
import {ToastShowParams} from 'react-native-toast-message';
import Success from './components/SuccessToast';

const {width} = Dimensions.get('screen');
const toastWidth = width - 40;

export const toastConfig = {
  success: (toastProps: ToastShowParams) => (
    <Success toastProps={toastProps} toastWidth={toastWidth} />
  ),
  // error: () => {},
  // info: () => {},
  // any_custom_type: () => {},
};
