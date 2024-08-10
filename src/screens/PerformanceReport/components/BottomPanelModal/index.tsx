import {FilterFooter} from 'components/FilterModal/FilterFooter';
import {FilterMenu, optionArrayType} from 'components/FilterModal/FilterMenu';
import {FilterCompany} from 'components/FilterModal/FilterSubMenu/Company';
import {FilterSubMenu} from 'components/FilterModal/FilterSubMenu/SubMenu';
import {FilterHeader} from 'components/FilterModal/Header';
import {Stack} from 'components/Stack';
import React, {useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions, KeyboardAvoidingView, Platform, View} from 'react-native';
import Modal from 'react-native-modal';
import {useCompanyListingMutation} from 'request/CompanyList';
import {masterCollectionType} from 'screens/Manage/components/BottomPanelModal';
import {useAppSelector} from 'store/hooks';
import {Styles} from './index.styles';

interface PerformanceReportBottomPanelModal {
  panelState: boolean;
  onPressClose: () => void;
  props: any;
  filterCount: (value: number) => void;
  onApply?: (value: Set<string>) => void;
  selectedCompany?: Set<string>;
  onSelectTitle?: (value: Set<number>) => void;
  selectedTitle?: masterCollectionType[];
  onSelectStaff?: (value: Set<number>) => void;
  selectedStaffs?: masterCollectionType[];
  onSelectSort?: (value: Set<number>) => void;
  selectedSort?: masterCollectionType[];
}

export const PerformanceReportBottomPanelModal: React.FC<
  PerformanceReportBottomPanelModal
> = ({
  panelState,
  onPressClose,
  filterCount,
  onApply,
  onSelectSort,
  onSelectStaff,
  onSelectTitle,
  selectedCompany,
  selectedSort,
  selectedStaffs,
  selectedTitle,
}) => {
  const {t} = useTranslation();

  const {userData, companyId} = useAppSelector(state => state.formanagement);
  const masterData = userData?.masterData;

  const [isPanelActive, setIsPanelActive] = useState(panelState);

  const closePanel = () => {
    setIsPanelActive(false);
    onPressClose();
  };

  const [option, setOption] = useState<string>(t('filter:companies'));

  const [, {data: companyData}] = useCompanyListingMutation({
    fixedCacheKey: 'CompaniesFilter',
  });

  const roleArray = useMemo(() => {
    let roleVal = [{id: 1, name: t('filter:all')}];
    if (userData?.performance) {
      roleVal = roleVal.concat(
        userData.performance.map((item, index) => ({
          id: index + 2,
          name: item.charAt(0).toUpperCase() + item.slice(1).toLowerCase(),
        })),
      );
    }
    return roleVal;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  const sortByArray = [
    {id: 1, name: t('filter:ascending')},
    {id: -1, name: t('filter:descending')},
  ];

  const [selectedCompanies, setSelectedCompanies] = useState<Set<string>>(
    new Set<string>(),
  );
  const [selectedTitles, setSelectedTitles] = useState<Set<number>>(
    new Set<number>(),
  );
  const [selectedStaff, setSelectedStaff] = useState<Set<number>>(
    new Set<number>(),
  );
  const [selectedSortby, setSelectedSortby] = useState<Set<number>>(
    new Set<number>(),
  );

  const optionArray: optionArrayType[] = [
    {label: t('filter:companies'), size: selectedCompanies},
    {label: t('filter:title'), size: selectedTitles},
    {label: t('filter:staff'), size: selectedStaff},
    {label: t('filter:sortBy'), size: selectedSortby},
  ];

  let titleArray: masterCollectionType[] = [{id: 1, name: t('filter:all')}];

  if (masterData?.typeOfTask.length) {
    masterData?.typeOfTask.map((item, index) => {
      titleArray.push({id: index + 2, name: item});
    });
  }

  useEffect(() => {
    setSelectedCompanies(new Set(selectedCompany!));
    setSelectedTitles(new Set(selectedTitle?.map(item => item?.id)));
    setSelectedSortby(new Set(selectedSort?.map(item => item?.id)));
    setSelectedStaff(new Set(selectedStaffs?.map(item => item?.id)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const updateArrayTitle = (id: number) => {
    if (selectedTitles.has(1) && id !== 1) {
      selectedTitles.delete(1);
      setSelectedTitles(new Set(selectedTitles));
    }
    if (selectedTitles.has(id)) {
      selectedTitles.delete(id);
      setSelectedTitles(new Set(selectedTitles));
    } else if (id === 1) {
      selectedTitles.clear();
      setSelectedTitles(new Set(selectedTitles));
      setSelectedTitles(new Set(selectedTitles.add(id)));
    } else {
      setSelectedTitles(new Set(selectedTitles.add(id)));
    }
  };

  const updateArrayStaffArray = (id: number) => {
    if (selectedStaff.has(1) && id !== 1) {
      selectedStaff.delete(1);
      setSelectedStaff(new Set(selectedStaff));
    }
    if (selectedStaff.has(id)) {
      selectedStaff.delete(id);
      setSelectedStaff(new Set(selectedStaff));
    } else if (id === 1) {
      selectedStaff.clear();
      setSelectedStaff(new Set(selectedStaff));
      setSelectedStaff(new Set(selectedStaff.add(id)));
    } else {
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
    // selectedTitles.clear();
    selectedStaff.clear();
    // selectedSortby.clear();
    companyId?.map(({_id}) => {
      if (!selectedCompanies.has(_id)) {
        setSelectedCompanies(new Set(selectedCompanies.add(_id)));
      }
    });
    setSelectedTitles(new Set(selectedTitles));
    setSelectedStaff(new Set(selectedStaff));
    setSelectedTitles(new Set([2]));
    // setSelectedSortby(new Set(selectedSortby));
    filterCount(3);
  };

  const applyPanel = () => {
    const filters = [
      selectedCompanies.size,
      selectedTitles.size,
      selectedStaff.size,
      selectedSortby.size,
    ];
    let count = 0;
    filters.map(val => val !== 0 && count++);
    filterCount(count);
    const staff = selectedStaff.has(1)
      ? roleArray?.filter(item => item.name !== t('filter:all'))
      : roleArray?.filter(item => selectedStaff.has(item?.id));

    const title = selectedTitles?.has(1)
      ? titleArray?.filter(item => item.name !== t('filter:all'))
      : titleArray?.filter(item => selectedTitles?.has(item?.id));

    const sortBy = sortByArray?.filter(item =>
      selectedSortby?.has(item?.id),
    ) || [{id: 1, name: t('filter:ascending')}];
    onApply!(selectedCompanies);
    onSelectTitle!(title);
    onSelectStaff!(staff);
    onSelectSort!(sortBy);
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
                  selectedTitles.size !== 0 ||
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
                  ) : option === t('filter:title') ? (
                    <FilterSubMenu
                      titleArray={titleArray}
                      selectedTitles={selectedTitles}
                      updateArrayTitle={updateArrayTitle}
                      selectAll
                    />
                  ) : option === t('filter:staff') ? (
                    <FilterSubMenu
                      titleArray={roleArray}
                      selectedTitles={selectedStaff}
                      updateArrayTitle={updateArrayStaffArray}
                      selectAll
                    />
                  ) : (
                    <FilterSubMenu
                      titleArray={sortByArray}
                      selectedTitles={selectedSortby}
                      updateArrayTitle={updateArraySortByArray}
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
