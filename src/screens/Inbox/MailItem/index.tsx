import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {Spacing} from 'common/theme/spacing';
import {TextView} from 'components';
import {Persona} from 'components/Persona';
import {StackItem} from 'components/Stack';
import React from 'react';
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';
import {TickCircle} from '../components/TickCircle';
import {emailListDataModal} from 'request/Inbox';
import moment from 'moment';
// import {DateTimeFormats} from 'common/utils/DateTimeFormats';
import {t} from 'i18next';
import {DateTimeFormats} from 'common/utils/DateTimeFormats';

interface MailItemProps {
  item: emailListDataModal;
  index: number;
  onPress?: (value: emailListDataModal) => void;
  onLongPress?: (val: emailListDataModal) => void;
  isSelectedVal: boolean | undefined;
  selectedView?: string;
}
export interface MailInboxRowInterface {
  name: string;
  message: string;
  time: string;
  seen?: boolean;
  status?: string;
  type?: string;
}
export const MailItem: React.FC<MailItemProps> = ({
  item,
  index,
  onPress,
  onLongPress,
  selectedView,
}) => {
  const {width} = useWindowDimensions();

  const getTime = () => {
    const {formattedDate, formattedTime} = item;
    const time =
      formattedDate === moment().format(DateTimeFormats.MonthSingleDateYear)
        ? formattedTime
        : formattedDate ===
          moment()
            .subtract(1, 'day')
            .format(DateTimeFormats.MonthSingleDateYear)
        ? 'Yesterday'
        : formattedDate;
    return time;
  };

  const seenViewStyle: ViewStyle | undefined = item.isSeen
    ? {backgroundColor: colors.inbox}
    : undefined;
  const name =
    selectedView === t('inboxPage:inbox')
      ? item.from.match(/\"(.*?)\"/) || item.from
      : item.to.match(/\"(.*?)\"/) || item.to;
  return (
    <TouchableOpacity
      onPress={() => onPress?.(item)}
      onLongPress={() => onLongPress?.(item)}>
      <StackItem
        childrenGap={10}
        horizontal
        key={index}
        horizontalAlign="flex-start"
        style={[
          styles().container,
          seenViewStyle,
          {
            backgroundColor: item?.isSelected ? colors.selectColor : undefined,
          },
        ]}>
        {selectedView === t('inboxPage:inbox') ? (
          <Persona
            name={
              (name?.length! > 0 && item?.from?.match(/\"(.*?)\"/) !== null
                ? name![0]?.replace(/[&\/\\#,+$~%.'":*?]/g, '')
                : (name as string)) || ''
            }
          />
        ) : (
          <Persona
            name={
              (name?.length! > 0 &&
              item?.to?.match(
                /\$+[^$\\]*(?:\\[\s\S][^$\\]*)*\$+|[^,\s][^,]*/g,
              ) !== null
                ? name![0]?.replace(/[&\/\\#,+$~%.'":*?]/g, '')
                : (name as string)) || ''
            }
          />
        )}
        <StackItem
          style={{
            width: item.status ? width * 0.5 : width * 0.53,
          }}>
          <TextView weight="medium" variant={FontSizes.medium} truncate>
            {(name?.length! > 0 && item?.from?.match(/\"(.*?)\"/) !== null
              ? name![0]?.replace(/[&\/\\#,+$~%.'":*?]/g, '')
              : (name as string)) || ''}
          </TextView>
          <TextView weight="regular" variant={FontSizes.small} truncate>
            {item.subject || ''}
          </TextView>
        </StackItem>
        <View
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            alignItems: 'flex-end',
            width: item.status
              ? Dimensions.get('screen').width - width * 0.75
              : Dimensions.get('screen').width - width * 0.77,
          }}>
          <TextView
            weight="regular"
            variant={FontSizes.xSmall}
            style={styles().onlyTime}>
            {item.date ? getTime() : ''}
            {/* {moment(item.date).format(DateTimeFormats.TimeAMPM)} */}
          </TextView>
          {(item.status || item.status) && ( //need to add type of mail
            <StackItem horizontal childrenGap={5}>
              {(item.isActionable ||
                item.isInformative) /**need to change status to type */ && (
                <View style={styles().type}>
                  <TextView weight="regular" variant={FontSizes.xxSmall}>
                    {item.isActionable
                      ? t('inboxPage:actionable')
                      : item.isInformative
                      ? t('inboxPage:informative')
                      : ''}
                  </TextView>
                </View>
              )}
              {item.taskStatus && <TickCircle name={item.taskStatus} />}
            </StackItem>
          )}
        </View>
      </StackItem>
    </TouchableOpacity>
  );
};

const styles = () => {
  const mergeStyles = StyleSheet.create({
    container: {
      paddingHorizontal: Spacing.basic,
      paddingVertical: 13,
    },
    type: {
      backgroundColor: colors.primary_005,
      height: 23,
      justifyContent: 'center',
      borderRadius: 3,
      paddingHorizontal: 10,
      marginTop: 5,
    },
    onlyTime: {marginHorizontal: 5},
  });
  return mergeStyles;
};
