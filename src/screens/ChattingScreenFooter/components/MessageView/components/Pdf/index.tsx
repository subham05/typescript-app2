import {useNavigation} from '@react-navigation/native';
import {imageSources} from 'assets/images';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {DateTimeFormats} from 'common/utils/DateTimeFormats';
import {TextView} from 'components';
import {Icon} from 'components/Icon';
import {Stack, StackItem} from 'components/Stack';
import moment from 'moment';
import React from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {messageModal} from 'request/Message/constants';
import {Styles} from 'screens/ChattingScreenFooter/index.styles';

interface PdfMessageViewProps {
  currentMessage: messageModal;
  onLongPress?: () => void;
}
export const PdfMessageView: React.FC<PdfMessageViewProps> = ({
  currentMessage,
  onLongPress,
}) => {
  const styles = Styles();
  const navigation = useNavigation();
  return (
    <Stack>
      <TouchableOpacity
        style={styles.docxFileName}
        onPress={() => {
          navigation.navigate('ViewPDF', {
            data: currentMessage?.attachmentUrlDetails.url,
          });
        }}
        onLongPress={onLongPress}>
        <StackItem horizontal childrenGap={2} verticalAlign="center">
          <Image source={imageSources.pdfFile} style={styles.pdfIcon} />
          <TextView
            weight="regular"
            variant={FontSizes.small}
            style={styles.wordFileName}
            numberOfLines={1}>
            {`file.${currentMessage?.attachmentUrlDetails.messageFileExt}`}
          </TextView>
        </StackItem>
      </TouchableOpacity>
      <Stack
        horizontal
        horizontalAlign="space-between"
        verticalAlign="center"
        style={styles.docxFooter}>
        <StackItem horizontal childrenGap={5} verticalAlign="center">
          <TextView
            weight="regular"
            variant={FontSizes.xxSmall}
            style={styles.receiverFileSize}>
            {currentMessage.size}
          </TextView>
          <View style={styles.dot} />
          <TextView
            weight="regular"
            variant={FontSizes.xxSmall}
            style={styles.receiverFileSize}>
            PDF
          </TextView>
        </StackItem>
        <StackItem horizontal childrenGap={0}>
          <TextView
            weight="regular"
            variant={FontSizes.xxSmall}
            style={styles.receiverFileSize}>
            {moment(currentMessage?.updatedAt).format(DateTimeFormats.TimeAMPM)}
          </TextView>
          <Icon
            name="sent_tick"
            size={16}
            color={colors.primary_003}
            style={styles.tickIcon}
          />
        </StackItem>
      </Stack>
    </Stack>
  );
};
