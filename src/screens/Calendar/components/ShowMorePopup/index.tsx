import {TextView} from 'components';
import {IconView} from 'components/Icon';
import {Stack} from 'components/Stack';
import moment from 'moment';
import React, {FC} from 'react';
import {FlatList, Pressable, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import {MoreEvent} from 'request/Calendar';
import {CalendarNavigationProps} from 'screens/Calendar';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {EventProps} from 'screens/Calendar/mockData';
import {styles} from './index.styles';

interface ShowMorePopupProps {
  eventData: MoreEvent[];
  isVisible: boolean;
  setEventsPopup: (val: boolean) => void;
  props: CalendarNavigationProps;
}

const ShowMorePopup: FC<ShowMorePopupProps> = ({
  eventData,
  isVisible,
  setEventsPopup,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  props,
}) => {
  return (
    <Modal isVisible={isVisible}>
      <Stack style={styles.outerMainView}>
        <Pressable
          style={styles.closeIcon}
          onPress={() => {
            setEventsPopup(false);
          }}
          hitSlop={15}>
          <IconView name="close" size={20} />
        </Pressable>
        <FlatList
          data={eventData}
          contentContainerStyle={styles.flatListView}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setEventsPopup(false);
                  item?.type === 'EVENT'
                    ? props.navigation.navigate('EventDetails', {
                        eventId: item?._id,
                      })
                    : props.navigation.navigate('TaskDetail');
                }}>
                <Stack horizontal style={styles.card}>
                  <View
                    style={[styles.colorStrip, {backgroundColor: item.color}]}
                  />
                  <Stack style={styles.displayFrame}>
                    <TextView style={styles.titleText}>
                      {item?.subject}
                    </TextView>
                    <TextView style={styles.description}>
                      {item?.description}
                    </TextView>
                    <TextView
                      style={[
                        {
                          color: item.color,
                        },
                        styles.timeText,
                      ]}>{`${moment(item.start).format('hh:mm A')} - ${moment(
                      item.end,
                    ).format('hh:mm A')}`}</TextView>
                  </Stack>
                </Stack>
              </TouchableOpacity>
            );
          }}
        />
      </Stack>
    </Modal>
  );
};

export default ShowMorePopup;
