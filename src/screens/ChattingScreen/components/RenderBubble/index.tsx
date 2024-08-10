import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Icon} from 'components/Icon';
import {Stack, StackItem} from 'components/Stack';
import React from 'react';
import {Image, View} from 'react-native';
import {Bubble} from 'react-native-gifted-chat';
import {Styles} from 'screens/ChattingScreen/index.styles';

export const renderBubble = (prop: Bubble['props']) => {
  const styles = Styles();
  return (
    <>
      {prop.position === 'left' ? (
        <Stack style={styles.bubble}>
          <Stack horizontal>
            <TextView
              weight="regular"
              variant={FontSizes.xSmall}
              style={styles.nameTime}>
              {prop.currentMessage!.user.name},{' '}
            </TextView>
            <TextView
              weight="regular"
              variant={FontSizes.xSmall}
              style={styles.nameTime}>
              {/* {moment(props.currentMessage.createdAt).format('hh:mm A')} */}
              12:15 PM
            </TextView>
          </Stack>
          <Stack style={styles.textViewLeft} center>
            {prop.currentMessage!.image ? (
              <Image
                source={{uri: prop.currentMessage!.image}}
                style={styles.receiverImage}
              />
            ) : (
              // ) : prop.currentMessage!.text.substring(
              //     prop.currentMessage!.text.lastIndexOf('.') + 1,
              //   ) === 'pdf' ? (
              //   <TextView
              //     weight="regular"
              //     variant={FontSizes.small}
              //     style={styles.text}>
              //     Pdf
              //   </TextView>
              // ) : prop.currentMessage!.text.substring(
              //     prop.currentMessage!.text.lastIndexOf('.') + 1,
              //   ) === 'docx' ? (
              //   <Stack style={styles.docxView}>
              //     <Stack style={styles.docxFileName}>
              //       <StackItem
              //         horizontal
              //         childrenGap={5}
              //         verticalAlign="center">
              //         <Icon
              //           name="text_snippet"
              //           size={24}
              //           color={colors.blue_001}
              //         />
              //         <TextView
              //           weight="regular"
              //           variant={FontSizes.small}
              //           truncate>
              //           Word document file name name
              //         </TextView>
              //       </StackItem>
              //     </Stack>
              //     <Stack
              //       horizontal
              //       horizontalAlign="space-between"
              //       verticalAlign="center">
              //       <StackItem
              //         horizontal
              //         childrenGap={5}
              //         verticalAlign="center">
              //         <TextView
              //           weight="regular"
              //           variant={FontSizes.xxSmall}
              //           style={styles.receiverFileSize}>
              //           409 KB
              //         </TextView>
              //         <View style={styles.dot} />
              //         <TextView
              //           weight="regular"
              //           variant={FontSizes.xxSmall}
              //           style={styles.receiverFileSize}>
              //           DOCX
              //         </TextView>
              //       </StackItem>
              //       <StackItem horizontal childrenGap={0}>
              //         <TextView
              //           weight="regular"
              //           variant={FontSizes.xxSmall}
              //           style={styles.receiverFileSize}>
              //           12:10 AM
              //         </TextView>
              //         <Icon
              //           name="sent_tick"
              //           size={16}
              //           color={colors.primary}
              //           style={styles.tickIcon}
              //         />
              //       </StackItem>
              //     </Stack>
              //   </Stack>
              <TextView
                weight="regular"
                variant={FontSizes.small}
                style={styles.text}>
                {prop.currentMessage!.text}
              </TextView>
            )}
          </Stack>
        </Stack>
      ) : (
        <Stack style={styles.bubble}>
          <Stack style={styles.textViewRight} horizontal>
            {prop.currentMessage!.image ? (
              <Image
                source={{uri: prop.currentMessage!.image}}
                style={styles.senderImage}
              />
            ) : prop.currentMessage!.text.substring(
                prop.currentMessage!.text.lastIndexOf('.') + 1,
              ) === 'docx' ? (
              <Stack style={styles.docxView}>
                <Stack style={styles.docxFileName}>
                  <StackItem horizontal childrenGap={2} verticalAlign="center">
                    <Icon
                      name="text_snippet"
                      size={24}
                      color={colors.blue_001}
                    />
                    <TextView
                      weight="regular"
                      variant={FontSizes.small}
                      truncate>
                      Word document file name name
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
                      409 KB
                    </TextView>
                    <View style={styles.dot} />
                    <TextView
                      weight="regular"
                      variant={FontSizes.xxSmall}
                      style={styles.receiverFileSize}>
                      DOCX
                    </TextView>
                  </StackItem>
                  <StackItem horizontal childrenGap={0}>
                    <TextView
                      weight="regular"
                      variant={FontSizes.xxSmall}
                      style={styles.receiverFileSize}>
                      12:10 AM
                    </TextView>
                    <Icon
                      name="sent_tick"
                      size={16}
                      color={colors.primary}
                      style={styles.tickIcon}
                    />
                  </StackItem>
                </Stack>
              </Stack>
            ) : (
              // ) : prop.currentMessage!.text.substring(
              //     prop.currentMessage!.text.lastIndexOf('.') + 1,
              //   ) !== 'pdf' ? (
              //   <TextView
              //     weight="regular"
              //     variant={FontSizes.small}
              //     style={styles.text}>
              //     pdf
              //   </TextView>
              <TextView
                weight="regular"
                variant={FontSizes.small}
                style={styles.text}>
                {prop.currentMessage!.text}
              </TextView>
            )}
            {prop.currentMessage!.text.substring(
              prop.currentMessage!.text.lastIndexOf('.') + 1,
            ) !== 'docx' && (
              <Stack
                horizontal
                verticalAlign="flex-end"
                style={styles.timeTick}>
                <TextView
                  weight="regular"
                  variant={FontSizes.xSmall}
                  style={styles.nameTime}>
                  {/* {moment(props.currentMessage.createdAt).format('hh:mm A')} */}
                  12:15 PM
                </TextView>
                <Icon
                  name="sent_tick"
                  size={16}
                  color={colors.primary}
                  style={styles.tickIcon}
                />
              </Stack>
            )}
          </Stack>
          {/* <Stack horizontal style={styles.timeTickView}>
              <TextView
                weight="regular"
                variant={FontSizes.xSmall}
                style={styles.nameTime}>
                {moment(props.currentMessage.createdAt).format('hh:mm A')}
                12:15 PM
              </TextView>
              <Icon
                name="sent_tick"
                size={20}
                color={colors.primary}
                style={styles.tickIcon}
              />
            </Stack> */}
        </Stack>
      )}
    </>
  );
};
