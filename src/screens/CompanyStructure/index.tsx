import {Container} from 'components';
import * as d3 from 'd3';
import React, {useCallback, useEffect, useState} from 'react';
import {Dimensions, View} from 'react-native';
import PinchZoom from '../../common/StructureUtils/PinchZoom';
import {G, Svg} from 'react-native-svg';
import {styles} from './index.styles';
import {HierarchyCardModal, SiblingsDataModal} from './types';
import {NodeCurves} from '../../common/StructureUtils/ConstructCurves';
import {DeployNodes} from '../../common/StructureUtils/DeployNodes';
import {flatten} from '../../common/StructureUtils/FlatNodes';
import {SiblingCurves} from '../../common/StructureUtils/SiblingCurves';
import {useCompanyStructureMutation} from 'request/CompanyStructure';
import Loader from 'components/Loader';
import {useFocusEffect} from '@react-navigation/native';

const CompanyStructure = () => {
  const [lines, setLines] = useState<any>();
  const [displayNodes, setDisplayNodes] = useState<any>();
  const [siblingLines, setSiblingLines] = useState<any>();
  const treeHeight = Dimensions.get('screen').height * 1.2;
  const [trigger, {data, isSuccess, isLoading}] = useCompanyStructureMutation({
    fixedCacheKey: 'CompanyStructure',
  });

  useFocusEffect(
    useCallback(() => {
      trigger();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  useEffect(() => {
    let localData: any = {};
    let siblingsDataArray = [];
    if (isSuccess) {
      // Create deep clone of the data
      if (data?.data?.hierarchyData) {
        localData = JSON.parse(JSON.stringify(data?.data?.hierarchyData));
        siblingsDataArray = data?.data?.sibilingData;

        drawTree(localData, siblingsDataArray);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  const drawTree = (
    root: HierarchyCardModal,
    siblings: SiblingsDataModal[],
  ) => {
    const allNodes = flatten(root);
    // let ownerCount = 0;
    // let gmCount = 0;
    // allNodes.forEach(item => {
    //   if (item?.designation === 'OWNER') {
    //     ownerCount++;
    //   }
    //   if (item?.designation === 'GM') {
    //     gmCount++;
    //   }
    // });
    // let maxVal = ownerCount > gmCount ? ownerCount : gmCount;
    // setTreeWidthState(maxVal * 300);
    const tree = d3?.layout?.tree()?.size([1000, treeHeight]);
    const nodes: HierarchyCardModal[] = tree.nodes(root);
    // let arrayData = nodes.map(item => item?.depth);

    // let maxDepth = Math.max(...arrayData);
    // setTreeHeightState(maxDepth * 300);
    const links = tree.links(nodes);

    const curves = NodeCurves(links);

    setLines(curves);
    const siblingPath = SiblingCurves(siblings, allNodes);
    setSiblingLines(siblingPath);

    const rectNodes = DeployNodes(nodes);

    setDisplayNodes(rectNodes);
  };

  return (
    <Container noSpacing>
      {isSuccess && (
        <View style={styles.lowerContainer}>
          <PinchZoom>
            <Svg width={1000} height={1000}>
              <G>
                {siblingLines}
                {displayNodes}
                {lines}
              </G>
            </Svg>
          </PinchZoom>
        </View>
      )}
      {isLoading && <Loader />}
    </Container>
  );
};

export default CompanyStructure;
