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
import {useCompanyListingMutation} from 'request/CompanyList';

interface TaskReportBottomPanelModal {
  panelState: boolean;
  onPressClose: () => void;
  props: any;
  filterCount: (value: number) => void;
  onApply?: (value: Set<string>) => void;
  selectedCompany?: Set<string>;
  onSelectPriorities?: (value: masterCollectionType[]) => void;
  selectedPriorities?: masterCollectionType[];
  onSelectStaff?: (value: masterCollectionType[]) => void;
  selectedStaffs?: masterCollectionType[];
  onSelectSort?: (value: masterCollectionType[]) => void;
  selectedSort?: masterCollectionType[];
  staffArray: masterCollectionType[];
}

export const TaskReportBottomPanelModal: React.FC<
  TaskReportBottomPanelModal
> = ({
  panelState,
  onPressClose,
  filterCount,
  onApply,
  selectedCompany,
  onSelectPriorities,
  selectedPriorities,
  onSelectSort,
  onSelectStaff,
  selectedSort,
  selectedStaffs,
  staffArray,
}) => {
  const {t} = useTranslation();

  const {userData, companyId} = useAppSelector(state => state.formanagement);
  const masterData = userData?.masterData;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [getCompanies, {data: companyData}] = useCompanyListingMutation({
    fixedCacheKey: 'CompaniesFilter',
  });

  const [isPanelActive, setIsPanelActive] = useState(panelState);

  const closePanel = () => {
    setIsPanelActive(false);
    onPressClose();
  };

  const [option, setOption] = useState<string>(t('filter:companies'));

  const sortByArray = [
    {id: 1, name: t('filter:recentTask'), value: 'RECENT'},
    {id: 2, name: t('filter:allTask'), value: 'ALL'},
  ];

  let priorityArray: masterCollectionType[] = [{id: 1, name: 'All'}];

  if (masterData?.priority.length) {
    masterData?.priority.map((item, index) => {
      priorityArray.push({id: index + 2, name: item});
    });
  }

  const [selectedCompanies, setSelectedCompanies] = useState<Set<string>>(
    new Set<string>(),
  );
  const [selectedPriority, setSelectedPriority] = useState<Set<number>>(
    new Set<number>(),
  );
  const [selectedStaff, setSelectedStaff] = useState<Set<number>>(
    new Set<number>(),
  );
  const [selectedSortby, setSelectedSortby] = useState<Set<number>>(
    new Set<number>(),
  );

  useEffect(() => {
    setSelectedCompanies(new Set(selectedCompany!));
    setSelectedPriority(new Set(selectedPriorities?.map(item => item.id)));
    setSelectedSortby(new Set(selectedSort?.map(item => item.id)));
    setSelectedStaff(new Set(selectedStaffs?.map(item => item.id)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const optionArray: optionArrayType[] = [
    {label: t('filter:companies'), size: selectedCompanies},
    {label: t('filter:priority'), size: selectedPriority},
    {label: t('filter:staff'), size: selectedStaff},
    {label: t('filter:sortBy'), size: selectedSortby},
  ];

  const updateArrayCompanies = (id: string) => {
    if (selectedCompanies.size === companyData?.data?.length && id === '1') {
      selectedCompanies.clear();
      setSelectedCompanies(new Set(selectedCompanies));
      companyId.map(({_id}) =>
        setSelectedCompanies(new Set(selectedCompanies.add(_id))),
      );
    } else if (
      selectedCompanies.size !== companyData?.data?.length &&
      id === '1'
    ) {
      companyData?.data?.map(({_id}) => {
        if (!selectedCompanies.has(_id)) {
          setSelectedCompanies(new Set(selectedCompanies.add(_id)));
        }
      });
    }
    if (selectedCompanies.has(id) && selectedCompanies.size > 1) {
      selectedCompanies.delete(id);
      setSelectedCompanies(new Set(selectedCompanies));
    } else if (id !== '1') {
      setSelectedCompanies(new Set(selectedCompanies.add(id)));
    }
  };

  const updateArrayPriority = (id: number) => {
    if (selectedPriority.has(id) && selectedPriority.size > 1) {
      selectedPriority.delete(id);
      setSelectedPriority(new Set(selectedPriority));
    } else {
      selectedPriority.clear();
      setSelectedPriority(new Set(selectedPriority.add(id)));
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

  const updateArraySortByArray = (id: number) => {
    if (selectedSortby.has(id)) {
      selectedSortby.delete(id);
      setSelectedSortby(new Set(selectedSortby));
    } else {
      selectedSortby.clear();
      setSelectedSortby(new Set(selectedSortby.add(id)));
    }
  };

  const clearAllFunction = () => {
    selectedCompanies.clear();
    selectedPriority.clear();
    selectedStaff.clear();
    selectedSortby.clear();
    companyId?.map(({_id}) => {
      if (!selectedCompanies.has(_id)) {
        setSelectedCompanies(new Set(selectedCompanies.add(_id)));
      }
    });
    // setSelectedCompanies(new Set(selectedCompanies));
    setSelectedPriority(new Set(selectedPriority));
    setSelectedStaff(new Set(selectedStaff));
    setSelectedSortby(new Set(selectedSortby));
    filterCount(1);
  };

  const applyPanel = () => {
    const filters = [
      selectedCompanies.size,
      selectedPriority.size,
      selectedStaff.size,
      selectedSortby.size,
    ];
    let count = 0;
    filters.map(val => val !== 0 && count++);
    filterCount(count);

    const priority = selectedPriority.has(1)
      ? [{id: 1, name: 'ALL'}]
      : priorityArray.filter(item => selectedPriority.has(item.id));

    const staff = selectedStaff.has(1)
      ? [{id: 1, name: 'All'}]
      : staffArray.filter(item => selectedStaff.has(item.id));

    const sort = sortByArray.filter(item => selectedSortby.has(item.id));

    onApply!(selectedCompanies);
    onSelectPriorities!(priority);
    onSelectStaff!(staff);
    onSelectSort!(sort);
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
                  selectedCompanies.size !== 0 ||
                  selectedPriority.size !== 0 ||
                  selectedSortby.size !== 0 ||
                  selectedStaff.size !== 0
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
                  ) : option === t('filter:priority') ? (
                    <FilterSubMenu
                      titleArray={priorityArray}
                      selectedTitles={selectedPriority}
                      updateArrayTitle={updateArrayPriority}
                      selectAll
                    />
                  ) : option === t('filter:staff') ? (
                    <FilterSubMenu
                      titleArray={staffArray}
                      selectedTitles={selectedStaff}
                      updateArrayTitle={updateArrayStaffArray}
                      selectAll
                    />
                  ) : (
                    <FilterSubMenu
                      titleArray={sortByArray}
                      selectedTitles={selectedSortby}
                      updateArrayTitle={updateArraySortByArray}
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
