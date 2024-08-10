import {FontSizes} from 'common/theme/font';
import {globalScreenHeight} from 'common/utils/ScreenDimensions';
import {TextView} from 'components/TextView';
import React, {FC} from 'react';
import {StyleSheet, ViewStyle} from 'react-native';
import {Stack} from 'stack-container';

interface EmptyComponentProps {
  message?: string;
  fontSizeSmall?: boolean;
  containerStyle?: ViewStyle;
  isVisible?: boolean;
}

const EmptyComponent: FC<EmptyComponentProps> = ({
  message = 'No data found',
  fontSizeSmall = false,
  containerStyle,
  isVisible = true,
}) => {
  if (isVisible) {
    return (
      <Stack style={containerStyle ? containerStyle : styles.container}>
        <TextView
          variant={!fontSizeSmall ? FontSizes.large : FontSizes.regular}
          weight={'semibold'}>
          {message}
        </TextView>
      </Stack>
    );
  } else {
    return null;
  }
};

export default EmptyComponent;
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: globalScreenHeight / 1.55,
    justifyContent: 'center',
  },
});
