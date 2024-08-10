import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Icon} from 'components/Icon';
import {Stack} from 'components/Stack';
import React from 'react';
import {TouchableOpacity} from 'react-native';
import {Styles} from '../../index.styles';

interface TaskBodyHeadProps {
  header: string;
  value: boolean;
  onPress: (val: boolean) => void;
}
export const TaskBodyHead: React.FC<TaskBodyHeadProps> = ({
  header,
  value = false,
  onPress,
}) => {
  //   const [isOpened, setIsOpened] = useState<boolean>(value);

  const onClick = () => {
    // setIsOpened(prevState => !prevState);
    onPress(!value);
  };

  const styles = Styles();
  return (
    <Stack>
      <TouchableOpacity onPress={onClick}>
        <Stack horizontal horizontalAlign="space-between">
          <TextView
            weight="regular"
            variant={FontSizes.regular}
            style={styles.optionLabel}>
            {header}
          </TextView>
          {value ? (
            <Icon
              name="arrow_drop_up"
              size={24}
              color={colors.black}
              style={styles.dropIcon}
            />
          ) : (
            <Icon
              name="arrow_drop_down"
              size={24}
              color={colors.black}
              style={styles.dropIcon}
            />
          )}
        </Stack>
      </TouchableOpacity>
    </Stack>
  );
};
