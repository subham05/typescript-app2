import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import ProgressBar from 'react-native-progress/Bar';

interface ProgressProps {
  width?: number | string | null;
  color?: string;
  progress: number | string;
}
export const Progress: React.FC<ProgressProps> = ({
  width = null,
  color = colors.blue_002,
  progress = 0,
}) => {
  const progressValue = +progress / 100;

  return (
    <View style={styles().container}>
      <View style={styles().progressWrapper}>
        <ProgressBar
          progress={progressValue}
          width={width}
          borderWidth={0}
          color={color}
          unfilledColor={colors.grey_002}
        />
      </View>
      {progress ? (
        <TextView weight="regular" variant={FontSizes.xxSmall}>
          {progress.toString()}%
        </TextView>
      ) : null}
    </View>
  );
};

const styles = () => {
  const mergeStyles = StyleSheet.create({
    container: {
      width: '100%',
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    progressWrapper: {
      width: '100%',
      flex: 1,
      paddingRight: 10,
    },
  });
  return mergeStyles;
};
