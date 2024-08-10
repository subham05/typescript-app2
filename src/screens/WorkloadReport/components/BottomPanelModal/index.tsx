import {FilterFooter} from 'components/FilterModal/FilterFooter';
import {FilterMenu, optionArrayType} from 'components/FilterModal/FilterMenu';
import {FilterCompany} from 'components/FilterModal/FilterSubMenu/Company';
import {FilterSubMenu} from 'components/FilterModal/FilterSubMenu/SubMenu';
import {FilterHeader} from 'components/FilterModal/Header';
import {Stack} from 'components/Stack';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions, KeyboardAvoidingView, Platform, View} from 'react-native';
import Modal from 'react-native-modal';
import {masterCollectionType} from 'screens/Manage/components/BottomPanelModal';
import {useAppSelector} from 'store/hooks';
import {Styles} from './index.styles';

interface WorkloadReportBottomPanelModal {
  panelState: boolean;
  onPressClose: () => void;
  props: any;
  filterCount: (value: number) => void;
  onApply?: (value: Set<string>) => void;
  selectedCompany?: Set<string>;
  onSelectStaff?: (value: masterCollectionType[]) => void;
  selectedStaffs?: masterCollectionType[];
  staffArray: masterCollectionType[];
}

export const WorkloadReportBottomPanelModal: React.FC<
  WorkloadReportBottomPanelModal
> = ({
  panelState,
  onPressClose,
  filterCount,
  onApply,
  onSelectStaff,
  selectedCompany,
  selectedStaffs,
  staffArray,
}) => {
  const {t} = useTranslation();

  const [isPanelActive, setIsPanelActive] = useState(panelState);
  const {companyId} = useAppSelector(state => state?.formanagement);

  const closePanel = () => {
    setIsPanelActive(false);
    onPressClose();
  };

  const [option, setOption] = useState<string>(t('filter:companies'));

  const [selectedCompanies, setSelectedCompanies] = useState<Set<string>>(
    new Set<string>(),
  );
  const [selectedStaff, setSelectedStaff] = useState<Set<number>>(
    new Set<number>(),
  );

  const optionArray: optionArrayType[] = [
    {label: t('filter:companies'), size: selectedCompanies},
    {label: t('filter:staff'), size: selectedStaff},
  ];

  useEffect(() => {
    setSelectedCompanies(new Set(selectedCompany!));
    setSelectedStaff(new Set(selectedStaffs?.map(item => item.id)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateArrayCompanies = (id: string) => {
    if (selectedCompanies.has('1') && id !== '1') {
      selectedCompanies.delete('1');
      setSelectedCompanies(new Set(selectedCompanies));
    }
    if (selectedCompanies.has(id)) {
      selectedCompanies.delete(id);
      setSelectedCompanies(new Set(selectedCompanies));
    } else if (id === '1') {
      selectedCompanies.clear();
      setSelectedCompanies(new Set(selectedCompanies));
      setSelectedCompanies(new Set(selectedCompanies.add(id)));
    } else {
      setSelectedCompanies(new Set(selectedCompanies.add(id)));
    }
  };

  const updateArrayStaffArray = (id: number) => {
    if (selectedStaff.has(id) && selectedStaff.size > 1) {
      selectedStaff.delete(id);
      setSelectedStaff(new Set(selectedStaff));
    } else {
      selectedStaff.clear();
      setSelectedStaff(new Set(selectedStaff.add(id)));
    }
  };

  const clearAllFunction = () => {
    selectedCompanies.clear();
    selectedStaff.clear();
    companyId?.map(({_id}) => {
      if (!selectedCompanies.has(_id)) {
        setSelectedCompanies(new Set(selectedCompanies.add(_id)));
      }
    });
    setSelectedStaff(new Set(selectedStaff));
    filterCount(1);
  };

  const applyPanel = () => {
    const filters = [selectedCompanies.size, selectedStaff.size];
    let count = 0;
    filters.map(val => val !== 0 && count++);
    filterCount(count);

    const staff = selectedStaff.has(1)
      ? [{id: 1, name: 'All', value: 'ALL'}]
      : staffArray.filter(item => selectedStaff.has(item.id));

    onApply!(selectedCompanies);
    onSelectStaff!(staff);
    closePanel();
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
                showClearButton={
                  selectedCompanies.size !== 0 || selectedStaff.size !== 0
                    ? true
                    : false
                }
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
                  {option === t('filter:companies') ? (
                    <FilterCompany
                      selectedCompanies={selectedCompanies}
                      updateArrayCompanies={updateArrayCompanies}
                    />
                  ) : (
                    <FilterSubMenu
                      titleArray={staffArray}
                      selectedTitles={selectedStaff}
                      updateArrayTitle={updateArrayStaffArray}
                      selectAll
                    />
                  )}
                </Stack>
              </Stack>
            </View>
          </KeyboardAvoidingView>
          <FilterFooter closePanel={closePanel} applyPanel={applyPanel} />
        </Stack>
      </View>
    </Modal>
  );
};
