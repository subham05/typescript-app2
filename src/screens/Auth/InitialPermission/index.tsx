import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {getMultiplePermissions} from 'common/utils/permission/common';
import {Container, TextView} from 'components';
import {Icon} from 'components/Icon';
import {Stack, StackItem} from 'components/Stack';
import {NavContext} from 'navigation/router';
import React, {useContext} from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {PERMISSIONS} from 'react-native-permissions';
export const InitialPermission = () => {
  const {t} = useTranslation();
  const {savePermissions} = useContext(NavContext);

  const takePermissions = async () => {
    await getMultiplePermissions([
      PERMISSIONS.ANDROID.READ_CONTACTS,
      PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      PERMISSIONS.ANDROID.CAMERA,
      PERMISSIONS.ANDROID.RECORD_AUDIO,
    ]);
    savePermissions();
  };

  return (
    <Container noSpacing>
      <Stack spacing={16} style={styles().header}>
        <TextView weight="semibold" variant={28}>
          {t('login:enablePermission')}
        </TextView>
      </Stack>
      <ScrollView>
        <StackItem spacing={16} childrenGap={20} style={styles().mainView}>
          <StackItem horizontal childrenGap={10}>
            <Icon
              name="check_box"
              size={18}
              color={colors.black}
              style={styles().checkBox}
            />
            <StackItem childrenGap={5}>
              <TextView weight="medium" variant={FontSizes.medium}>
                {t('login:contacts')}
              </TextView>
              <TextView
                weight="regular"
                variant={FontSizes.small}
                style={styles().text}>
                {t('login:text')}
              </TextView>
            </StackItem>
          </StackItem>
          <StackItem horizontal childrenGap={10}>
            <Icon
              name="check_box"
              size={18}
              color={colors.black}
              style={styles().checkBox}
            />
            <StackItem childrenGap={5}>
              <TextView weight="medium" variant={FontSizes.medium}>
                {t('login:gallery')}
              </TextView>
              <TextView
                weight="regular"
                variant={FontSizes.small}
                style={styles().text}>
                {t('login:text')}
              </TextView>
            </StackItem>
          </StackItem>
          <StackItem horizontal childrenGap={10}>
            <Icon
              name="check_box"
              size={18}
              color={colors.black}
              style={styles().checkBox}
            />
            <StackItem childrenGap={5}>
              <TextView weight="medium" variant={FontSizes.medium}>
                {t('login:storage')}
              </TextView>
              <TextView
                weight="regular"
                variant={FontSizes.small}
                style={styles().text}>
                {t('login:text')}
              </TextView>
            </StackItem>
          </StackItem>
          <StackItem horizontal childrenGap={10}>
            <Icon
              name="check_box"
              size={18}
              color={colors.black}
              style={styles().checkBox}
            />
            <StackItem childrenGap={5}>
              <TextView weight="medium" variant={FontSizes.medium}>
                {t('login:camera')}
              </TextView>
              <TextView
                weight="regular"
                variant={FontSizes.small}
                style={styles().text}>
                {t('login:text')}
              </TextView>
            </StackItem>
          </StackItem>
        </StackItem>
      </ScrollView>
      <TouchableOpacity onPress={takePermissions} style={styles().allow}>
        <TextView
          weight="medium"
          variant={FontSizes.regular}
          style={styles().allowText}>
          {t('login:allow')}
        </TextView>
      </TouchableOpacity>
    </Container>
  );
};

const styles = () => {
  const loginStyles = StyleSheet.create({
    header: {
      marginTop: 16,
    },
    mainView: {
      marginTop: '10%',
    },
    checkBox: {
      marginTop: 3,
    },
    text: {
      color: colors.grey_003,
      marginRight: 16,
    },
    allow: {
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      borderWidth: 1,
      borderColor: colors.primary,
      marginTop: 10,
      marginBottom: '5%',
      width: 150,
    },
    allowText: {
      padding: '5%',
      color: colors.primary,
    },
  });
  return loginStyles;
};
