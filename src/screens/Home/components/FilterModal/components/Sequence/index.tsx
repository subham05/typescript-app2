import {StyleSheet, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Stack} from 'components/Stack';
import {TextView} from 'components';
import {FontSizes} from 'common/theme/font';
import {colors} from 'common/theme/colors';

export interface SequenceDataModal {
  id: number;
  value: string;
  index?: number;
  order?: string[];
}

interface SequenceDataProps {
  data: SequenceDataModal[];
  order: number;
  setSequenceObject: (orderObject: SequenceDataModal[]) => void;
}

const SequenceHomeScreen: React.FC<SequenceDataProps> = ({
  data,
  order,
  setSequenceObject,
}) => {
  const [objectOrder, setObjectOrder] = useState<SequenceDataModal[]>();

  useEffect(() => {
    if (order) {
      const digitArray = [...order.toString()]?.map(Number);

      const newObjectOrder = digitArray?.map(id => {
        return data?.find(obj => obj?.id === id);
      }) as SequenceDataModal[];
      setSequenceObject?.(newObjectOrder!);
      setObjectOrder(newObjectOrder);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

  const RenderItem = (item: SequenceDataModal) => {
    return (
      <Stack spacing={16} spaceBelow={16}>
        <Stack horizontal>
          <TextView
            weight={'regular'}
            style={{color: colors.primary}}
            variant={FontSizes.regular}>
            {item?.index}.
          </TextView>
          <TextView
            weight={'regular'}
            variant={FontSizes.regular}
            style={styles.sequenceStyle}>
            {item?.value}
          </TextView>
        </Stack>
      </Stack>
    );
  };

  return (
    <Stack spaceBelow={16}>
      <FlatList
        data={objectOrder}
        renderItem={({item, index}) => (
          <RenderItem {...item} index={index + 1} />
        )}
      />
    </Stack>
  );
};

export default SequenceHomeScreen;

const styles = StyleSheet.create({
  sequenceStyle: {
    marginLeft: 8,
    color: colors.primary,
  },
});
