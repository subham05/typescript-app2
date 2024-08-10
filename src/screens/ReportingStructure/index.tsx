import {Container} from 'components';
import Header from 'components/Header';
import * as d3 from 'd3';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import PinchZoom from '../../common/StructureUtils/PinchZoom';
import {useSharedValue} from 'react-native-reanimated';
import {G, Svg} from 'react-native-svg';
import {styles} from './index.styles';
import {siblingsData, structureRootData} from './mockData';
import {HierarchyCardModal, SiblingsDataModal} from './types';
import {NodeCurves} from '../../common/StructureUtils/ConstructCurves';
import {DeployNodes} from '../../common/StructureUtils/DeployNodes';
import {flatten} from '../../common/StructureUtils/FlatNodes';
import {SiblingCurves} from '../../common/StructureUtils/SiblingCurves';

const ReportingStructure = () => {
  const [lines, setLines] = useState<any>();
  const [displayNodes, setDisplayNodes] = useState<any>();
  const [siblingLines, setSiblingLines] = useState<any>();

  const translateY = useSharedValue(0);

  const treeWidth = 1800;
  const treeHeight = 1500;

  useEffect(() => {
    drawTree(structureRootData, siblingsData);
  }, []);

  const drawTree = (
    root: HierarchyCardModal,
    siblings: SiblingsDataModal[],
  ) => {
    const allNodes = flatten(root);

    const tree = d3.layout.tree().size([treeWidth, treeHeight - 150]);
    const nodes = tree.nodes(root);
    const links = tree.links(nodes);

    const curves = NodeCurves(links);
    setLines(curves);
    const siblingPath = SiblingCurves(siblings, allNodes);
    setSiblingLines(siblingPath);
    const rectNodes = DeployNodes(nodes, true);
    setDisplayNodes(rectNodes);
  };

  return (
    <Container noSpacing>
      <Header
        navigationType="STACK"
        label={'Reporting structure'}
        translateY={translateY}
        isCloseNavigation
      />

      <View style={styles.lowerContainer}>
        <PinchZoom>
          <View style={{transform: [{rotate: '270deg'}]}}>
            <Svg width={treeWidth} height={treeHeight}>
              <G>
                {siblingLines}
                {displayNodes}
                {lines}
              </G>
            </Svg>
          </View>
        </PinchZoom>
      </View>
    </Container>
  );
};

export default ReportingStructure;
