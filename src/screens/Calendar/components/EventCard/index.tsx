// eslint-disable-next-line @typescript-eslint/no-unused-vars
import moment from 'moment';
import React from 'react';
import {Dimensions, View} from 'react-native';
import {DisplayArray} from 'request/Calendar';
import {CalendarNavigationProps} from 'screens/Calendar';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {EventProps} from 'screens/Calendar/mockData';
import populateEvents from 'screens/Calendar/utils/populateFunction';
// import populateEvents from 'screens/Calendar/utils/populateFunction';
import {respWidth} from 'screens/Calendar/utils/responsive';
import Card from '../Card';
import {styles} from './index.styles';

interface EventCardProps {
  data: DisplayArray[] | undefined;
  startFrom: number;
  props: CalendarNavigationProps;
}

export interface ModifiedEvents extends DisplayArray {
  top: number;
  left: number;
  width: number;
  height: number;
  index: number;
}

export const eventHeightMultiplier = 1.3;

export const EventCard: React.FC<EventCardProps> = ({
  data,
  startFrom,
  props,
}) => {
  const deviceWidth = Dimensions.get('screen').width;

  //  Calculation :  40 (left + Right Margin) + 65 (timeline width) + 5 (margin left) + 22 (show more) = 132
  const calculateEventViewWidth = deviceWidth - respWidth(132);
  const modifiedData: ModifiedEvents[] = populateEvents(
    data!,
    calculateEventViewWidth,
    startFrom,
  );

  return (
    <View style={[styles.container, {width: calculateEventViewWidth}]}>
      {modifiedData.map((event, index) => {
        return (
          <Card
            calculateEventViewWidth={calculateEventViewWidth}
            event={event}
            index={index}
            props={props}
          />
        );
      })}
    </View>
  );
};
