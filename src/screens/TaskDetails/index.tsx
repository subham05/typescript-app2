import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {STR_KEYS} from 'common/storage';
import {FontSizes} from 'common/theme/font';
import {userTypes} from 'common/users/userTypes';
import {Container, TextView} from 'components';
import {PrimaryButton} from 'components/Buttons';
import Header from 'components/Header';
import {Stack} from 'components/Stack';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import Modal from 'react-native-modal';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import Share from 'react-native-share';
import Email from '../../assets/svgs/Email.svg';
import WhatsApp from '../../assets/svgs/whatsapp_circle.svg';
import {TaskBody} from './components/TaskBody';
import {TaskHead} from './components/TaskHead';
import {Styles} from './index.styles';

type Props = NativeStackScreenProps<SignedInStackParamList, 'TaskDetail'>;

export const TaskDetailsScreen = (props: Props) => {
  const {t} = useTranslation();

  const {route} = {...props};
  const {hideButton} = {
    ...route.params,
  };

  const [userType, setUserType] = useState<string | null | undefined>('');

  AsyncStorage.getItem(STR_KEYS.USERTYPE).then(res => {
    setUserType(res);
  });
  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  const [shareModal, setShareModal] = useState<boolean>(false);

  const taskProps = {
    name: 'FormData',
    taskName: 'The Walt Disney Company',
    assigneeName: 'Robert Fox',
    date: 'Dec 02, 2021',
    time: '05:00PM',
    taskProgress: 78,
    priority: 'High',
    status: 'In-progress',
  };

  const url = 'https://awesome.contents.com/';
  const title = 'Awesome Contents';
  const message = 'Please check this out.';

  const options = {
    title,
    url,
    message,
  };

  const share = async () => {
    Share.open(options)
      .then(() => {})
      .catch(() => {});
  };

  const styles = Styles();
  return (
    <Container noSpacing>
      <Header
        navigationType="STACK"
        label={t('taskDetails:head')}
        translateY={translateY}
        isCloseNavigation
      />
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}>
        <TaskHead taskProps={taskProps} />
        <TaskBody tasksProps={taskProps} isShortDetails />
      </Animated.ScrollView>
      {(userType === userTypes.Owner || userType === userTypes.Manager) &&
        !hideButton && (
          <Stack spacing={16} spaceBelow={16}>
            <PrimaryButton title={t('share')} onPress={() => share()} />
          </Stack>
        )}
      {shareModal && (
        <Modal
          isVisible={shareModal}
          // onBackdropPress={() => setSwipeModal(false)}
          style={styles.bottomModal}>
          <View style={styles.bottomModalView}>
            <TextView
              weight="medium"
              variant={FontSizes.small}
              style={styles.shareVia}>
              {t('taskDetail:alert')}
            </TextView>
            <Stack horizontal horizontalAlign="space-evenly">
              <View>
                <WhatsApp height={47} width={47} />
                <TextView
                  weight="medium"
                  variant={FontSizes.xSmall}
                  style={styles.shareText}>
                  {t('taskDetail:whatsapp')}
                </TextView>
              </View>
              <View>
                <Email height={47} width={47} />
                <TextView
                  weight="medium"
                  variant={FontSizes.xSmall}
                  style={styles.shareText}>
                  {t('taskDetail:email')}
                </TextView>
              </View>
            </Stack>
            <Stack spacing={16} style={styles.cancel}>
              <PrimaryButton
                title={t('cancel')}
                onPress={() => setShareModal(false)}
              />
            </Stack>
          </View>
        </Modal>
      )}
    </Container>
  );
};
