import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import React from 'react';
import {StyleProp, TextStyle} from 'react-native';
import {Styles} from './index.styles';

interface TaskPriorityProps {
  priority?: 'High' | 'Medium' | 'Low' | 'Emergency' | string;
  outlined?: boolean;
}

export const TaskPriority: React.FC<TaskPriorityProps> = ({
  priority,
  outlined,
}) => {
  const styles = Styles();

  const getTextStyles = (): StyleProp<TextStyle> => {
    switch (priority) {
      case 'Emergency':
        return styles.emergency;
      case 'High':
        return styles.high;
      case 'Low':
        return styles.low;
      default:
        return styles.medium;
    }
  };

  const getOutlinedTextStyles = (): StyleProp<TextStyle> => {
    switch (priority) {
      case 'Emergency':
        return styles.emergencyOutlined;
      case 'High':
        return styles.highOutlined;
      case 'Low':
        return styles.lowOutlined;
      default:
        return styles.mediumOutlined;
    }
  };

  return (
    <>
      {outlined ? (
        <TextView
          variant={FontSizes.xSmall}
          weight="medium"
          style={[getOutlinedTextStyles(), styles.commonStyleOutlined]}>
          {priority}
        </TextView>
      ) : (
        <TextView
          variant={FontSizes.xSmall}
          weight="medium"
          style={[getTextStyles(), styles.commonStyle]}>
          {priority}
        </TextView>
      )}
    </>
  );
};
