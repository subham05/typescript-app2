import {colors} from 'common/theme/colors';
import {TextView} from 'components';
import {IconView} from 'components/Icon';
import moment from 'moment';
import React, {FC, useState} from 'react';
import {Pressable, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {DisplayArray} from 'request/Calendar';
import {CalendarNavigationProps} from 'screens/Calendar';
import {respHeight, respWidth} from 'screens/Calendar/utils/responsive';
import {Stack} from 'stack-container';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {eventHeightMultiplier, ModifiedEvents} from '../EventCard';
import {styles} from '../EventCard/index.styles';

interface CardProps {
  event: DisplayArray;
  index: number;
  calculateEventViewWidth: number;
  props: CalendarNavigationProps;
}

const Card: FC<CardProps> = ({
  event,
  index,
  calculateEventViewWidth,
  props,
}) => {
  const [toggleCloseBtn, setToggleCloseBtn] = useState<boolean>(false);
  const [eventBorderWidth, setEventBorderWidth] = useState<number>(0);

  const eventWidth = useSharedValue(respWidth(event?.width));
  const eventLeft = useSharedValue(respWidth(event?.left));
  const eventZIndex = useSharedValue(10);

  const eventCardStyle = useAnimatedStyle(() => {
    return {
      left: eventLeft.value,
      width: eventWidth.value,
      zIndex: eventZIndex.value,
    };
  });
  const eventMinutes = moment
    .duration(moment(event.end).diff(moment(event.start)))
    .asMinutes();

  return (
    <Animated.View
      key={index}
      style={[
        {
          //   left: dynamicLeft,
          top: respHeight(event?.top) * eventHeightMultiplier,
          height: respHeight(event?.height) * eventHeightMultiplier,
          //   width: dynamicWidth,
          //   zIndex: dynamicZIndex,
          //   left: event.left,
          //   width: event.width,
        },
        styles.outerCard,
        eventCardStyle,
      ]}>
      <Pressable
        onLongPress={() => {
          //   setDynamicWidth(calculateEventViewWidth);
          //   setDynamicLeft(0);
          //   setDynamicZIndex(2);

          if (eventWidth.value <= calculateEventViewWidth - 5) {
            eventWidth.value = withSpring(calculateEventViewWidth, {
              mass: 0.8,
            });
            eventLeft.value = withSpring(0, {mass: 0.8});
            eventZIndex.value = 20;
            setEventBorderWidth(0.6);
            setToggleCloseBtn(!toggleCloseBtn);
          }
        }}
        onPress={() => {
          event?.type === 'FREESLOT'
            ? props.navigation.navigate('CreateEvent')
            : event?.type === 'EVENT'
            ? props.navigation.navigate('EventDetails', {eventId: event._id})
            : undefined;
        }}>
        <Stack
          horizontal
          style={[styles.innerCard, {borderWidth: eventBorderWidth}]}>
          <View style={[styles.colorStrip, {backgroundColor: event.color}]} />

          <Stack
            style={[
              styles.headerView,
              {paddingTop: eventMinutes <= 20 ? 3 : 10},
            ]}>
            <Stack>
              {toggleCloseBtn && (
                <Pressable
                  style={[
                    {
                      left: calculateEventViewWidth - 35,
                    },
                    styles.position,
                  ]}
                  onPress={() => {
                    eventWidth.value = withSpring(respWidth(event?.width), {
                      mass: 0.8,
                    });
                    eventLeft.value = withSpring(respWidth(event?.left), {
                      mass: 0.8,
                    });
                    eventZIndex.value = 10;
                    setEventBorderWidth(0);
                    setToggleCloseBtn(!toggleCloseBtn);
                  }}
                  hitSlop={15}>
                  <IconView name="close" size={respWidth(17)} />
                </Pressable>
              )}
              <TextView
                weight="medium"
                style={styles.titleText}
                numberOfLines={1}>
                {event?.subject}
              </TextView>
              {event?.height * eventHeightMultiplier >= 100 &&
                event?.description !== '' && (
                  <TextView
                    weight="medium"
                    style={styles.description}
                    numberOfLines={1}>
                    {event?.description || ''}
                  </TextView>
                )}
            </Stack>
            {event?.height * eventHeightMultiplier >= 50 && (
              <TextView
                weight="regular"
                numberOfLines={1}
                style={[
                  {
                    color:
                      event.color === colors.grey_002
                        ? colors.black
                        : event.color,
                  },
                  styles.timeText,
                ]}>
                {`${moment(event.start).format('hh:mm A')} - ${moment(
                  event.end,
                ).format('hh:mm A')}`}
              </TextView>
            )}
          </Stack>
        </Stack>
      </Pressable>
    </Animated.View>
  );
};

export default Card;
