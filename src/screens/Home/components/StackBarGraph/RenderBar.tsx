import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import React, {FC, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {GraphDaum} from 'request/Dashboard';
import {respWidth} from 'screens/Calendar/utils/responsive';

interface RenderBarProps {
  item: GraphDaum;
  index: number;
}

const RenderBar: FC<RenderBarProps> = ({item, index}) => {
  const [showLegend, setShowLegend] = useState<boolean>(false);
  return (
    <TouchableOpacity
      style={styles.mainBar}
      onPress={() => {
        setShowLegend(!showLegend);
      }}>
      <View
        style={[
          styles.stackedBar,
          {height: `${item?.y2}%`},
          {backgroundColor: item?.y2Color},
        ]}>
        {showLegend && (
          <Text
            style={[styles.label, styles.topTooltip]}>{`${item?.y2}%`}</Text>
        )}
      </View>
      <View
        style={{
          height: `${item.y}%`,
          backgroundColor: item.color,
        }}
        key={index}>
        {showLegend && (
          <Text
            style={[styles.label, styles.bottomTooltip]}>{`${item.y}%`}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mainBar: {
    height: '100%',
    justifyContent: 'flex-end',
    zIndex: 1,
  },
  stackedBar: {
    width: 18,
    backgroundColor: colors.grey_002,
  },
  label: {
    position: 'absolute',
    zIndex: 2,
    right: -18,
    width: respWidth(51),
    fontSize: respWidth(FontSizes.xSmall),
    textAlign: 'center',
    backgroundColor: colors.black,
    color: colors.white,
    borderRadius: 3,
    paddingVertical: 2,
  },
  bottomTooltip: {bottom: 10},
  topTooltip: {top: 10},
});

export default RenderBar;
