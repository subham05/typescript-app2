import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {StackItem} from 'components/Stack';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity} from 'react-native';
import {useGetMasterCollectionQuery} from 'request/MasterCollection';
import {Stack} from 'stack-container';
import {useAppSelector} from 'store/hooks';
import {Styles} from './index.styles';

export interface PriorityPickerFieldProps {
  value?: string;
  onSelect?: (value: string | undefined) => void;
  isError?: boolean;
  disabled?: boolean;
}
export const PriorityComponent: React.FC<PriorityPickerFieldProps> = ({
  value,
  onSelect,
  disabled,
}) => {
  const {t} = useTranslation();
  const {data} = useGetMasterCollectionQuery();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {userData} = useAppSelector(state => state.formanagement);
  // const data = userData?.masterData;
  const [priority, setPriority] = useState<string>(value! ? value : 'Low');
  const priorityArray = data?.priority;

  useEffect(() => {
    onSelect?.(value! ? value : 'Low');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const styles = Styles();
  return (
    <StackItem childrenGap={5}>
      <TextView
        weight="regular"
        variant={FontSizes.regular}
        style={styles.label}>
        {t('addTask:priority')}
      </TextView>
      <Stack childrenGap={10} horizontal>
        {priorityArray?.map((item, index) => {
          return (
            <TouchableOpacity
              disabled={disabled}
              key={index.toString()}
              style={
                item === 'Emergency'
                  ? priority === 'Emergency'
                    ? styles.emergencySelected
                    : styles.emergency
                  : item === 'High'
                  ? priority === 'High'
                    ? styles.highSelected
                    : styles.high
                  : item === 'Medium'
                  ? priority === 'Medium'
                    ? styles.mediumSelected
                    : styles.medium
                  : item === 'Low'
                  ? priority === 'Low'
                    ? styles.lowSelected
                    : styles.low
                  : null
              }
              onPress={() => {
                setPriority(item);
                onSelect?.(item);
              }}>
              <TextView
                weight="semibold"
                variant={FontSizes.small}
                style={
                  item === 'Emergency'
                    ? styles.emergencyText
                    : item === 'High'
                    ? styles.highText
                    : item === 'Medium'
                    ? styles.mediumText
                    : styles.lowText
                }>
                {item}
              </TextView>
            </TouchableOpacity>
          );
        })}
      </Stack>
    </StackItem>
  );
};
