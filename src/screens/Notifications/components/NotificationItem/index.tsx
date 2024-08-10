// import {imageSources} from 'assets/images';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Icon} from 'components/Icon';
import {Persona} from 'components/Persona';
import {Stack} from 'components/Stack';
import {TaskInterface} from 'components/Task/TaskItem';
import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {NotificationNode} from 'request/Notification';

interface NotificationItemProps {
  data: NotificationNode;
  index: any;
  onPress: () => void;
  onPressTask: (item: NotificationNode) => void;
}

export interface NotificationProps {
  title: string;
  description: string;
  date: string;
  time: string;
  position: string;
  type: string;
  data?: TaskInterface;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  data,
  // index,
  onPress,
  onPressTask,
}) => {
  return (
    <TouchableOpacity
      style={data.seen && styles().backgroundColor}
      onPress={() => {
        // data.actionType === 'Contact-request'
        //   ? onPress()
        //   : data.actionType === 'Tasks'
        //   ? onPressTask(data)
        //   : null;
        data.actionType === 'Contact-request' ? onPress() : onPressTask(data);
      }}>
      <View style={styles().container}>
        <Stack horizontal horizontalAlign="space-between">
          <Stack horizontal>
            {data.actionType === 'Contact-request' ? (
              <View style={styles().imageView}>
                {/* <Image
                  source={imageSources.phoneForwarded}
                  style={styles().image}
                /> */}
                <Icon name="phone_forwarded" size={20} color={colors.white} />
              </View>
            ) : data.senderImage ? (
              <View style={styles().imageView}>
                <Image source={data?.senderImage} style={styles().image} />
              </View>
            ) : (
              <Persona name={data.senderName} />
            )}
            <Stack style={styles().view}>
              <Stack horizontal horizontalAlign="space-between">
                <TextView weight="medium" variant={FontSizes.medium} truncate>
                  {data?.heading}
                </TextView>
              </Stack>
              {
                // index !== '0' &&
                //   index !== '4' &&
                //   index !== '2' &&
                //   index !== '6' &&
                // data.type !== 'Tasks' &&
                <TextView weight="regular" variant={FontSizes.regular}>
                  {data?.senderRole}
                </TextView>
              }
              <TextView weight="regular" variant={FontSizes.small} truncate>
                {data?.message}
              </TextView>
            </Stack>
          </Stack>
          <Stack>
            <TextView weight="regular" variant={FontSizes.xxSmall}>
              {data?.formattedTime}
            </TextView>
            <TextView
              weight="regular"
              variant={FontSizes.xxSmall}
              style={styles().date}>
              {data?.formatedDate}
            </TextView>
          </Stack>
        </Stack>
      </View>
    </TouchableOpacity>
  );
};

const styles = () => {
  const mergeStyles = StyleSheet.create({
    backgroundColor: {
      backgroundColor: colors.grey_007,
    },
    container: {
      padding: 10,
      borderRadius: 3,
      marginHorizontal: 15,
    },
    imageView: {
      height: 48,
      width: 48,
      borderRadius: 25,
      backgroundColor: colors.primary_004,
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      height: 20,
      width: 20,
      borderRadius: 25,
      backgroundColor: colors.primary_004,
    },
    view: {
      marginLeft: 10,
      marginTop: 3,
      width: '70%',
    },
    date: {
      color: colors.primary,
      marginTop: 5,
    },
  });
  return mergeStyles;
};
