import _ from 'lodash';
import React from 'react';
import {View} from 'react-native';
import HierarchyCard from '../../components/HierarchyCard';
import HierarchyImage from '../../components/HierarchyImage';
import {
  CardTypes,
  HierarchyCardModal,
} from '../../screens/CompanyStructure/types';

export function DeployNodes(
  nodes: HierarchyCardModal[],
  horizontal: boolean = false,
) {
  const rectNodes = _.map(nodes, function (n, index) {
    if (n.hidden === false) {
      return (
        <View key={index}>
          {n.type === CardTypes.image ? (
            <HierarchyImage node={n} />
          ) : (
            <HierarchyCard
              node={n}
              isCardImg={n.type === CardTypes.cardImg ? true : false}
              horizontal={horizontal}
            />
          )}
        </View>
      );
    }
  });
  return rectNodes;
}
