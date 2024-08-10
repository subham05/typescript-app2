import React from 'react';
import {Day} from 'react-native-gifted-chat';
import {Styles} from 'screens/ChattingScreen/index.styles';

export const renderDay = (renderDayProps: Day['props']) => {
  const styles = Styles();
  return <Day {...renderDayProps} textStyle={styles.renderDay} />;
};
