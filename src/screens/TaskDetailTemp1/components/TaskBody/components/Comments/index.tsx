import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Divider} from 'components/Divider';
import {Icon} from 'components/Icon';
import {InputTextField} from 'components/InputView';
import {Persona} from 'components/Persona';
import {Stack, StackItem} from 'components/Stack';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import {Styles} from '../../index.styles';

interface CommentTaskBodyProps {
  data: any;
}
export const CommentTaskBody: React.FC<CommentTaskBodyProps> = ({data}) => {
  const {t} = useTranslation();

  const [comment, setComment] = useState<string>('');

  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  const styles = Styles();
  return (
    <Stack style={styles.commentStack}>
      <FlatList
        data={data}
        renderItem={({item, index}) => {
          return (
            <Stack spacing={16} spaceBelow={10}>
              <StackItem childrenGap={10} horizontal>
                <Persona name={item.name} size={32} />
                <Stack style={[styles.openBox, styles.paddingBox]}>
                  <Stack
                    horizontal
                    horizontalAlign="space-between"
                    style={styles.horizontalStack}>
                    <Stack horizontal style={styles.commentHead}>
                      <TextView weight="medium" variant={FontSizes.regular}>
                        {item.name} {' | '}
                      </TextView>
                      <TextView
                        weight="regular"
                        variant={FontSizes.small}
                        style={styles.position}>
                        Manager
                      </TextView>
                    </Stack>
                    <Stack style={styles.options}>
                      <Menu>
                        <MenuTrigger>
                          <Icon name="more" size={24} color={colors.black} />
                        </MenuTrigger>
                        <MenuOptions optionsContainerStyle={styles.filterWidth}>
                          <MenuOption
                            onSelect={() => {
                              setComment(item.comment);
                            }}>
                            <TextView
                              weight="medium"
                              variant={FontSizes.regular}
                              style={styles.menu}>
                              {t('edit')}
                            </TextView>
                          </MenuOption>
                          <Divider />
                          <MenuOption
                            onSelect={() => {
                              setDeleteModal(true);
                            }}>
                            <TextView
                              weight="medium"
                              variant={FontSizes.regular}
                              style={styles.menu}>
                              {t('delete')}
                            </TextView>
                          </MenuOption>
                        </MenuOptions>
                      </Menu>
                    </Stack>
                  </Stack>
                  <Stack horizontal>
                    <TextView
                      weight="regular"
                      variant={FontSizes.xSmall}
                      style={styles.dateTime}>
                      {item.date}
                      {'; '}
                    </TextView>
                    <TextView
                      weight="regular"
                      variant={FontSizes.xSmall}
                      style={styles.dateTime}>
                      {item.time}
                    </TextView>
                    {index === 2 && (
                      // <StackItem horizontal childrenGap={5}>
                      //   <Stack style={{top: 6, marginLeft: 10}}>
                      //     <Icon name="edit" color={colors.primary_003} />
                      //   </Stack>
                      <TextView
                        weight="regular"
                        variant={FontSizes.xSmall}
                        style={styles.dateTime}>
                        {';  '}
                        {t('taskDetails:edited')}
                      </TextView>
                      // </StackItem>
                    )}
                  </Stack>
                  <TextView
                    weight="regular"
                    variant={FontSizes.regular}
                    style={styles.dateTime}>
                    {item.comment}
                  </TextView>
                </Stack>
              </StackItem>
              {index === 2 && (
                <TouchableOpacity>
                  <StackItem
                    horizontal
                    childrenGap={5}
                    style={styles.commentAttachment}>
                    <Icon name="attachment" size={22} color={colors.primary} />
                    <TextView
                      weight="medium"
                      variant={FontSizes.regular}
                      style={styles.fileName}>
                      File.pdf
                    </TextView>
                  </StackItem>
                </TouchableOpacity>
              )}
            </Stack>
          );
        }}
        keyExtractor={(_, index) => index.toString()}
      />
      <Stack style={styles.attachmentView}>
        <Stack horizontal style={styles.attachment}>
          <Icon
            name="mic"
            size={22}
            color={colors.primary_008}
            style={styles.commentIcon}
          />
          <InputTextField
            style={styles.inputComment}
            placeholder={t('taskDetails:addComment')}
            onChangeText={text => setComment(text)}
            value={comment}
          />
          <Icon
            name="attach_file"
            size={22}
            color={colors.primary_008}
            style={styles.commentIcon}
          />
          <Icon
            name="smily"
            size={22}
            color={colors.primary_008}
            style={styles.commentIcon}
          />
          <TouchableOpacity
            onPress={() => {
              setComment('');
            }}>
            <Icon
              name="send"
              size={18}
              color={colors.primary_008}
              style={styles.commentIcon}
            />
          </TouchableOpacity>
        </Stack>
      </Stack>
      {deleteModal && (
        <Modal isVisible={deleteModal}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TextView
                weight="bold"
                variant={FontSizes.regular}
                style={styles.shareVia}>
                {t('taskDetails:alertDeleteComment')}
              </TextView>
              <Stack horizontal style={styles.modal}>
                <TextView
                  weight="bold"
                  variant={FontSizes.regular}
                  style={styles.reopenModal}
                  onPress={() => setDeleteModal(false)}>
                  {t('cancel')}
                </TextView>
                <TextView
                  weight="bold"
                  variant={FontSizes.regular}
                  style={styles.reopenModal}
                  onPress={() => {
                    setDeleteModal(false);
                  }}>
                  {t('delete')}
                </TextView>
              </Stack>
            </View>
          </View>
        </Modal>
      )}
    </Stack>
  );
};
