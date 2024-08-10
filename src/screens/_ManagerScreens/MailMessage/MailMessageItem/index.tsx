import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Divider} from 'components/Divider';
import {Icon} from 'components/Icon';
import {Persona} from 'components/Persona';
import {Stack, StackItem} from 'components/Stack';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity, useWindowDimensions} from 'react-native';
import {Styles} from './index.styles';

interface MailMessageItemProps {
  onPressCreateTask: () => void;
  onPressRelatedTask: () => void;
  dataLenth: number;
  opened?: true | false;
  data: MailMessageInterface;
}

export interface MailMessageInterface {
  from: string;
  to: string;
  message: string;
  date: string;
}

export const MailMessageItem: React.FC<MailMessageItemProps> = ({
  onPressCreateTask,
  onPressRelatedTask,
  dataLenth,
  opened,
  data,
}) => {
  const {t} = useTranslation();

  const {width} = useWindowDimensions();
  const [isOpened, setIsOpened] = useState<boolean>(opened ? opened : false);
  const styles = Styles();
  return (
    <StackItem
      childrenGap={10}
      style={dataLenth <= 3 ? null : styles.childrenGap}>
      <TouchableOpacity onPress={() => setIsOpened(!isOpened)}>
        <StackItem childrenGap={10} horizontal>
          <Persona name={data.from} />
          <StackItem style={{width: width * 0.5}}>
            <TextView weight="bold" variant={FontSizes.medium} truncate>
              {data.from}
            </TextView>
            <Stack horizontal>
              <TextView
                weight="medium"
                variant={FontSizes.small}
                numberOfLines={1}
                style={styles.toName}>
                to {data.to}
              </TextView>
              {isOpened && (
                <Icon name="arrow_drop_down" size={22} color={colors.black} />
              )}
            </Stack>
          </StackItem>
          <Stack verticalAlign="flex-end">
            <TextView
              weight="medium"
              variant={FontSizes.xSmall}
              style={styles.time}>
              {' ' +
                data.date.split(' ')[0] +
                ' ' +
                data.date.split(' ')[1] +
                data.date.split(' ')[2].split(',')[0]}
            </TextView>
          </Stack>
        </StackItem>
      </TouchableOpacity>
      {isOpened && (
        <StackItem childrenGap={10}>
          <StackItem childrenGap={10} style={styles.borderView}>
            <Stack horizontal spacing={16} style={styles.borderTop}>
              <TextView
                weight="medium"
                variant={FontSizes.xSmall}
                style={styles.openFlex}>
                {t('inboxPage:from')}:
              </TextView>
              <StackItem horizontal childrenGap={5}>
                <TextView weight="bold" variant={FontSizes.xSmall}>
                  {data.from}
                </TextView>
                <TextView weight="bold" variant={FontSizes.xSmall}>
                  |
                </TextView>
                <TextView weight="medium" variant={FontSizes.xSmall}>
                  company@mail.com
                </TextView>
              </StackItem>
            </Stack>
            <Stack horizontal spacing={16}>
              <TextView
                weight="medium"
                variant={FontSizes.xSmall}
                style={styles.openFlex}>
                {t('inboxPage:to')}:
              </TextView>
              <StackItem horizontal childrenGap={5}>
                <TextView weight="bold" variant={FontSizes.xSmall}>
                  {data.to}
                </TextView>
                <TextView weight="bold" variant={FontSizes.xSmall}>
                  |
                </TextView>
                <TextView weight="medium" variant={FontSizes.xSmall}>
                  jennyw@mail.com
                </TextView>
              </StackItem>
            </Stack>
            <Stack horizontal spacing={16} style={styles.borderBottom}>
              <TextView
                weight="medium"
                variant={FontSizes.xSmall}
                style={styles.dateFlex}>
                {t('inboxPage:date')}:
              </TextView>
              <TextView weight="bold" variant={FontSizes.xSmall}>
                {data.date}
              </TextView>
            </Stack>
          </StackItem>
          <Stack horizontal>
            <TouchableOpacity
              onPress={() => {
                onPressCreateTask();
              }}
              style={styles.createTaskButton}>
              <TextView
                weight="medium"
                variant={FontSizes.small}
                style={styles.createTask}>
                {t('inboxPage:create')}
              </TextView>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                onPressRelatedTask();
              }}
              style={styles.relatedTaskButton}>
              <TextView
                weight="medium"
                variant={FontSizes.small}
                style={styles.relatedTask}>
                {t('inboxPage:related')}
              </TextView>
            </TouchableOpacity>
          </Stack>
          {/* <Divider size={2} /> */}
        </StackItem>
      )}
      {dataLenth <= 3 && <Divider size={2} />}
      {isOpened && (
        <StackItem
          childrenGap={15}
          style={dataLenth <= 3 ? null : styles.bottomGap}>
          <TextView weight="regular" variant={FontSizes.regular}>
            Dear {data.to.split(' ')[0]},
          </TextView>
          <TextView weight="regular" variant={FontSizes.regular}>
            {data.message}
          </TextView>
          <StackItem childrenGap={5}>
            <TextView weight="regular" variant={FontSizes.regular}>
              Regards,
            </TextView>
            <TextView weight="regular" variant={FontSizes.regular}>
              {data.from}
            </TextView>
          </StackItem>
          {dataLenth <= 3 && <Divider size={2} />}
        </StackItem>
      )}
    </StackItem>
  );
};
