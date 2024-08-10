import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {FontSizes} from 'common/theme/font';
import {characterCheck} from 'common/utils/Regex';
import {showToast} from 'common/utils/ToastMessage';
import {Container, TextView} from 'components';
import {FloatingButton} from 'components/FloatingButton';
import Header from 'components/Header';
import {Stack} from 'components/Stack';
import {MaterialTextField} from 'components/TextField';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useSharedValue} from 'react-native-reanimated';
import {useAddGroupNameMutation} from 'request/Message';
import {Styles} from './index.styles';

type Props = NativeStackScreenProps<SignedInStackParamList, 'EditGroupSubject'>;
export const EditGroupSubjectScreen = (props: Props) => {
  const {groupName} = props?.route?.params;
  const {t} = useTranslation();

  const translateY = useSharedValue(0);
  const [name, setName] = useState<string>('');

  useEffect(() => {
    if (groupName?.length) {
      setName(groupName);
    }
  }, [groupName]);
  const renderMainContainer = () => {
    return (
      <TextView
        weight="medium"
        variant={FontSizes.regular}
        style={styles.header}>
        {t('group:enterNewSubject')}
      </TextView>
    );
  };

  const [editGroupName, {isSuccess: editGroupNameSuccess}] =
    useAddGroupNameMutation();

  const groupNameEdit = () => {
    if (characterCheck.test(name)) {
      editGroupName({
        body: {groupName: name},
        groupId: props?.route?.params?.groupId!,
      });
    } else {
      showToast(t('common:emojiError'));
    }
  };

  useEffect(() => {
    if (editGroupNameSuccess) {
      props.navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editGroupNameSuccess]);

  const styles = Styles();
  return (
    <Container noSpacing>
      <Header
        navigationType="STACK"
        translateY={translateY}
        RenderMainContainer={renderMainContainer}
      />
      <Stack spacing={16}>
        <MaterialTextField
          placeholder={t('group:groupNamePlaceholder')}
          onChangeText={setName}
          value={name}
          materialContainerStyle={styles.materialContainerStyle}
          maxLength={50}
        />
      </Stack>
      <Stack style={styles.floatingButton}>
        <FloatingButton
          name="done"
          onPress={groupNameEdit}
          styles={styles.floatingIcon}
          size={35}
        />
        {/* <Icon name="check_circle_selected" size={50} color={colors.primary} /> */}
      </Stack>
    </Container>
  );
};
