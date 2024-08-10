import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {Container, TextView} from 'components';
import Header from 'components/Header';
import {Icon} from 'components/Icon';
import {MembersList} from 'components/Members/MembersList';
import {ModalList} from 'components/Members/ModalList';
import {Stack} from 'components/Stack';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {shareMembersList} from 'screens/ShareContact/mockData';
import {modalMembersList} from 'screens/ShareContact/mockDataModal';
import {Styles} from './index.styles';

export const NotificationContactRequest = () => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  const [isAllSelected, setIsAllSelected] = useState<boolean>(false);

  const [shareModal, setShareModal] = useState<boolean>(false);

  const styles = Styles();
  return (
    <Container noSpacing>
      <Stack style={styles.view}>
        <Stack style={styles.view}>
          <Header
            navigationType="STACK"
            label={t('notificationPage:contact')}
            translateY={translateY}
            isCloseNavigation
          />
          <TouchableOpacity onPress={() => setIsAllSelected(!isAllSelected)}>
            <Stack
              spacing={5}
              spaceBelow={16}
              horizontal
              style={styles.selectAll}>
              <TextView
                weight="semibold"
                variant={FontSizes.regular}
                style={styles.selectAllText}>
                {t('selectAll')}
              </TextView>
              {isAllSelected ? (
                <Icon name="check_box" size={20} color={colors.primary_002} />
              ) : (
                <Icon
                  name="check_box_blank"
                  size={20}
                  color={colors.primary_002}
                />
              )}
            </Stack>
          </TouchableOpacity>
          <Animated.ScrollView
            showsVerticalScrollIndicator={false}
            onScroll={scrollHandler}
            scrollEventThrottle={16}>
            <Stack spacing={16} spaceBelow={16}>
              <MembersList
                data={shareMembersList}
                showCheckBox={true}
                isAllSelected={isAllSelected}
                onSelect={setIsAllSelected}
              />
            </Stack>
          </Animated.ScrollView>
        </Stack>
        <Stack style={styles.shareButtonView}>
          <TouchableOpacity
            onPress={() => {
              setShareModal(true);
            }}
            style={styles.shareButton}>
            <TextView
              weight="medium"
              variant={FontSizes.small}
              style={styles.share}>
              {t('share')}
            </TextView>
          </TouchableOpacity>
        </Stack>
      </Stack>
      {shareModal ? (
        <Modal isVisible={shareModal} style={styles.bottomModal}>
          <View style={styles.bottomModalView}>
            <Stack spacing={16}>
              <TextView weight="semibold" variant={FontSizes.xlarge}>
                {t('accountPage:shareContacts')}
              </TextView>
            </Stack>
            <ScrollView>
              <Stack spacing={16}>
                <ModalList data={modalMembersList} />
              </Stack>
            </ScrollView>
            <Stack spacing={16} horizontal center style={styles.buttonView}>
              <TouchableOpacity
                onPress={() => setShareModal(false)}
                style={styles.applyButton}>
                <TextView
                  weight="medium"
                  variant={FontSizes.regular}
                  style={styles.apply}>
                  {t('confirm')}
                </TextView>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShareModal(false)}
                style={styles.closeButton}>
                <TextView
                  weight="medium"
                  variant={FontSizes.regular}
                  style={styles.close}>
                  {t('cancel')}
                </TextView>
              </TouchableOpacity>
            </Stack>
          </View>
        </Modal>
      ) : (
        <></>
      )}
    </Container>
  );
};
