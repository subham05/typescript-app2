import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {DateTimeFormats} from 'common/utils/DateTimeFormats';
import {TextView} from 'components';
import {Icon} from 'components/Icon';
import {Stack} from 'components/Stack';
import moment from 'moment';
import React, {useState} from 'react';
import {Image, TouchableOpacity} from 'react-native';
import {messageModal} from 'request/Message/constants';
import {Styles} from 'screens/ChattingScreenFooter/index.styles';
import ImageView from 'react-native-image-viewing';

interface ImageMessageViewProps {
  currentMessage: messageModal;
  type: string | undefined;
  onLongPress?: () => void;
}
export const ImageMessageView: React.FC<ImageMessageViewProps> = ({
  currentMessage,
  type,
  onLongPress,
}) => {
  const receiverUser = !currentMessage.isOwn;
  const senderUser = currentMessage.isOwn;
  const styles = Styles();
  const [visible, setIsVisible] = useState<boolean>(false);

  let imageData = [];
  imageData?.push({uri: currentMessage?.attachmentUrlDetails?.url});

  return (
    <Stack>
      <TouchableOpacity
        onPress={() => {
          setIsVisible(true);
        }}
        onLongPress={onLongPress}>
        <Image
          source={{
            uri:
              currentMessage?.attachmentUrlDetails?.url ||
              currentMessage?.attachmentUrl,
          }}
          style={receiverUser ? styles.receiverImage : styles.senderImage}
        />
      </TouchableOpacity>

      <Stack horizontal verticalAlign="flex-end" style={styles.imageSendTime}>
        {type !== 'People' && !currentMessage?.message && (
          <TextView
            weight="regular"
            variant={FontSizes.xSmall}
            style={receiverUser ? styles.leftNameTime : styles.nameTime}>
            {moment(currentMessage?.updatedAt).format(DateTimeFormats.TimeAMPM)}
          </TextView>
        )}
        {senderUser && !currentMessage?.message && (
          <Icon
            name="sent_tick"
            size={16}
            color={colors.primary_003}
            style={styles.tickIcon}
          />
        )}
      </Stack>
      <ImageView
        keyExtractor={(_, indexKey) => indexKey.toString()}
        images={imageData}
        imageIndex={0}
        visible={visible}
        onRequestClose={() => setIsVisible(false)}
      />
    </Stack>
  );
};
