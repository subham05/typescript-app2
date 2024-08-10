import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {StackItem} from 'components/Stack';
import {TextView} from 'components/TextView';
import React from 'react';
import {ActivityIndicator, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import * as Progress from 'react-native-progress';
import {Stack} from 'stack-container';

interface LoaderModel {
  message?: string;
  isFooterLoader?: boolean;
  color?: string;
}
const Loader: React.FC<LoaderModel> = ({
  message = 'Loading...',
  isFooterLoader,
  color,
}) => {
  return isFooterLoader ? (
    <Stack style={styles.containerStyleFooter}>
      <ActivityIndicator
        size={'large'}
        color={color ? color : colors.primary}
      />
    </Stack>
  ) : (
    <Modal
      isVisible={true}
      backdropOpacity={0.7}
      backdropColor={colors.grey_002}
      style={styles.mainStack}>
      <StackItem style={styles.loader} childrenGap={5}>
        <TextView
          weight="semibold"
          variant={FontSizes.medium}
          style={{color: colors.primary}}>
          {message}
        </TextView>
        <Progress.Bar
          indeterminate
          indeterminateAnimationDuration={2000}
          width={200}
          height={3}
          color={colors.primary_002}
          unfilledColor={colors.grey_002}
          borderWidth={0}
        />
      </StackItem>
    </Modal>
  );
};

export default Loader;

const styles = StyleSheet.create({
  mainStack: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingHorizontal: 30,
    paddingVertical: 30,
    justifyContent: 'center',
    paddingBottom: 20,
  },
  containerStyleFooter: {
    height: 35,
    justifyContent: 'center',
  },
});
