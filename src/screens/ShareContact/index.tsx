import AsyncStorage from '@react-native-async-storage/async-storage';
import {STR_KEYS} from 'common/storage';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {userTypes} from 'common/users/userTypes';
import {Container, TextView} from 'components';
import {PrimaryButton} from 'components/Buttons';
import {FilterIcon} from 'components/FilterIcon';
import Header from 'components/Header';
import {Icon} from 'components/Icon';
import {membersProps} from 'components/Members/MembersItem';
import {MembersList} from 'components/Members/MembersList';
import {ModalList} from 'components/Members/ModalList';
import {Stack, StackItem} from 'components/Stack';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import Ripple from 'react-native-material-ripple';
import Modal from 'react-native-modal';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {Styles} from './index.styles';
import {shareMembersList} from './mockData';
import {modalMembersList} from './mockDataModal';

export const ShareContactScreen = () => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  const [userType, setUserType] = useState<string | null | undefined>('');

  AsyncStorage.getItem(STR_KEYS.USERTYPE).then(res => {
    setUserType(res);
  });
  const [swipeModal, setSwipeModal] = useState<boolean>(false);
  const [shareModal, setShareModal] = useState<boolean>(false);
  const [isAllSelected, setIsAllSelected] = useState<boolean>(false);
  const [isManager, setIsManager] = useState<boolean>(false);
  const [isEmployee, setIsEmployee] = useState<boolean>(false);

  const allMembers = shareMembersList;
  let [filterMembers, setFilterMembers] =
    useState<membersProps[]>(shareMembersList);

  const [countFilter, setCountFilter] = useState<number>(0);

  const renderLeftContainer = () => {
    return (
      <FilterIcon count={countFilter} onPress={() => setSwipeModal(true)} />
    );
  };

  const applyFunction = () => {
    if (isEmployee && !isManager) {
      let tempMembers: any = [];
      filterMembers = tempMembers;
      shareMembersList.map(item => {
        if (item.position === 'Employee') {
          filterMembers.push(item);
        }
      });
    }
    if (isManager && !isEmployee) {
      let tempMembers: any = [];
      filterMembers = tempMembers;
      shareMembersList.map(item => {
        if (item.position === 'Manager') {
          filterMembers.push(item);
        }
      });
    }
    if ((!isManager && !isEmployee) || (isManager && isEmployee)) {
      filterMembers = allMembers;
      setFilterMembers(filterMembers);
    }
    setFilterMembers(filterMembers);
    setSwipeModal(false);
    if (isEmployee && !isManager) {
      setCountFilter(1);
    } else if (!isEmployee && isManager) {
      setCountFilter(1);
    } else if (isEmployee && isManager) {
      setCountFilter(2);
    } else {
      setCountFilter(0);
    }
  };

  const styles = Styles();
  return (
    <Container noSpacing>
      <Stack style={styles.view}>
        <Stack style={styles.view}>
          <Header
            navigationType="STACK"
            label={
              userType === userTypes.Owner
                ? t('accountPage:shareHead')
                : t('accountPage:contacts')
            }
            translateY={translateY}
            RenderLeftContainer={renderLeftContainer}
            isCloseNavigation
          />
          <Animated.ScrollView
            showsVerticalScrollIndicator={false}
            onScroll={scrollHandler}
            scrollEventThrottle={16}>
            <TouchableOpacity onPress={() => setIsAllSelected(!isAllSelected)}>
              <Stack
                spacing={5}
                spaceBelow={16}
                horizontal
                style={styles.selectAll}
                verticalAlign="center">
                <TextView
                  weight="medium"
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
            <Stack spacing={16} spaceBelow={16}>
              <MembersList
                data={filterMembers}
                showCheckBox={true}
                isAllSelected={isAllSelected}
                onSelect={setIsAllSelected}
                isEmail
              />
            </Stack>
          </Animated.ScrollView>
        </Stack>
        <Stack spacing={16} spaceBelow={16}>
          <PrimaryButton
            title={t('share')}
            onPress={() => {
              setShareModal(true);
            }}
          />
        </Stack>
        {/* <Stack style={styles.shareButtonView}>
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
        </Stack> */}
      </Stack>
      {swipeModal && (
        <Modal
          isVisible={swipeModal}
          onBackdropPress={() => setSwipeModal(false)}
          style={styles.bottomModal}>
          <View style={styles.bottomModalView}>
            <StackItem childrenGap={20} spacing={26}>
              <Ripple onPress={() => setIsManager(!isManager)}>
                <Stack horizontal verticalAlign="center">
                  <Stack style={styles.iconManager}>
                    {isManager ? (
                      <Icon name="check_box" size={20} />
                    ) : (
                      <Icon name="check_box_blank" size={20} />
                    )}
                  </Stack>
                  <TextView
                    weight="medium"
                    variant={FontSizes.regular}
                    style={styles.shareText}>
                    {t('accountPage:managers')}
                  </TextView>
                </Stack>
              </Ripple>
              <Ripple onPress={() => setIsEmployee(!isEmployee)}>
                <Stack horizontal verticalAlign="center">
                  <Stack style={styles.iconEmployee}>
                    {isEmployee ? (
                      <Icon
                        name="check_box"
                        size={20}
                        onPress={() => setIsEmployee(!isEmployee)}
                      />
                    ) : (
                      <Icon
                        name="check_box_blank"
                        size={20}
                        onPress={() => setIsEmployee(!isEmployee)}
                      />
                    )}
                  </Stack>
                  <TextView
                    weight="medium"
                    variant={FontSizes.regular}
                    style={styles.shareText}>
                    {t('accountPage:employees')}
                  </TextView>
                </Stack>
              </Ripple>
              <Stack horizontal center style={styles.buttonView}>
                <TouchableOpacity
                  onPress={() => applyFunction()}
                  style={styles.applyButton}>
                  <TextView
                    weight="medium"
                    variant={FontSizes.small}
                    style={styles.apply}>
                    {t('filter:apply')}
                  </TextView>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setSwipeModal(false)}
                  style={styles.closeButton}>
                  <TextView
                    weight="medium"
                    variant={FontSizes.small}
                    style={styles.close}>
                    {t('filter:close')}
                  </TextView>
                </TouchableOpacity>
              </Stack>
            </StackItem>
          </View>
        </Modal>
      )}
      {shareModal && (
        <Modal isVisible={shareModal} style={styles.bottomModal}>
          <View style={styles.bottomModalView}>
            <Stack spacing={16} spaceBelow={16}>
              <TextView weight="semibold" variant={FontSizes.xlarge}>
                {t('accountPage:shareContacts')}
              </TextView>
            </Stack>
            <ScrollView>
              <Stack spacing={5}>
                <ModalList data={modalMembersList} isEmail />
              </Stack>
            </ScrollView>
            <Stack spacing={16} horizontal center style={styles.buttonView}>
              <TouchableOpacity
                onPress={() => setShareModal(false)}
                style={styles.applyButton}>
                <TextView
                  weight="medium"
                  variant={FontSizes.small}
                  style={styles.apply}>
                  {t('confirm')}
                </TextView>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShareModal(false)}
                style={styles.closeButton}>
                <TextView
                  weight="medium"
                  variant={FontSizes.small}
                  style={styles.close}>
                  {t('cancel')}
                </TextView>
              </TouchableOpacity>
            </Stack>
          </View>
        </Modal>
      )}
    </Container>
  );
};
