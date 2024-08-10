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
// import Modal from 'react-native-modal';
import {Styles} from 'screens/ChattingScreenFooter/index.styles';

interface RenderBubbleRightProps {
  currentMessage: any;
  onLongPress: (val: boolean) => void;
}
export const RenderBubbleRight: React.FC<RenderBubbleRightProps> = ({
  currentMessage,
  onLongPress,
}) => {
  const {t} = useTranslation();

  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const styles = Styles();
  return (
    <>
      <View style={isSelected ? styles.isSelectedSenderMessage : undefined}>
        <Stack style={styles.bubbleRight}>
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
            <StackItem
              horizontal
              childrenGap={10}
              style={styles.senderMessageView}>
              <>
                <Stack
                  style={[
                    styles.textViewRight,
                    currentMessage!.image
                      ? styles.imageMargin
                      : currentMessage!.text.substring(
                          currentMessage!.text.lastIndexOf('.') + 1,
                        ) !== 'docx'
                      ? styles.textMargin
                      : undefined,
                  ]}
                  horizontal>
                  {currentMessage!.image ? (
                    <Stack>
                      <Image
                        source={{uri: currentMessage!.image}}
                        style={styles.senderImage}
                      />
                      <Stack
                        horizontal
                        verticalAlign="flex-end"
                        style={styles.imageSendTime}>
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
                    </Stack>
                  ) : currentMessage!.text.substring(
                      currentMessage!.text.lastIndexOf('.') + 1,
                    ) === 'docx' ? (
                    <Stack style={styles.docxView}>
                      <Stack style={styles.docxFileName}>
                        <StackItem
                          horizontal
                          childrenGap={2}
                          verticalAlign="center">
                          <Icon
                            name="text_snippet"
                            size={24}
                            color={colors.blue_001}
                          />
                          <TextView
                            weight="regular"
                            variant={FontSizes.small}
                            style={styles.wordFileName}
                            numberOfLines={1}>
                            Word document file name name
                          </TextView>
                        </StackItem>
                      </Stack>
                      <Stack
                        horizontal
                        horizontalAlign="space-between"
                        verticalAlign="center"
                        style={styles.docxFooter}>
                        <StackItem
                          horizontal
                          childrenGap={5}
                          verticalAlign="center">
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
                    // ) : currentMessage!.text.substring(
                    //     currentMessage!.text.lastIndexOf('.') + 1,
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
              </>
              <Stack
                style={
                  !currentMessage!.image &&
                  currentMessage!.text.substring(
                    currentMessage!.text.lastIndexOf('.') + 1,
                  ) !== 'docx'
                    ? styles.personaMargin
                    : undefined
                }>
                <Persona
                  name={currentMessage!.user.name}
                  image={currentMessage!.user.avatar}
                  size={32}
                />
              </Stack>
            </StackItem>
          </TouchableWithoutFeedback>
        </Stack>
      </View>
      {isClicked && (
        // <Modal
        //   isVisible={isSelected}
        //   onBackdropPress={() => {
        //     setIsSelected(false);
        //     onLongPress(false);
        //   }}>
        <View>
          <View style={styles.centeredView}>
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
        // </Modal>
      )}
    </>
  );
};
