import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {Container, TextView} from 'components';
import {PrimaryButton} from 'components/Buttons';
import Header from 'components/Header';
import {Icon} from 'components/Icon';
import {Stack} from 'components/Stack';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {useSharedValue} from 'react-native-reanimated';
import {Styles} from './index.styles';

type Props = NativeStackScreenProps<SignedInStackParamList>;
export const ViewFileScreen = (props: Props) => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  // const [userType, setUserType] = useState<string | null | undefined>('');

  // AsyncStorage.getItem(STR_KEYS.USERTYPE).then(res => {
  //   setUserType(res);
  // });

  const styles = Styles();
  return (
    <Container noSpacing>
      <Header
        label={t('document:viewFile')}
        navigationType="STACK"
        translateY={translateY}
      />
      <Stack spacing={16} spaceBelow={16}>
        <TextView
          weight="regular"
          variant={FontSizes.regular}
          style={styles.label}>
          {t('document:title')}
        </TextView>
        <TextView
          weight="regular"
          variant={FontSizes.regular}
          style={styles.input}>
          Project
        </TextView>
        {/* <TextView
          weight="regular"
          variant={FontSizes.regular}
          style={styles.label}>
          {t('document:taskName')}
        </TextView>
        <TextView
          weight="regular"
          variant={FontSizes.regular}
          style={styles.input}>
          Landing page redesign
        </TextView> */}
        <TextView
          weight="regular"
          variant={FontSizes.regular}
          style={styles.label}>
          {t('document:description')}
        </TextView>
        <TextView
          weight="regular"
          variant={FontSizes.regular}
          style={styles.inputDescription}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Feugiat
          fringilla pulvinar gravida ultricies duis lectus lacus lacus.
        </TextView>
        <TextView
          weight="regular"
          variant={FontSizes.regular}
          style={styles.label}>
          {t('document:attachment')}
        </TextView>
        <Stack horizontal style={styles.attachmentView}>
          <Stack horizontal style={styles.attachment}>
            <Icon
              name="photo_gallary"
              size={22}
              style={styles.attachmentIcon}
            />
            <TextView
              weight="regular"
              variant={FontSizes.regular}
              style={styles.attachmentName}>
              Project_details.png
            </TextView>
          </Stack>
          <Icon
            name="download"
            size={22}
            style={styles.downloadIcon}
            color={colors.black}
          />
        </Stack>
      </Stack>
      <Stack style={styles.shareButton}>
        <PrimaryButton
          title={t('document:assign')}
          onPress={() => props.navigation.navigate('AddTask', {subTask: true})}
          // onPress={() =>
          //   props.navigation.navigate(
          //     userType !== userTypes.Manager ? 'AssignTask' : 'AssignTask',
          //   )
          // }
        />
      </Stack>
    </Container>
  );
};
