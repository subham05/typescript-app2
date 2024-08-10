import {imageSources} from 'assets/images';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {DateTimeFormats} from 'common/utils/DateTimeFormats';
import {previewXlsx} from 'common/utils/XlsDownload';
import {TextView} from 'components';
import {Icon} from 'components/Icon';
import {Stack, StackItem} from 'components/Stack';
import moment from 'moment';
import React from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {messageModal} from 'request/Message/constants';
import {Styles} from 'screens/ChattingScreenFooter/index.styles';

interface DocxMessageViewProps {
  currentMessage: messageModal;
  onLongPress?: () => void;
}
export const DocxMessageView: React.FC<DocxMessageViewProps> = ({
  currentMessage,
  onLongPress,
}) => {
  const styles = Styles();
  let isXls =
    currentMessage.attachmentUrlDetails?.url
      ?.split('.')
      .pop()
      ?.toLowerCase() === 'xls' ||
    currentMessage.attachmentUrlDetails?.url
      ?.split('.')
      .pop()
      ?.toLowerCase() === 'xlsx';
  return (
    <Stack style={styles.docxView}>
      <TouchableOpacity
        onPress={() => {
          previewXlsx(currentMessage.attachmentUrlDetails?.url);
        }}
        onLongPress={onLongPress}>
        <Stack style={styles.docxFileName}>
          <StackItem horizontal childrenGap={2} verticalAlign="center">
            {isXls ? (
              <Image source={imageSources.excelFile} style={styles.excelIcon} />
            ) : (
              <Icon name="text_snippet" size={24} color={colors.blue_001} />
            )}

            <TextView
              weight="regular"
              variant={FontSizes.small}
              style={styles.wordFileName}
              numberOfLines={1}>
              {/* {decodeURIComponent(currentMessage?.attachmentUrlDetails?).split('/').pop()} */}
              {currentMessage?.attachmentUrlDetails?.messageFileExt!
                ? `file.${currentMessage?.attachmentUrlDetails
                    ?.messageFileExt!}`
                : `file.${decodeURIComponent(
                    currentMessage?.attachmentUrlDetails?.messageFileName!,
                  )
                    .split('.')
                    .pop()}`}
            </TextView>
          </StackItem>
        </Stack>
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
              {currentMessage.attachmentUrlDetails?.messageFileExt}
            </TextView>
          </StackItem>
          <StackItem horizontal childrenGap={0}>
            <TextView
              weight="regular"
              variant={FontSizes.xxSmall}
              style={styles.receiverFileSize}>
              {moment(currentMessage?.updatedAt).format(
                DateTimeFormats.TimeAMPM,
              )}
            </TextView>
            <Icon
              name="sent_tick"
              size={16}
              color={colors.primary_003}
              style={styles.tickIcon}
            />
          </StackItem>
        </Stack>
      </TouchableOpacity>
    </Stack>
  );
};
