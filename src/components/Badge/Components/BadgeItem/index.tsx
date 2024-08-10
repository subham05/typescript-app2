import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components/TextView';
import React from 'react';
import {Icon} from 'components/Icon';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {UploadedFileModal} from 'screens/AddTask';

interface BadgeItemModal {
  item: UploadedFileModal;
  index: number;
  onRemove: (index: number) => void;
  onClick?: (item: UploadedFileModal) => void;
}
const BadgeItem: React.FC<BadgeItemModal> = ({
  item,
  index,
  onRemove,
  onClick,
}) => {
  return (
    <TouchableOpacity
      key={`${item.name}_uploadedFile`}
      style={styles.containerStyle}
      onPress={() => onClick?.(item)}>
      <TextView
        weight="regular"
        variant={FontSizes.regular}
        style={styles.textStyle}>
        {/* {item.name} */}
        {item.type?.includes('image')
          ? `image.${decodeURIComponent(item.name!).split('.').pop()}`
          : `file.${decodeURIComponent(item.name!).split('.').pop()}`}
      </TextView>
      <TouchableOpacity onPress={() => onRemove(index)}>
        <Icon name="close" size={18} color={colors.black} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default BadgeItem;

const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.grey_009,
    padding: 8,
    paddingRight: 8,
    borderRadius: 3,
    margin: 5,
  },
  textStyle: {color: colors.black, marginRight: 5},
});
