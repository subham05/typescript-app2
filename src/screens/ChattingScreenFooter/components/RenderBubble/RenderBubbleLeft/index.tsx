import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Divider} from 'components/Divider';
import {Icon} from 'components/Icon';
import {Persona} from 'components/Persona';
import {Stack, StackItem} from 'components/Stack';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import {Styles} from 'screens/ChattingScreenFooter/index.styles';

interface RenderBubbleLeftProps {
  currentMessage: any;
  onLongPress: (val: boolean) => void;
  type: string | undefined;
  coordinates: any;
}
export const RenderBubbleLeft: React.FC<RenderBubbleLeftProps> = ({
  currentMessage,
  onLongPress,
  type,
}) => {
  const {t} = useTranslation();

  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [isClicked, setIsClicked] = useState<boolean>(false);

  const styles = Styles();
  return (
    <>
      <Stack style={styles.bubble}>
        <TouchableWithoutFeedback
          onLongPress={() => {
            setIsSelected(prevState => !prevState);
            onLongPress(!isSelected);
            if (isSelected) {
              setIsClicked(false);
            }
          }}
          onPress={() => {
            if (isSelected) {
              setIsClicked(prevState => !prevState);
            }
          }}>
          <View
            style={isSelected ? styles.selectedReceiverMessageView : undefined}>
            <StackItem
              horizontal
              childrenGap={10}
              style={styles.receiverMessageView}>
              <Persona
                name={currentMessage!.user.name}
                image={currentMessage!.user.avatar}
                size={32}
              />
              <>
                {type !== 'People' ? (
                  <Stack horizontal style={styles.marginReceiverMessage}>
                    <TextView
                      weight="regular"
                      variant={FontSizes.xSmall}
                      style={styles.leftNameTime}>
                      {currentMessage!.user.name},{' '}
                    </TextView>
                    <TextView
                      weight="regular"
                      variant={FontSizes.xSmall}
                      style={styles.leftNameTime}>
                      {/* {moment(props.currentMessage.createdAt).format('hh:mm A')} */}
                      12:15 PM
                    </TextView>
                  </Stack>
                ) : null}
                <Stack style={styles.textViewLeft}>
                  {currentMessage!.image ? (
                    <Stack>
                      <Image
                        source={{uri: currentMessage!.image}}
                        style={styles.receiverImage}
                      />
                      <Stack
                        horizontal
                        verticalAlign="flex-end"
                        style={styles.imageSendTime}>
                        <TextView
                          weight="regular"
                          variant={FontSizes.xSmall}
                          style={styles.leftNameTime}>
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
                    </Stack>
                  ) : (
                    // ) : currentMessage!.text.substring(
                    //     currentMessage!.text.lastIndexOf('.') + 1,
                    //   ) === 'pdf' ? (
                    //   <TextView
                    //     weight="regular"
                    //     variant={FontSizes.small}
                    //     style={styles.text}>
                    //     Pdf
                    //   </TextView>
                    // ) : currentMessage!.text.substring(
                    //     currentMessage!.text.lastIndexOf('.') + 1,
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
                      {currentMessage!.text}
                    </TextView>
                  )}
                  {!currentMessage!.image &&
                    currentMessage!.text.substring(
                      currentMessage!.text.lastIndexOf('.') + 1,
                    ) !== 'docx' && (
                      <Stack
                        horizontal
                        verticalAlign="flex-end"
                        style={styles.timeTick}>
                        <TextView
                          weight="regular"
                          variant={FontSizes.xSmall}
                          style={styles.leftNameTime}>
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
              </>
            </StackItem>
          </View>
        </TouchableWithoutFeedback>
      </Stack>
      {isClicked && (
        <Modal
          isVisible={isSelected}
          onBackdropPress={() => {
            setIsClicked(false);
            // onLongPress(false);
          }}>
          <View
          // style={styles.modal}
          >
            <View style={styles.receiverCenteredView}>
              <StackItem style={styles.modalView}>
                <TouchableOpacity onPress={() => {}}>
                  <TextView
                    weight="regular"
                    variant={FontSizes.regular}
                    style={styles.shareVia}>
                    {t('messagePage:addToTask')}
                  </TextView>
                </TouchableOpacity>
                <Stack spacing={16}>
                  <Divider size={2} />
                </Stack>
                <TouchableOpacity onPress={() => {}}>
                  <TextView
                    weight="regular"
                    variant={FontSizes.regular}
                    style={styles.shareVia}>
                    {t('messagePage:addToSubTask')}
                  </TextView>
                </TouchableOpacity>
              </StackItem>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};
