import {FontSizes} from 'common/theme/font';
import {Icon} from 'components/Icon';
import {Stack} from 'components/Stack';
import {TextView} from 'components/TextView';
import React, {useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {Styles} from './index.styles';
export interface RadioButtonOption {
  id: number;
  value: string;
}
interface RadioButtonProps {
  data?: RadioButtonOption[];
  value?: RadioButtonOption;
  onSelect?: (value: RadioButtonOption) => void;
  disabled?: boolean;
}
export const RadioButton: React.FC<RadioButtonProps> = ({
  data,
  value,
  onSelect,
  disabled,
}) => {
  useEffect(() => {
    if (value) {
      setRadioValue(value);
    } else {
      setRadioValue(data![0]);
    }
  }, [data, value]);

  const [radioValue, setRadioValue] = useState<RadioButtonOption | undefined>(
    value,
  );

  const onPress = (item: RadioButtonOption) => {
    setRadioValue(item);
    onSelect?.(item);
  };

  const styles = Styles();
  return (
    <Stack horizontal style={styles.label}>
      {data?.map((item, index) => {
        return (
          <TouchableOpacity
            disabled={disabled}
            style={styles.gender}
            onPress={() => onPress(item)}
            key={index.toString()}>
            <Stack horizontal>
              {item.value === radioValue?.value ? (
                <Icon
                  name="radio_button_checked"
                  size={18}
                  style={styles.icon}
                />
              ) : (
                <Icon
                  name="radio_button_unchecked"
                  size={18}
                  style={styles.icon}
                />
              )}
              <TextView
                weight="regular"
                variant={FontSizes.regular}
                style={styles.genderText}>
                {item.value}
              </TextView>
            </Stack>
          </TouchableOpacity>
        );
      })}
    </Stack>
  );
};
