import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {Spacing} from 'common/theme/spacing';
import {TextView} from 'components';
import {Persona} from 'components/Persona';
import {Stack, StackItem} from 'components/Stack';
import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  ViewStyle,
} from 'react-native';

interface MailItemProps {
  item: MailInboxRowInterface;
  index: number;
  onPress?: () => void;
}

export interface MailInboxRowInterface {
  name: string;
  message: string;
  time: string;
  seen?: boolean;
  status?: string;
}

export const MailItem: React.FC<MailItemProps> = ({item, index, onPress}) => {
  const {width} = useWindowDimensions();

  const seenViewStyle: ViewStyle | undefined = item.seen
    ? {backgroundColor: colors.inbox}
    : undefined;

  return (
    <TouchableOpacity onPress={onPress}>
      <StackItem
        childrenGap={10}
        horizontal
        key={index}
        style={[styles().container, seenViewStyle]}>
        <Persona name={item.name} />
        <StackItem style={{width: width * 0.62}}>
          <TextView weight="medium" truncate>
            {item.name}
          </TextView>
          <TextView
            truncate
            style={{width: item.status ? width * 0.62 : width * 0.75}}>
            {item.message}
          </TextView>
        </StackItem>
        <Stack>
          <TextView variant={FontSizes.xSmall}>{item.time}</TextView>
        </Stack>
      </StackItem>
    </TouchableOpacity>
  );
};

const styles = () => {
  const mergeStyles = StyleSheet.create({
    container: {
      paddingHorizontal: Spacing.basic,
      paddingVertical: 13,
    },
  });
  return mergeStyles;
};
