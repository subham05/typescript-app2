import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {DateTimeFormats} from 'common/utils/DateTimeFormats';
import {getTaskStatusCode} from 'common/utils/TaskStatusCode';
import {TextView} from 'components';
import {DefaultButton, PrimaryButton} from 'components/Buttons';
import {Divider} from 'components/Divider';
import {Icon} from 'components/Icon';
import {IconButton} from 'components/IconButtons';
import {Persona} from 'components/Persona';
import {Stack, StackItem} from 'components/Stack';
import moment from 'moment';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Text, TouchableOpacity, View, useWindowDimensions} from 'react-native';
import ImageView from 'react-native-image-viewing';
import {ImageSource} from 'react-native-vector-icons/Icon';
import {emailDetailDataModal} from 'request/Inbox/constants';
import {useAppSelector} from 'store/hooks';
import {Styles as Styles1} from '../../ViewFile/index.styles';
import {Styles} from './index.styles';

interface MailMessageItemProps {
  onPressCreateTask: () => void;
  onPressRelatedTask: () => void;
  dataLength: number;
  opened?: true | false;
  data: emailDetailDataModal;
}

export interface MailMessageInterface {
  from: string;
  to: string;
  message: string;
  date: string;
  status: string;
  main?: boolean;
}

export const MailMessageItem: React.FC<MailMessageItemProps> = ({
  onPressCreateTask,
  onPressRelatedTask,
  dataLength,
  opened,
  data,
}) => {
  const {t} = useTranslation();

  const {width} = useWindowDimensions();
  const {statusColor} = useAppSelector(state => state?.formanagement);
  const [isOpened, setIsOpened] = useState<boolean>(opened ? opened : false);
  const [isVisible, setIsVisible] = useState(false);
  const styles = Styles();
  const styles1 = Styles1();
  const lastIndex = data?.from?.split(' ')?.length - 1;
  const emailData =
    ' | ' + data?.from?.split(' ')[lastIndex].replace(/[<>]/g, '');
  const name = data?.from?.match(/\"(.*?)\"/) || data.from;
  let attachments: ImageSource[] = [];
  data?.attachment?.map(item => attachments?.push({uri: item?.url}));
  return (
    <StackItem childrenGap={10} style={styles.childrenGap}>
      <TouchableOpacity onPress={() => setIsOpened(!isOpened)}>
        <StackItem childrenGap={10} horizontal>
          <Persona
            name={
              (name?.length! > 0 && data?.from?.match(/\"(.*?)\"/) !== null
                ? name![0]?.replace(/[&\/\\#,+$~%.'":*?]/g, '')
                : (name as string)) || ''
            }
          />
          <StackItem style={{width: width * 0.5}}>
            <TextView weight="bold" variant={FontSizes.medium} truncate>
              {(name?.length! > 0 && data?.from?.match(/\"(.*?)\"/) !== null
                ? name![0]?.replace(/[&\/\\#,+$~%.'":*?]/g, '')
                : typeof name === 'string' && name.split(' ')[0]) || ''}
            </TextView>
            <Stack horizontal>
              <TextView
                weight="medium"
                variant={FontSizes.small}
                numberOfLines={1}
                style={styles.toName}>
                to {data.to}
              </TextView>
              {isOpened ? (
                <Icon name="arrow_drop_down" size={22} color={colors.black} />
              ) : (
                <Icon name="arrow_drop_up" size={22} color={colors.black} />
              )}
            </Stack>
          </StackItem>
          <Stack verticalAlign="flex-end">
            <TextView
              weight="medium"
              variant={FontSizes.xSmall}
              style={styles.time}>
              {moment(data.date).format(DateTimeFormats.MonthDateYear) || ''}
            </TextView>
          </Stack>
        </StackItem>
      </TouchableOpacity>
      {isOpened && (
        <StackItem childrenGap={10}>
          <StackItem childrenGap={10} style={styles.borderView}>
            <Stack horizontal spacing={16} style={styles.borderTop}>
              {data?.priorityTaskId && ( //need to remove
                <View
                  style={[
                    styles.status,
                    {
                      borderColor: getTaskStatusCode(
                        data?.priorityTaskId?.taskStatus!,
                        statusColor,
                      ),
                    },
                  ]}>
                  <Text
                    style={{
                      color: getTaskStatusCode(
                        data?.priorityTaskId?.taskStatus!,
                        statusColor,
                      ),
                      fontWeight: '500',
                    }}>
                    {data?.priorityTaskId?.taskStatus}
                  </Text>
                </View>
              )}
              <TextView
                weight="medium"
                variant={FontSizes.xSmall}
                style={[styles.openFlex]}>
                {t('inboxPage:from')}:
              </TextView>
              <Stack horizontal>
                <TextView weight="bold" variant={FontSizes.xSmall}>
                  {(name?.length! > 0 && data?.from?.match(/\"(.*?)\"/) !== null
                    ? name![0]?.replace(/[&\/\\#,+$~%.'":*?]/g, '')
                    : typeof name === 'string' &&
                      name.split(' ').slice(0, -1).join(' ') + emailData) || ''}
                </TextView>
              </Stack>
            </Stack>
            <Stack horizontal spacing={16}>
              <TextView
                weight="medium"
                variant={FontSizes.xSmall}
                style={styles.openFlex}>
                {t('inboxPage:to')}:
              </TextView>
              <Stack horizontal>
                <TextView weight="bold" variant={FontSizes.xSmall}>
                  {data.to}
                </TextView>
              </Stack>
            </Stack>
            {data?.cc.length ? (
              <Stack horizontal spacing={16}>
                <TextView
                  weight="medium"
                  variant={FontSizes.xSmall}
                  style={styles.openFlex}>
                  {t('inboxPage:cc')}:
                </TextView>
                <Stack horizontal>
                  <TextView weight="bold" variant={FontSizes.xSmall}>
                    {data?.cc.map(item => item + '\t')}
                  </TextView>
                </Stack>
              </Stack>
            ) : null}
            <Stack
              horizontal
              spacing={16}
              style={[
                styles.borderBottom,
                {marginTop: !data?.cc?.length ? -10 : undefined},
              ]}>
              <TextView
                weight="medium"
                variant={FontSizes.xSmall}
                style={styles.dateFlex}>
                {t('inboxPage:date')}:
              </TextView>
              <TextView weight="bold" variant={FontSizes.xSmall}>
                {`${moment(data.date).format(
                  DateTimeFormats.MonthDateYear,
                )}, ${moment(data.date).format(DateTimeFormats.TimeAMPM)}` ||
                  ''}
              </TextView>
            </Stack>
          </StackItem>
          <Stack horizontal style={styles.buttonSpacing}>
            <PrimaryButton
              title={t('inboxPage:create')}
              fontSize={FontSizes.small}
              onPress={onPressCreateTask}
              style={styles.createTaskButton}
            />
            <DefaultButton
              title={t('inboxPage:related')}
              fontSize={FontSizes.small}
              onPress={onPressRelatedTask}
              style={styles.relatedTaskButton}
            />
          </Stack>
          <Divider size={1} color={colors.grey_008} />
        </StackItem>
      )}
      {isOpened && (
        <StackItem
          childrenGap={15}
          style={dataLength <= 3 ? null : styles.bottomGap}>
          <></>
          <TextView weight="regular" variant={FontSizes.regular}>
            {data.body[0]?.replace(/\0/g, '')}
          </TextView>
        </StackItem>
      )}
      <Stack>
        {data?.attachment?.length! > 0 && (
          <TextView
            weight="regular"
            variant={FontSizes.regular}
            style={styles1.label}>
            {t('document:attachment')}
          </TextView>
        )}
        {data?.attachment?.length! > 0 && (
          <ImageView
            images={attachments}
            imageIndex={0}
            visible={isVisible}
            onRequestClose={() => setIsVisible(false)}
          />
        )}
        {data?.attachment?.map(mailAttachment => (
          <Stack horizontal style={styles1.attachmentView}>
            <Stack horizontal style={styles1.attachment}>
              <Icon
                name="photo_gallary"
                size={22}
                style={styles1.attachmentIcon}
              />
              <TextView
                weight="regular"
                variant={FontSizes.regular}
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles1.attachmentName}>
                {decodeURIComponent(mailAttachment?.url).split('/').pop() || ''}
              </TextView>
            </Stack>
            <IconButton
              name="visibility"
              size={18}
              color={colors.black}
              style={styles1.downloadIcon}
              onPress={() => {
                setIsVisible(true);
              }}
            />
          </Stack>
        ))}
      </Stack>
    </StackItem>
  );
};
