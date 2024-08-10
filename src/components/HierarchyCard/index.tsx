import {TextView} from 'components';
import {Persona} from 'components/Persona';
import {Stack} from 'components/Stack';
import React, {FC} from 'react';
import {Image, View} from 'react-native';
import {HierarchyCardModal} from 'screens/CompanyStructure/types';
import {tx, ty} from 'common/StructureUtils/CoordinatePoints';
import {styles} from './index.styles';

interface HierarchyCardProps {
  node: HierarchyCardModal;
  isCardImg: boolean;
  horizontal?: boolean;
}

const HierarchyCard: FC<HierarchyCardProps> = ({
  node,
  isCardImg,
  horizontal = false,
}) => {
  return (
    //-50 to set it in centre as card width is 100
    <View
      style={[
        styles.container,
        {
          left: tx(node) - 70,
          top: ty(node) - 35,
          transform: horizontal ? [{rotate: '90deg'}] : undefined,
        },
      ]}>
      {isCardImg && node?.imgUrl?.length ? (
        <Image source={{uri: node.imgUrl}} style={styles.displayPic} />
      ) : (
        typeof node?.name === 'string' &&
        isCardImg && <Persona name={node?.name} />
      )}
      <View style={styles.card}>
        <Stack horizontal style={styles.flex}>
          <View style={[styles.strip, {backgroundColor: node.color}]} />
          <Stack spacing={3} style={styles.innerCard}>
            <TextView
              style={isCardImg ? styles.titleWithImg : styles.title}
              numberOfLines={2}>
              {node.name}
            </TextView>
            <TextView style={styles.designation} numberOfLines={1}>
              {node.designation}
            </TextView>
          </Stack>
        </Stack>
      </View>
    </View>
  );
};

export default HierarchyCard;
