import {FontSizes} from 'common/theme/font';
import {userTypes} from 'common/users/userTypes';
import {TextView} from 'components';
import {Divider} from 'components/Divider';
import {Stack} from 'components/Stack';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity} from 'react-native';
import {SwipeablePanel} from 'rn-swipeable-panel';
import {respHeight} from 'screens/Calendar/utils/responsive';
import {StaffSubmenuModal} from 'store/Reducer';
import {Styles} from './index.styles';

interface HomeScreenBottomPanel {
  panelState: boolean;
  onPressClose: () => void;
  props: any;
  addList?: StaffSubmenuModal[] | [];
}

export const HomeScreenBottomPanel: React.FC<HomeScreenBottomPanel> = ({
  panelState,
  onPressClose,
  props,
  addList,
}) => {
  const {t} = useTranslation();

  const panelProps = {
    fullWidth: true,
    openLarge: false,
    onlySmall: true,
    showCloseButton: false,
    onClose: () => closePanel(),
    onPressCloseButton: () => closePanel(),
    closeOnTouchOutside: true,
    smallPanelHeight: respHeight(Number(addList?.length) * 73 + 220),
    // ...or any prop you want
  };

  const [isPanelActive, setIsPanelActive] = useState(panelState);

  const closePanel = () => {
    setIsPanelActive(false);
    onPressClose();
  };
  const getAddOptions = (optios: string) => {
    switch (optios) {
      case userTypes.Company:
        return (
          <>
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('AddCompany');
                closePanel();
              }}
              style={styles.itemSpacing}>
              <TextView weight="medium" variant={FontSizes.xMedium}>
                {t('homePage:addCompany')}
              </TextView>
            </TouchableOpacity>
            <Divider size={2} />
          </>
        );
      case userTypes.Owner.toUpperCase():
        return (
          <>
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('AddOwner');
                closePanel();
              }}
              style={styles.itemSpacing}>
              <TextView weight="medium" variant={FontSizes.xMedium}>
                {t('homePage:addOwner')}
              </TextView>
            </TouchableOpacity>
            <Divider size={2} />
          </>
        );
      case userTypes.persoalAssistant:
        return (
          <>
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('AddPersonalAssistant');
                closePanel();
              }}
              style={styles.itemSpacing}>
              <TextView weight="medium" variant={FontSizes.xMedium}>
                {t('homePage:addPA')}
              </TextView>
            </TouchableOpacity>
            <Divider size={2} />
          </>
        );
      case userTypes.GeneralManager:
        return (
          <>
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('AddGeneralManager');
                closePanel();
              }}
              style={styles.itemSpacing}>
              <TextView weight="medium" variant={FontSizes.xMedium}>
                {t('homePage:addGM')}
              </TextView>
            </TouchableOpacity>
            <Divider size={2} />
          </>
        );
      case userTypes.Manager.toUpperCase():
        return (
          <>
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('AddManager');
                closePanel();
              }}
              style={styles.itemSpacing}>
              <TextView weight="medium" variant={FontSizes.xMedium}>
                {t('homePage:addManager')}
              </TextView>
            </TouchableOpacity>
            <Divider size={2} />
          </>
        );
      case userTypes.Task:
        return (
          <>
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('AddTask', {subTask: true});
                closePanel();
              }}
              style={styles.itemSpacing}>
              <TextView weight="medium" variant={FontSizes.xMedium}>
                {t('homePage:addTask')}
              </TextView>
            </TouchableOpacity>
            <Divider size={2} />
          </>
        );
      case userTypes.Employee.toUpperCase():
        return (
          <>
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('AddEmployee');
                closePanel();
              }}
              style={styles.itemSpacing}>
              <TextView weight="medium" variant={FontSizes.xMedium}>
                {t('homePage:addEmployee')}
              </TextView>
            </TouchableOpacity>
            <Divider size={2} />
          </>
        );
      case userTypes.Vendor.toUpperCase():
        return (
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate('AddVendor');
              closePanel();
            }}
            style={styles.itemSpacing}>
            <TextView weight="medium" variant={FontSizes.xMedium}>
              {t('homePage:addVendor')}
            </TextView>
          </TouchableOpacity>
        );
    }
  };
  const styles = Styles();
  return (
    <SwipeablePanel {...panelProps} isActive={isPanelActive}>
      <Stack spacing={25} style={styles.swipable}>
        {addList?.map((item: StaffSubmenuModal) => getAddOptions(item.user))}
      </Stack>
    </SwipeablePanel>
  );
};
