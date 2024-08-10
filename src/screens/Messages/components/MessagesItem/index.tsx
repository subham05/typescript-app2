import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
// import {DateTimeFormats} from 'common/utils/DateTimeFormats';
import {TextView} from 'components';
import {Divider} from 'components/Divider';
import {Icon} from 'components/Icon';
import {Persona} from 'components/Persona';
import {Stack} from 'components/Stack';
import moment from 'moment';
import React from 'react';
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import {chatModal} from 'request/Message/constants';
import {useAppSelector} from 'store/hooks';
import {getLastMessageType} from './utils';

interface MessagesItemProps {
  item: chatModal;
  type: string;
  onPress?: (item: chatModal) => void;
  viewContact?: boolean;
  hideMsgDate?: boolean;
  // commonGroup?: boolean;
}

export interface MessagesProps {
  name: string;
  time: string;
  message: string;
  seen: boolean;
  image: string;
}

export const MessagesItem: React.FC<MessagesItemProps> = ({
  item,
  type,
  onPress,
  viewContact,
  hideMsgDate = false,
  // commonGroup,
}) => {
  const {width} = useWindowDimensions();
  const {userData} = useAppSelector(state => state.formanagement);

  const getTime = () => {
    const {formattedDate, formattedTime} = item;
    const timeFormate = moment(formattedTime, ['HH:mm']).format('hh:mmA');

    const time =
      formattedDate === moment().format('MMM D,YYYY')
        ? timeFormate
        : formattedDate === moment().subtract(1, 'day').format('MMM D,YYYY')
        ? 'Yesterday'
        : formattedDate;

    return time;
  };

  return (
    <Stack>
      <TouchableOpacity
        onPress={() => onPress!(item)}
        style={styles().container}>
        <Stack horizontal horizontalAlign="space-between">
          <Stack horizontal verticalAlign="center">
            {type === 'Chats' || type === 'People' ? (
              <Persona name={item?.username} image={item?.userImage} />
            ) : (
              <Persona name={item?.groupName} image={item?.groupImage} />
              // <Icon
              //   name="groups"
              //   size={20}
              //   color={colors.white}
              //   style={styles().groupIcon}
              // />
            )}
            <Stack style={styles().view}>
              <Stack horizontal horizontalAlign="space-between">
                <TextView
                  weight="medium"
                  variant={FontSizes.regular}
                  style={{
                    /**Change in width to be done whn unseen count received */
                    width: item?.isSeen
                      ? Dimensions.get('screen').width * 0.6
                      : Dimensions.get('screen').width * 0.6,
                    textAlign: 'left',
                  }}
                  numberOfLines={1}>
                  {item?.username ? item?.username : item?.groupName}
                </TextView>
                {!viewContact && !hideMsgDate && (
                  <TextView
                    weight="regular"
                    variant={FontSizes.xSmall}
                    style={styles().time}>
                    {getTime()}
                  </TextView>
                )}
              </Stack>
              {!hideMsgDate && (
                <Stack horizontal horizontalAlign="space-between">
                  <Stack horizontal>
                    {item?.lastMessage &&
                      item?.lastMessage.user === userData?._id && (
                        <Icon
                          name="sent_tick"
                          size={18}
                          color={
                            item?.isSeen ? colors.blue_001 : colors.grey_003
                          }
                        />
                      )}
                    <TextView
                      weight="regular"
                      variant={FontSizes.small}
                      style={[
                        styles().message,
                        styles().ellipsize,
                        // eslint-disable-next-line react-native/no-inline-styles
                        {width: item?.isSeen ? width * 0.69 : 200},
                      ]}
                      ellipsizeMode={'tail'}
                      numberOfLines={1}>
                      {getLastMessageType(item)}
                    </TextView>
                  </Stack>

                  {!!item?.messageUnseenCount && (
                    <Stack style={styles().messageCountView}>
                      <TextView
                        weight="regular"
                        variant={FontSizes.small}
                        style={{color: colors.white}}>
                        {item?.messageUnseenCount}
                      </TextView>
                    </Stack>
                  )}
                </Stack>
              )}
            </Stack>
          </Stack>
        </Stack>
      </TouchableOpacity>
      <Divider />
    </Stack>
  );
};

const styles = () => {
  const mergeStyles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
      borderRadius: 3,
    },
    groupIcon: {
      height: 50,
      width: 50,
      padding: 15,
      borderRadius: 40,
      backgroundColor: colors.primary_004,
    },
    view: {
      marginLeft: 10,
      marginTop: 3,
      width: '84%',
    },
    icon: {
      justifyContent: 'center',
    },
    message: {
      color: colors.grey_003,
      marginLeft: 6,
    },
    time: {
      color: colors.grey_003,
      marginTop: 3,
    },
    ellipsize: {
      // width: '75%',
      flexGrow: 1,
    },
    messageCountView: {
      height: 24,
      width: 24,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.primary_002,
    },
  });
  return mergeStyles;
};
