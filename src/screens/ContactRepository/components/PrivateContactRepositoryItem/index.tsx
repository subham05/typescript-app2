import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {showToast} from 'common/utils/ToastMessage';
import {TextView} from 'components';
import DeleteModal from 'components/DeleteModal';
import {Icon} from 'components/Icon';
import {IconButton, RippleIconButton} from 'components/IconButtons';
import {Persona} from 'components/Persona';
import {Stack, StackItem} from 'components/Stack';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions, Image, TouchableOpacity, View} from 'react-native';
import {useLazyMarkContactAsPrivateOrPublicQuery} from 'request/ContactRepository';
import {ContactModal} from 'screens/Contacts';
import {BusinessCard} from 'screens/SharedContactDetails/components/BusinessCard';
import Check_circle from '../../../../assets/svgs/check_circle.svg';
import Text_snippet from '../../../../assets/svgs/text_snippet.svg';
import {Styles} from './index.styles';

interface PrivateContactRepositoryItemProps {
  item: ContactModal;
  props: any;
  isPressedLong: (value: boolean, itemId: string) => void;
  count: number;
  selectedItemIds: string[] | [];
  onMarkPublicPress: (item: ContactModal) => void;
  onDeleteClick: (itemId: string) => void;
  onShareClick: (id: string) => void;
  onLogClick?: (id: string) => void;
}

export const PrivateContactRepositoryItem: React.FC<
  PrivateContactRepositoryItemProps
> = ({
  item,
  props,
  isPressedLong,
  count,
  selectedItemIds,
  onMarkPublicPress,
  onDeleteClick,
  onShareClick,
  onLogClick,
}) => {
  const {t} = useTranslation();

  const [isOpened, setIsOpened] = useState<boolean>(false);
  const [isLongSelect, setIsLongSelect] = useState<boolean>(false);
  const [reopenModal, setReopenModal] = useState<boolean>(false);
  const [businessCardModal, setBusinessCardModal] = useState<boolean>(false);

  const [markAsPublic, {currentData, error, isError}] =
    useLazyMarkContactAsPrivateOrPublicQuery();
  const onSelect = () => {
    setIsOpened(!isOpened);
  };
  const onLongSelect = () => {
    setIsOpened(false);
    setIsLongSelect(!isLongSelect);
    isPressedLong(!isLongSelect, item._id);
  };
  useEffect(() => {
    if (businessCardModal) {
      setIsOpened(false);
    }
  }, [businessCardModal]);

  useEffect(() => {
    if (isOpened) {
      setBusinessCardModal(false);
    }
  }, [isOpened]);

  useEffect(() => {
    if (currentData?.data) {
      onMarkPublicPress(item);
      showToast(currentData.message);
    }
    if (count <= 0) {
      setIsLongSelect(false);
    }
    if (isError && error) {
      const err: any = error;
      if (err?.error) {
        showToast(err.error);
      } else {
        showToast(err?.data?.error[0]?.msg);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentData, error, selectedItemIds]);
  const styles = Styles();
  const isSelected = selectedItemIds.find(
    selectedId => selectedId === item._id,
  );
  return (
    <Stack key={item._id}>
      <TouchableOpacity
        onPress={count > 0 ? onLongSelect : onSelect}
        onLongPress={onLongSelect}
        style={styles.container}>
        <Stack horizontal horizontalAlign="space-between">
          <StackItem childrenGap={10} horizontal>
            <TouchableOpacity
              onPress={() => setBusinessCardModal(prevState => !prevState)}>
              {item?.contactProfile ? (
                <Image
                  source={{uri: item.contactProfile}}
                  style={styles.photoView}
                />
              ) : (
                item?.contactName && <Persona name={item.contactName} />
              )}
              {isSelected && count > 0 && (
                <Check_circle height={22} width={22} style={styles.iconImage} />
              )}
              {/* <Icon
                name="private_filled"
                size={22}
                color={colors.primary_007}
                style={styles.iconImage}
              /> */}
            </TouchableOpacity>
            <Stack style={styles.view}>
              <Stack
                horizontal
                verticalAlign="center"
                horizontalAlign="space-between">
                <StackItem
                  horizontal
                  childrenGap={5}
                  verticalAlign="center"
                  style={{width: Dimensions.get('screen').width - 145}}>
                  <TextView weight="medium" variant={FontSizes.medium} truncate>
                    {item.contactName}
                  </TextView>
                  {item.hasBusinessCard && (isOpened || businessCardModal) && (
                    <RippleIconButton
                      name="attachment"
                      color={colors.primary}
                      onPress={() => {
                        setBusinessCardModal(prevState => !prevState);
                      }}
                    />
                  )}
                </StackItem>
                <StackItem
                  horizontal
                  childrenGap={7}
                  verticalAlign="center"
                  horizontalAlign="flex-end">
                  {businessCardModal && (
                    <IconButton
                      name="edit"
                      onPress={() => {
                        const obj = item;
                        obj.contactEmail =
                          item.contactEmail.length > 0
                            ? item.contactEmail[0]
                            : '';
                        props.navigation.navigate('CreateContact', {
                          edit: true,
                          item: obj,
                        });
                      }}
                      color={colors.black}
                      size={22}
                    />
                  )}
                  {(isOpened || businessCardModal) && (
                    <TouchableOpacity
                      onPress={() => {
                        setReopenModal(true);
                        businessCardModal && setBusinessCardModal(false);
                      }}>
                      <Icon name="delete" size={22} color={colors.primary} />
                    </TouchableOpacity>
                  )}
                </StackItem>
              </Stack>
              <TextView
                weight="regular"
                variant={FontSizes.small}
                style={styles.number}>
                {item.contactPhone}
              </TextView>
            </Stack>
          </StackItem>
        </Stack>
      </TouchableOpacity>
      {isOpened && (
        <Stack
          horizontal
          horizontalAlign="space-between"
          style={styles.optionView}>
          <TouchableOpacity
            onPress={async () => {
              await markAsPublic({contactType: 'PUBLIC', contacts: [item._id]});
              setIsOpened(false);
            }}>
            <Stack horizontal style={styles.option}>
              <Icon name="public_mark" size={22} color={colors.primary} />
              <TextView
                weight="regular"
                variant={FontSizes.regular}
                style={styles.optionText}>
                {t('contacts:markPublic')}
              </TextView>
            </Stack>
          </TouchableOpacity>
          <TouchableOpacity
            // disabled
            // onPress={() => props.navigation.navigate('ShareContactWith')}
            onPress={() => onShareClick?.(item._id)}>
            <Stack horizontal style={styles.option}>
              <Icon name="share" size={22} color={colors.primary} />
              <TextView
                weight="regular"
                variant={FontSizes.regular}
                style={styles.optionText}>
                {t('share')}
              </TextView>
            </Stack>
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={() => setReopenModal(true)}>
            <Stack horizontal>
              <Icon name="delete" size={22} color={colors.primary} />
              <TextView
                weight="regular"
                variant={FontSizes.regular}
                style={styles.optionText}>
                {t('contacts:delete')}
              </TextView>
            </Stack>
          </TouchableOpacity> */}
          <TouchableOpacity onPress={() => onLogClick?.(item._id)}>
            <Stack horizontal>
              <Text_snippet width={21} height={21} />
              <TextView
                weight="regular"
                variant={FontSizes.regular}
                style={styles.optionText}>
                {t('contacts:logs')}
              </TextView>
            </Stack>
          </TouchableOpacity>
        </Stack>
      )}
      {businessCardModal && (
        <Stack style={styles.businessCard}>
          <BusinessCard selectedItem={item} />
          <Stack
            horizontal
            horizontalAlign="space-between"
            style={styles.modalOptionView}>
            <TouchableOpacity>
              <Stack horizontal style={styles.option}>
                <Icon name="public_mark" size={22} color={colors.primary} />
                <TextView
                  weight="regular"
                  variant={FontSizes.regular}
                  style={styles.optionText}>
                  {t('contacts:markPublic')}
                </TextView>
              </Stack>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onShareClick?.(item._id)}>
              <Stack horizontal style={styles.option}>
                <Icon name="share" size={22} color={colors.primary} />
                <TextView
                  weight="regular"
                  variant={FontSizes.regular}
                  style={styles.optionText}>
                  {t('share')}
                </TextView>
              </Stack>
            </TouchableOpacity>
            {/* <TouchableOpacity
              onPress={() => {
                setReopenModal(true);
                setBusinessCardModal(false);
              }}>
              <Stack horizontal>
                <Icon name="delete" size={22} color={colors.primary} />
                <TextView
                  weight="regular"
                  variant={FontSizes.regular}
                  style={styles.optionText}>
                  {t('contacts:delete')}
                </TextView>
              </Stack>
            </TouchableOpacity> */}
            <TouchableOpacity onPress={() => onLogClick?.(item._id)}>
              <Stack horizontal>
                <Text_snippet width={21} height={21} />
                <TextView
                  weight="regular"
                  variant={FontSizes.regular}
                  style={styles.optionText}>
                  {t('contacts:logs')}
                </TextView>
              </Stack>
            </TouchableOpacity>
          </Stack>
        </Stack>
      )}
      {reopenModal && (
        <DeleteModal
          itemId={item._id!}
          reopenModal={reopenModal}
          setReopenModal={value => setReopenModal(value)}
          onDeleteClick={selectedItemId => {
            onDeleteClick(selectedItemId!);
            setIsOpened(false);
          }}
        />
      )}
      <View style={styles.viewDivide} />
      {/* {businessCardModal && (
        <Modal
          isVisible={businessCardModal}
          onBackdropPress={() => setBusinessCardModal(false)}
          backdropColor={'transparent'}>
          <Stack>
            <Stack style={styles.edit}>
              <IconButton
                name="edit"
                onPress={() => {
                  props.navigation.navigate('CreateContact', {edit: true});
                }}
                color={colors.black}
                size={24}
              />
            </Stack>
            <Stack spaceBelow={16} style={styles.background}>
              <StackItem spacing={25} childrenGap={15} style={styles.card}>
                <Stack horizontal horizontalAlign="space-between">
                  <StackItem childrenGap={5}>
                    <TextView
                      weight="medium"
                      variant={FontSizes.xMedium}
                      style={styles.textColor}>
                      Robert Fox
                    </TextView>
                    <TextView
                      weight="regular"
                      variant={FontSizes.small}
                      style={styles.textColor}>
                      Asst manager
                    </TextView>
                  </StackItem>
                  <ForLogo height={40} width={40} style={styles.logo} />
                </Stack>
                <Divider size={1.5} color={colors.primary_004} />
                <StackItem childrenGap={10}>
                  <Stack horizontal verticalAlign="center">
                    <Icon name="phone" size={24} color={colors.white} />
                    <TextView
                      weight="regular"
                      variant={FontSizes.xxSmall}
                      style={styles.text}>
                      (406) 555-0120
                    </TextView>
                  </Stack>
                  <Stack horizontal verticalAlign="center">
                    <Icon name="inbox" size={24} color={colors.white} />
                    <TextView
                      weight="regular"
                      variant={FontSizes.xxSmall}
                      style={styles.text}>
                      robertf@mail.com
                    </TextView>
                  </Stack>
                  <Stack horizontal verticalAlign="center">
                    <Icon name="location" size={24} color={colors.white} />
                    <TextView
                      weight="regular"
                      variant={FontSizes.xxSmall}
                      style={styles.text}>
                      2972 Westheimer Rd. Santa Ana, Illinois 85486
                    </TextView>
                  </Stack>
                </StackItem>
              </StackItem>
              <TextView
                weight="regular"
                variant={FontSizes.xxSmall}
                style={styles.source}>
                Source: Robert Fox
              </TextView>
            </Stack>
            <Stack
              horizontal
              horizontalAlign="space-between"
              style={styles.modalOptionView}>
              <TouchableOpacity>
                <Stack horizontal style={styles.option}>
                  <Icon name="public_mark" size={22} color={colors.primary} />
                  <TextView
                    weight="regular"
                    variant={FontSizes.regular}
                    style={styles.optionText}>
                    {t('contacts:markPublic')}
                  </TextView>
                </Stack>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => props.navigation.navigate('ShareContactWith')}>
                <Stack horizontal style={styles.option}>
                  <Icon name="share" size={22} color={colors.primary} />
                  <TextView
                    weight="regular"
                    variant={FontSizes.regular}
                    style={styles.optionText}>
                    {t('share')}
                  </TextView>
                </Stack>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setReopenModal(true);
                  setBusinessCardModal(false);
                }}>
                <Stack horizontal>
                  <Icon name="delete" size={22} color={colors.primary} />
                  <TextView
                    weight="regular"
                    variant={FontSizes.regular}
                    style={styles.optionText}>
                    {t('contacts:delete')}
                  </TextView>
                </Stack>
              </TouchableOpacity>
            </Stack>
          </Stack>
        </Modal>
      )} */}
    </Stack>
  );
};
