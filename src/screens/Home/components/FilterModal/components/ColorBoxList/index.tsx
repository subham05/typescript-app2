import React from 'react';
import {FlatList} from 'react-native';
import {Stack} from 'stack-container';
import {ColorBox, ColorBoxModal} from '../ColorBox';
import {Styles} from '../../index.styles';
import {usedColor} from '../ColorStatus';

interface ColorBoxListProps {
  data: ColorBoxModal[];
  selectColor?: (selectedColor: string, index: number) => void;
  useColor?: usedColor;
}

export const ColorBoxList: React.FC<ColorBoxListProps> = ({
  data,
  selectColor,
}) => {
  const styles = Styles();
  return (
    <FlatList
      data={data}
      horizontal
      renderItem={({item, index}) => {
        return (
          <Stack spaceBelow={26} style={styles.paddingColor}>
            <ColorBox
              data={item?.color}
              selectColor={(eleData, eleIndex) => {
                selectColor?.(eleData, eleIndex);
              }}
              index={index}
            />
          </Stack>
        );
      }}
      keyExtractor={(_, index) => index.toString()}
    />
  );
};
