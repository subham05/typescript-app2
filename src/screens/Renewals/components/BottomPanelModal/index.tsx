import {FilterFooter} from 'components/FilterModal/FilterFooter';
import {FilterMenu, optionArrayType} from 'components/FilterModal/FilterMenu';
import {FilterSubMenu} from 'components/FilterModal/FilterSubMenu/SubMenu';
import {FilterHeader} from 'components/FilterModal/Header';
import {Stack} from 'components/Stack';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions, KeyboardAvoidingView, Platform, View} from 'react-native';
import Modal from 'react-native-modal';
import {Styles} from './index.styles';

interface RenewalsBottomPanelModal {
  panelState: boolean;
  onPressClose: () => void;
  props: any;
  filterCount: (value: number) => void;
  onSelectSort?: (value: Set<number>) => void;
  selectedSort?: Set<number>;
}

export const RenewalsBottomPanelModal: React.FC<RenewalsBottomPanelModal> = ({
  panelState,
  onPressClose,
  filterCount,
  onSelectSort,
  selectedSort,
}) => {
  const {t} = useTranslation();

  const [isPanelActive, setIsPanelActive] = useState(panelState);

  const closePanel = () => {
    setIsPanelActive(false);
    onPressClose();
  };

  const [option, setOption] = useState<string>(t('filter:sortBy'));

  const sortByArray = [
    {id: 1, name: t('filter:default')},
    {id: 2, name: t('filter:a_to_z')},
  ];

  const [selectedSortby, setSelectedSortby] = useState<Set<number>>(
    new Set<number>(),
  );

  useEffect(() => {
    setSelectedSortby(new Set(selectedSort));
    if (selectedSortby.size > 0) {
      filterCount(1);
    } else {
      filterCount(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const optionArray: optionArrayType[] = [
    {label: t('filter:sortBy'), size: selectedSortby},
  ];

  const updateArraySortByArray = (id: number) => {
    if (selectedSortby.size > 0) {
      selectedSortby.clear();
      setSelectedSortby(new Set(selectedSortby));
      setSelectedSortby(new Set(selectedSortby.add(id)));
    } else {
      if (selectedSortby.has(id)) {
        selectedSortby.delete(id);
        setSelectedSortby(new Set(selectedSortby));
      } else {
        setSelectedSortby(new Set(selectedSortby.add(id)));
      }
    }
  };

  const clearAllFunction = () => {
    selectedSortby.clear();
    selectedSortby.add(1);
    setSelectedSortby(new Set(selectedSortby));
  };

  const styles = Styles();
  return (
    <Modal
      isVisible={isPanelActive}
      onBackdropPress={() => {
        closePanel();
      }}
      style={styles.bottomModal}
      avoidKeyboard={true}>
      <View style={[styles.bottomModalView]}>
        <Stack style={styles.flex}>
          <KeyboardAvoidingView
            behavior="height"
            style={styles.flex}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}>
            <View style={{height: Dimensions.get('screen').height * 0.63}}>
              <FilterHeader
                showClearButton={selectedSortby.size !== 0 ? true : false}
                clearAllFunction={clearAllFunction}
              />
              <Stack spacing={16} horizontal style={styles.spaceAbove}>
                <Stack>
                  <FilterMenu
                    option={option}
                    optionArray={optionArray}
                    setOption={setOption}
                  />
                </Stack>
                <Stack style={styles.subOptions}>
                  <FilterSubMenu
                    titleArray={sortByArray}
                    selectedTitles={selectedSortby}
                    updateArrayTitle={updateArraySortByArray}
                  />
                </Stack>
              </Stack>
            </View>
          </KeyboardAvoidingView>
          <FilterFooter
            closePanel={closePanel}
            applyPanel={() => {
              if (selectedSortby.size > 0) {
                filterCount(1);
              } else {
                filterCount(0);
              }
              onSelectSort!(selectedSortby);
              closePanel();
            }}
          />
        </Stack>
      </View>
    </Modal>
  );
};
