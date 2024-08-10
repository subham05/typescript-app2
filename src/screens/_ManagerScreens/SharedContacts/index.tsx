import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {Container, TextView} from 'components';
import Header from 'components/Header';
import {Icon} from 'components/Icon';
import {IconButton} from 'components/IconButtons';
import {Stack} from 'components/Stack';
import {ManagerSignedInStackParamList} from 'navigation/Stacks/ManagersStack/ManagersSignedInStack';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import {useSharedValue} from 'react-native-reanimated';
import {SharedContactRepositoryList} from 'screens/ContactRepository/components/SharedContactRepositoryList';
import {contactRepositoryList} from 'screens/ContactRepository/mockData';
import {BottomPanel} from './components/BottomPanel';
import {ContactRepositoryHeader} from './components/Header';
import {Styles} from './index.styles';

type Props = NativeStackScreenProps<
  ManagerSignedInStackParamList,
  'SharedContact'
>;

export const SharedContactScreen = (props: Props) => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const [selectedContact, setSelectedContact] =
    useState<string>('Shared with me');

  const [isPanelActive, setIsPanelActive] = useState(false);

  const openPanel = () => {
    setIsPanelActive(true);
  };

  const closePanel = () => {
    setIsPanelActive(false);
  };

  const renderLeftContainer = () => {
    return (
      <Stack horizontal>
        <IconButton
          name="business_card"
          size={24}
          color={colors.black}
          onPress={() => openPanel()}
        />
        {/* <TouchableOpacity onPress={() => openPanel()}>
          <Icon name="business_card" size={24} color={colors.black} />
        </TouchableOpacity> */}
        {selectedContact === 'Private' && (
          <Menu>
            <MenuTrigger>
              <Icon name="more" size={24} color={colors.black} />
            </MenuTrigger>
            <MenuOptions>
              <MenuOption onSelect={() => {}}>
                <TextView
                  weight="medium"
                  variant={FontSizes.regular}
                  style={styles.menuText}>
                  {t('contacts:owner')}
                </TextView>
              </MenuOption>
              <MenuOption onSelect={() => {}}>
                <TextView
                  weight="medium"
                  variant={FontSizes.regular}
                  style={styles.menuText}>
                  {t('contacts:manager')}
                </TextView>
              </MenuOption>
            </MenuOptions>
          </Menu>
        )}
      </Stack>
    );
  };

  const styles = Styles();
  return (
    <Container noSpacing>
      <Stack style={styles.mainView}>
        <Stack style={styles.mainView}>
          <Header
            navigationType="STACK"
            label={t('contacts:sharedContacts')}
            translateY={translateY}
            RenderLeftContainer={renderLeftContainer}
          />
          <ContactRepositoryHeader
            selectedValue={selectedContact}
            onPress={value => {
              setSelectedContact(value);
            }}
          />
          <Stack spacing={16} spaceBelow={16}>
            <SharedContactRepositoryList
              data={contactRepositoryList}
              SharedConatctDetailsNavigation={() =>
                props.navigation.navigate('SharedContactDetails')
              }
            />
          </Stack>
        </Stack>
      </Stack>
      {isPanelActive && (
        <BottomPanel
          panelState={isPanelActive}
          onPressEditBusinessCard={() =>
            props.navigation.navigate('EditBusinessCard')
          }
          onPressClose={() => closePanel()}
        />
      )}
    </Container>
  );
};
