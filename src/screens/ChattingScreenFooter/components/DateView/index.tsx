import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import React from 'react';
import {Styles} from 'screens/ChattingScreenFooter/index.styles';

interface DateViewProps {
  day: string;
}
export const DateView: React.FC<DateViewProps> = ({day}) => {
  const styles = Styles();
  return (
    <TextView
      weight="regular"
      variant={FontSizes.small}
      style={styles.renderDay}>
      {day}
    </TextView>
  );
};
