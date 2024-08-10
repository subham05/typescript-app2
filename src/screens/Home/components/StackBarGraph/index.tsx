import {globalScreenWidth} from 'common/utils/ScreenDimensions';
import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import {TaskProgressData} from 'request/Dashboard';
import RenderBar from './RenderBar';

interface StackBarProps {
  data: TaskProgressData;
}

const StackBarGraph: FC<StackBarProps> = ({data}) => {
  return (
    <View style={styles.outerMainView}>
      <View style={styles.innerMainView}>
        {data[0].graphData.map((item, index) => {
          if (item.type !== 'Assigned') {
            return <RenderBar item={item} index={index} />;
          }
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerMainView: {
    height: 320,
    width: globalScreenWidth - 40,
    marginLeft: 17,
  },
  innerMainView: {
    marginVertical: 20,
    marginHorizontal: 20,
    height: 280,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
});

export default StackBarGraph;
