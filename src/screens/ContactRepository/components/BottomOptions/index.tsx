import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {showToast} from 'common/utils/ToastMessage';
import {TextView} from 'components';
import DeleteModal from 'components/DeleteModal';
import {Icon} from 'components/Icon';
import {Stack} from 'components/Stack';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity} from 'react-native';
import {
  useLazyDeleteContactQuery,
  useLazyMarkContactAsPrivateOrPublicQuery,
} from 'request/ContactRepository';
import {Styles} from './index.styles';

export const BottomOptions = (props: any) => {
  const {t} = useTranslation();
  const [markAsPrivate, response] = useLazyMarkContactAsPrivateOrPublicQuery();
  const [deleteContact, deleteContactResult] = useLazyDeleteContactQuery();

  const {
    selectedItemIdArray,
    onMarkPrivatePress,
    selectedContact,
    onShareclick,
  } = props;
  const [reopenModal, setReopenModal] = useState<boolean>(false);
  useEffect(() => {
    if (
      (response.error && response.isError) ||
      (deleteContactResult.error && deleteContactResult.isError)
    ) {
      const err: any = response.isError
        ? response.error
        : deleteContactResult.error;
      if (err?.error) {
        showToast(err?.error);
      } else {
        err?.data?.error
          ? showToast(err?.data?.error![0]?.msg)
          : showToast(err?.data?.message);
      }
    }
    if (response.currentData?.data) {
      showToast(response.currentData.message);
    }
    if (deleteContactResult.currentData?.message) {
      showToast(deleteContactResult.currentData.message);
    }
  }, [response, deleteContactResult]);
  const styles = Styles();
  return (
    <>
      <Stack
        horizontal
        horizontalAlign="space-between"
        style={styles.bottomView}>
        <TouchableOpacity
          onPress={async () => {
            selectedContact === 'Public'
              ? await markAsPrivate({
                  contactType: 'PRIVATE',
                  contacts: selectedItemIdArray,
                })
              : await markAsPrivate({
                  contactType: 'PUBLIC',
                  contacts: selectedItemIdArray,
                });
            onMarkPrivatePress();
          }}>
          <Stack horizontal style={styles.option}>
            <Icon
              name={
                selectedContact === 'Public' ? 'private_mark' : 'public_mark'
              }
              size={22}
              color={colors.white}
            />
            <TextView
              weight="regular"
              variant={FontSizes.regular}
              style={styles.optionText}>
              {selectedContact === 'Public'
                ? t('contacts:markPrivate')
                : t('contacts:markPublic')}
            </TextView>
          </Stack>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onShareclick?.()}>
          <Stack horizontal style={styles.option}>
            <Icon name="share" size={22} color={colors.white} />
            <TextView
              weight="regular"
              variant={FontSizes.regular}
              style={styles.optionText}>
              {t('share')}
            </TextView>
          </Stack>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setReopenModal(true)}>
          <Stack horizontal>
            <Icon name="delete" size={22} color={colors.white} />
            <TextView
              weight="regular"
              variant={FontSizes.regular}
              style={styles.optionText}>
              {t('contacts:delete')}
            </TextView>
          </Stack>
        </TouchableOpacity>
      </Stack>
      {reopenModal ? (
        <DeleteModal
          reopenModal={reopenModal}
          setReopenModal={value => setReopenModal(value)}
          onDeleteClick={async () => {
            await deleteContact({
              contacts: selectedItemIdArray,
            });
            onMarkPrivatePress(false);
          }}
        />
      ) : (
        <></>
      )}
    </>
  );
};
