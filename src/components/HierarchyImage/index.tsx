import React, {FC} from 'react';
import {Image, View} from 'react-native';
import {HierarchyCardModal} from 'screens/CompanyStructure/types';
import {tx, ty} from 'common/StructureUtils/CoordinatePoints';
import {styles} from './index.styles';

interface HierarchyImageProps {
  node: HierarchyCardModal;
}

const HierarchyImage: FC<HierarchyImageProps> = ({node}) => {
  return (
    <View style={[styles.container, {left: tx(node) - 50, top: ty(node) - 50}]}>
      <Image
        source={{
          uri:
            node?.imgUrl &&
            node?.imgUrl?.length &&
            node?.imgUrl.includes('https')
              ? node?.imgUrl
              : ' https://formanagement.s3.amazonaws.com/formanagement%2FaddCompany2023-05-29T17%3A41%3A53%2B05%3A30undefined',
        }}
        style={styles.image}
      />
    </View>
  );
};

export default HierarchyImage;
