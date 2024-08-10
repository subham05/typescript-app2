import {TextView} from 'components';
import moment from 'moment';
import React, {FC} from 'react';
import {View} from 'react-native';
import {Stack} from 'stack-container';
import {styles} from './index.styles';

interface RenderTimelineProps {
  data: string[];
}

const RenderTimeline: FC<RenderTimelineProps> = ({data}) => {
  return (
    <Stack style={styles.container}>
      {data.map((time, index) => {
        return (
          <Stack key={index} style={styles.mainView}>
            <TextView style={styles.timeText}>
              {moment(time, 'LT').format('hh:mm A')}
            </TextView>
            {data.length !== index + 1 && <View style={styles.straightLine} />}
          </Stack>
        );
      })}
    </Stack>
  );
};

export default RenderTimeline;
