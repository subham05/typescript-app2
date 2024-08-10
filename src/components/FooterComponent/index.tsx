import {colors} from 'common/theme/colors';
import React from 'react';
import {ActivityIndicator, View, ViewStyle} from 'react-native';

interface FooterComponentProps {
  size?: number;
  horizontal?: boolean;
  isLoading?: boolean;
}
export const FooterComponent: React.FC<FooterComponentProps> = ({
  size,
  horizontal,
  isLoading = false,
}) => {
  const verticalStyle: ViewStyle = {height: size ? size : 100};
  const horizontalStyle: ViewStyle = {width: size ? size : 100};
  return (
    <View style={horizontal ? horizontalStyle : verticalStyle}>
      <ActivityIndicator
        animating={isLoading}
        size="large"
        color={colors.primary}
      />
    </View>
  );
};
