import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Stack} from 'components/Stack';
import React from 'react';
import {View} from 'react-native';
import {Styles} from './index.styles';

let currentTime = new Date().toLocaleTimeString('en-US', {
  hour: 'numeric',
  minute: 'numeric',
  hour12: true,
});
let minute = currentTime.split(':')[1];
let minutes = minute.split(' ')[0];
let finalMinutes = 60 - parseInt(minutes, 10);

interface CurrentTimeComponentProps {
  timeArray: any;
}

export const CurrentTimeComponent: React.FC<CurrentTimeComponentProps> = ({
  timeArray,
}) => {
  const styles = Styles(finalMinutes);
  return (
    <>
      {timeArray.map((item: string, index: number) => {
        return (
          <Stack key={item}>
            {currentTime > timeArray[index - 1] &&
            currentTime < timeArray[index] ? (
              <Stack horizontal>
                <TextView
                  weight="regular"
                  variant={FontSizes.small}
                  style={styles.currentTime}>
                  {currentTime}
                </TextView>
                <View style={styles.circle} />
              </Stack>
            ) : (
              <></>
            )}
            {timeArray.length === index + 1 ? (
              <TextView weight="regular" variant={FontSizes.small}>
                {item}
              </TextView>
            ) : (
              <TextView
                weight="regular"
                variant={FontSizes.small}
                style={styles.time}>
                {item}
              </TextView>
            )}
          </Stack>
        );
      })}
    </>
  );
};
