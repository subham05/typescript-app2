import {Stack} from 'components/Stack';
import React, {FC} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {EventProps} from 'screens/Calendar/mockData';
import {respHeight} from 'screens/Calendar/utils/responsive';
import {eventHeightMultiplier} from '../EventCard';
import {styles} from './index.styles';

interface ShowMoreProps {
  data: ShowMoreModal[];
  onShowMorePress: (events: EventProps[]) => void;
}

export interface ShowMoreModal {
  top: number;
  batchMin: string;
  batchMax: string;
  moreEvents: EventProps[];
}

const ShowMore: FC<ShowMoreProps> = ({data, onShowMorePress}) => {
  return (
    <View style={{marginVertical: respHeight(30)}}>
      {data.map((element, index) => {
        return (
          <Stack key={index}>
            <TouchableOpacity
              onPress={() => {
                console.log('element', element.moreEvents);
                onShowMorePress(element.moreEvents);
              }}
              style={[
                styles.container,
                {
                  top: respHeight(element.top * eventHeightMultiplier),
                },
              ]}>
              <Text style={styles.showMoreText}>
                +{element.moreEvents.length}
              </Text>
            </TouchableOpacity>
          </Stack>
        );
      })}
    </View>
  );
};

export default ShowMore;
