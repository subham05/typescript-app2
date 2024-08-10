import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Icon} from 'components/Icon';
import {Stack} from 'components/Stack';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity} from 'react-native';
import {Styles} from '../index.styles';

interface SelectAllCompanyProps {
  selectedAll: boolean;
  onPress: (value: boolean) => void;
}
export const SelectAllCompany: React.FC<SelectAllCompanyProps> = ({
  selectedAll,
  onPress,
}) => {
  const {t} = useTranslation();

  // const [isAllSelected, setIsAllSelected] = useState<boolean>(selectedAll);
  const styles = Styles();

  return (
    <TouchableOpacity
      onPress={() => {
        // setIsAllSelected(!isAllSelected);
        onPress(!selectedAll);
      }}>
      <Stack
        spaceBelow={16}
        horizontal
        style={styles.selectAll}
        verticalAlign="center">
        <TextView
          weight="medium"
          variant={FontSizes.regular}
          style={styles.selectAllText}>
          {t('selectCompany:selectAll')}
        </TextView>
        {selectedAll ? (
          <Icon name="check_box" size={18} color={colors.primary_002} />
        ) : (
          <Icon name="check_box_blank" size={18} color={colors.primary_002} />
        )}
      </Stack>
    </TouchableOpacity>
  );
};
