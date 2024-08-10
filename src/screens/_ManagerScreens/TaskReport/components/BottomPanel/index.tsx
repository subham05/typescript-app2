import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Divider} from 'components/Divider';
import {Icon} from 'components/Icon';
import {SearchTextField} from 'components/InputView';
import {Stack, StackItem} from 'components/Stack';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions, ScrollView, TouchableOpacity, View} from 'react-native';
import {SwipeablePanel} from 'rn-swipeable-panel';
import {Styles} from './index.styles';

interface TaskReportBottomPanel {
  panelState: boolean;
  onPressClose: () => void;
  props: any;
  filterCount: (value: number) => void;
}

export const TaskReportBottomPanel: React.FC<TaskReportBottomPanel> = ({
  panelState,
  onPressClose,
  filterCount,
}) => {
  const {t} = useTranslation();

  const panelProps = {
    fullWidth: true,
    openLarge: true,
    onlyLarge: true,
    showCloseButton: false,
    onClose: () => closePanel(),
    onPressCloseButton: () => closePanel(),
    closeOnTouchOutside: true,
    scrollViewProps: {scrollEnabled: false},
    // ...or any prop you want
  };

  const [isPanelActive, setIsPanelActive] = useState(panelState);

  const closePanel = () => {
    setIsPanelActive(false);
    onPressClose();
  };

  const [option, setOption] = useState<string>('Companies');
  const companiesArray = [
    {id: 1, name: 'All Companies'},
    {id: 2, name: 'Wipro'},
    {id: 3, name: 'Starbucks'},
    {id: 4, name: 'Slack'},
    {id: 5, name: 'Jaguar'},
    {id: 6, name: 'Wolksvagan'},
    {id: 7, name: 'Wipro'},
    {id: 8, name: 'Starbucks'},
    {id: 9, name: 'Slack'},
    {id: 10, name: 'Jaguar'},
    {id: 11, name: 'Wolksvagan'},
  ];
  const priorityArray = [
    {id: 1, name: t('filter:all')},
    {id: 2, name: t('filter:emergency')},
    {id: 3, name: t('filter:high')},
    {id: 4, name: t('filter:medium')},
    {id: 5, name: t('filter:low')},
  ];
  const staffArray = [
    {id: 1, name: t('filter:all')},
    {id: 3, name: t('filter:employees')},
    {id: 4, name: t('filter:vendors_Suppliers')},
  ];
  const sortByArray = [
    {id: 1, name: t('filter:recentTask')},
    {id: 2, name: t('filter:allTask')},
  ];

  const [selectedCompanies, setSelectedCompanies] = useState<Set<number>>(
    new Set<number>(),
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

  if (
    (selectedCompanies.size > 0 &&
      selectedPriority.size === 0 &&
      selectedStaff.size === 0 &&
      selectedSortby.size === 0) ||
    (selectedCompanies.size === 0 &&
      selectedPriority.size > 0 &&
      selectedStaff.size === 0 &&
      selectedSortby.size === 0) ||
    (selectedCompanies.size === 0 &&
      selectedPriority.size === 0 &&
      selectedStaff.size > 0 &&
      selectedSortby.size === 0) ||
    (selectedCompanies.size === 0 &&
      selectedPriority.size === 0 &&
      selectedStaff.size === 0 &&
      selectedSortby.size > 0)
  ) {
    filterCount(1);
  } else if (
    (selectedCompanies.size > 0 &&
      selectedPriority.size > 0 &&
      selectedStaff.size === 0 &&
      selectedSortby.size === 0) ||
    (selectedCompanies.size > 0 &&
      selectedStaff.size > 0 &&
      selectedPriority.size === 0 &&
      selectedSortby.size === 0) ||
    (selectedCompanies.size > 0 &&
      selectedSortby.size > 0 &&
      selectedPriority.size === 0 &&
      selectedStaff.size === 0) ||
    (selectedPriority.size > 0 &&
      selectedStaff.size > 0 &&
      selectedCompanies.size === 0 &&
      selectedSortby.size === 0) ||
    (selectedPriority.size > 0 &&
      selectedSortby.size > 0 &&
      selectedCompanies.size === 0 &&
      selectedStaff.size === 0) ||
    (selectedStaff.size > 0 &&
      selectedSortby.size > 0 &&
      selectedCompanies.size === 0 &&
      selectedPriority.size === 0)
  ) {
    filterCount(2);
  } else if (
    (selectedCompanies.size > 0 &&
      selectedPriority.size > 0 &&
      selectedStaff.size > 0 &&
      selectedSortby.size === 0) ||
    (selectedCompanies.size > 0 &&
      selectedStaff.size > 0 &&
      selectedSortby.size > 0 &&
      selectedPriority.size === 0) ||
    (selectedPriority.size > 0 &&
      selectedStaff.size > 0 &&
      selectedSortby.size > 0 &&
      selectedCompanies.size === 0) ||
    (selectedSortby.size > 0 &&
      selectedPriority.size > 0 &&
      selectedCompanies.size > 0 &&
      selectedStaff.size === 0)
  ) {
    filterCount(3);
  } else if (
    selectedCompanies.size > 0 &&
    selectedPriority.size > 0 &&
    selectedStaff.size > 0 &&
    selectedSortby.size > 0
  ) {
    filterCount(4);
  } else {
    filterCount(0);
  }

  const updateArrayCompanies = (id: number) => {
    if (selectedCompanies.has(1) && id !== 1) {
      selectedCompanies.delete(1);
      setSelectedCompanies(new Set(selectedCompanies));
    }
    if (selectedCompanies.has(id)) {
      selectedCompanies.delete(id);
      setSelectedCompanies(new Set(selectedCompanies));
    } else if (id === 1) {
      selectedCompanies.clear();
      setSelectedCompanies(new Set(selectedCompanies));
      setSelectedCompanies(new Set(selectedCompanies.add(id)));
    } else {
      setSelectedCompanies(new Set(selectedCompanies.add(id)));
    }
  };

  const updateArrayPriority = (id: number) => {
    if (selectedPriority.has(1) && id !== 1) {
      selectedPriority.delete(1);
      setSelectedPriority(new Set(selectedPriority));
    }
    if (selectedPriority.has(id)) {
      selectedPriority.delete(id);
      setSelectedPriority(new Set(selectedPriority));
    } else if (id === 1) {
      selectedPriority.clear();
      setSelectedPriority(new Set(selectedPriority));
      setSelectedPriority(new Set(selectedPriority.add(id)));
    } else {
      setSelectedPriority(new Set(selectedPriority.add(id)));
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
      setSelectedSortby(new Set(selectedSortby.add(id)));
    }
  };

  const clearAllFunction = () => {
    selectedCompanies.clear();
    selectedPriority.clear();
    selectedStaff.clear();
    selectedSortby.clear();
    setSelectedCompanies(new Set(selectedCompanies));
    setSelectedPriority(new Set(selectedPriority));
    setSelectedStaff(new Set(selectedStaff));
    setSelectedSortby(new Set(selectedSortby));
    // setCompaniesArray([
    //   {name: 'All Companies', isSelected: true},
    //   {name: 'Wipro', isSelected: false},
    //   {name: 'Starbucks', isSelected: false},
    //   {name: 'Slack', isSelected: false},
    //   {name: 'Jaguar', isSelected: false},
    //   {name: 'Wolksvagan', isSelected: false},
    //   {name: 'Wipro', isSelected: false},
    //   {name: 'Starbucks', isSelected: false},
    //   {name: 'Slack', isSelected: false},
    //   {name: 'Jaguar', isSelected: false},
    //   {name: 'Wolksvagan', isSelected: false},
    // ]);
    // setPriorityArray([
    //   {name: t('filter:all'), isSelected: true},
    //   {name: t('filter:emergency'), isSelected: false},
    //   {name: t('filter:high'), isSelected: false},
    //   {name: t('filter:medium'), isSelected: false},
    //   {name: t('filter:low'), isSelected: false},
    // ]);
    // setStaffArray([
    //   {name: t('filter:all'), isSelected: true},
    //   {name: t('filter:managers'), isSelected: false},
    //   {name: t('filter:employees'), isSelected: false},
    //   {name: t('filter:vendors_Suppliers'), isSelected: false},
    // ]);
    // setSortByArray([
    //   {name: t('filter:recentTask'), isSelected: true},
    //   {name: t('filter:allTask'), isSelected: false},
    // ]);
  };

  const styles = Styles();
  return (
    <SwipeablePanel {...panelProps} isActive={isPanelActive}>
      <View style={styles.container}>
        <View style={{height: Dimensions.get('screen').height * 0.63}}>
          <Stack
            spacing={16}
            spaceBelow={16}
            horizontal
            horizontalAlign="space-between">
            <TextView weight="bold" variant={FontSizes.medium}>
              {t('filter:head')}
            </TextView>
            {(selectedCompanies.size !== 0 ||
              selectedPriority.size !== 0 ||
              selectedSortby.size !== 0 ||
              selectedStaff.size !== 0) && (
              <TextView
                weight="medium"
                variant={FontSizes.regular}
                onPress={() => clearAllFunction()}
                style={styles.clearAll}>
                {t('filter:clearAll')}
              </TextView>
            )}
          </Stack>
          <Stack style={styles.horizontalLine}>
            <Divider size={2} />
          </Stack>
          <Stack spacing={16} horizontal style={styles.spaceAbove}>
            <Stack>
              <StackItem horizontal>
                <TextView
                  weight={option === 'Companies' ? 'bold' : 'regular'}
                  variant={FontSizes.regular}
                  onPress={() => setOption('Companies')}
                  style={
                    option === 'Companies'
                      ? styles.selectedOption
                      : styles.notSelectedOption
                  }>
                  {t('filter:companies')}
                </TextView>
                {selectedCompanies.size > 0 ? (
                  <View
                    style={
                      option === 'Companies'
                        ? styles.filterDotSelected
                        : styles.filterDotNotSelected
                    }>
                    <View style={styles.filterDot} />
                  </View>
                ) : (
                  <View
                    style={
                      option === 'Companies'
                        ? styles.filterDotBlankSelected
                        : styles.filterDotBlankNotSelected
                    }
                  />
                )}
              </StackItem>
              <StackItem horizontal>
                <TextView
                  weight={option === 'Priority' ? 'bold' : 'regular'}
                  variant={FontSizes.regular}
                  onPress={() => setOption('Priority')}
                  style={
                    option === 'Priority'
                      ? styles.selectedOption
                      : styles.notSelectedOption
                  }>
                  {t('filter:priority')}
                </TextView>
                {selectedPriority.size > 0 ? (
                  <View
                    style={
                      option === 'Priority'
                        ? styles.filterDotSelected
                        : styles.filterDotNotSelected
                    }>
                    <View style={styles.filterDot} />
                  </View>
                ) : (
                  <View
                    style={
                      option === 'Priority'
                        ? styles.filterDotBlankSelected
                        : styles.filterDotBlankNotSelected
                    }
                  />
                )}
              </StackItem>
              <StackItem horizontal>
                <TextView
                  weight={option === 'Staff' ? 'bold' : 'regular'}
                  variant={FontSizes.regular}
                  onPress={() => setOption('Staff')}
                  style={
                    option === 'Staff'
                      ? styles.selectedOption
                      : styles.notSelectedOption
                  }>
                  {t('filter:staff')}
                </TextView>
                {selectedStaff.size > 0 ? (
                  <View
                    style={
                      option === 'Staff'
                        ? styles.filterDotSelected
                        : styles.filterDotNotSelected
                    }>
                    <View style={styles.filterDot} />
                  </View>
                ) : (
                  <View
                    style={
                      option === 'Staff'
                        ? styles.filterDotBlankSelected
                        : styles.filterDotBlankNotSelected
                    }
                  />
                )}
              </StackItem>
              <StackItem horizontal>
                <TextView
                  weight={option === 'Sortby' ? 'bold' : 'regular'}
                  variant={FontSizes.regular}
                  onPress={() => setOption('Sortby')}
                  style={
                    option === 'Sortby'
                      ? styles.selectedOption
                      : styles.notSelectedOption
                  }>
                  {t('filter:sortBy')}
                </TextView>
                {selectedSortby.size > 0 ? (
                  <View
                    style={
                      option === 'Sortby'
                        ? styles.filterDotSelected
                        : styles.filterDotNotSelected
                    }>
                    <View style={styles.filterDot} />
                  </View>
                ) : (
                  <View
                    style={
                      option === 'Sortby'
                        ? styles.filterDotBlankSelected
                        : styles.filterDotBlankNotSelected
                    }
                  />
                )}
              </StackItem>
            </Stack>
            <Stack style={styles.subOptions}>
              {option === 'Companies' ? (
                <ScrollView>
                  <Stack
                    horizontal
                    spaceBelow={16}
                    style={styles.attachmentView}>
                    <SearchTextField filter />
                  </Stack>
                  {companiesArray.map(({id, name}, index) => {
                    return (
                      <TouchableOpacity
                        key={index.toString()}
                        onPress={() => updateArrayCompanies(id)}>
                        <Stack horizontal>
                          {selectedCompanies.has(1) ||
                          selectedCompanies.has(id) ? (
                            <Icon
                              name="check_circle_selected"
                              size={20}
                              color={colors.primary}
                              style={styles.blankDot}
                            />
                          ) : (
                            <View style={styles.blankDot} />
                          )}
                          <TextView
                            weight={
                              selectedCompanies.has(id) ? 'bold' : 'regular'
                            }
                            variant={FontSizes.regular}
                            style={styles.selected}>
                            {name}
                          </TextView>
                        </Stack>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              ) : option === 'Priority' ? (
                <>
                  {priorityArray.map(({id, name}, index) => {
                    return (
                      <TouchableOpacity
                        key={index.toString()}
                        onPress={() => updateArrayPriority(id)}>
                        <Stack horizontal>
                          {selectedPriority.has(1) ||
                          selectedPriority.has(id) ? (
                            <Icon
                              name="check_circle_selected"
                              size={20}
                              color={colors.primary}
                              style={styles.blankDot}
                            />
                          ) : (
                            <View style={styles.blankDot} />
                          )}
                          <TextView
                            weight={
                              selectedPriority.has(id) ? 'bold' : 'regular'
                            }
                            variant={FontSizes.regular}
                            style={styles.selected}>
                            {name}
                          </TextView>
                        </Stack>
                      </TouchableOpacity>
                    );
                  })}
                </>
              ) : option === 'Staff' ? (
                <>
                  {staffArray.map(({id, name}, index) => {
                    return (
                      <TouchableOpacity
                        key={index.toString()}
                        onPress={() => updateArrayStaffArray(id)}>
                        <Stack horizontal>
                          {selectedStaff.has(1) || selectedStaff.has(id) ? (
                            <Icon
                              name="check_circle_selected"
                              size={20}
                              color={colors.primary}
                              style={styles.blankDot}
                            />
                          ) : (
                            <View style={styles.blankDot} />
                          )}
                          <TextView
                            weight={selectedStaff.has(id) ? 'bold' : 'regular'}
                            variant={FontSizes.regular}
                            style={styles.selected}>
                            {name}
                          </TextView>
                        </Stack>
                      </TouchableOpacity>
                    );
                  })}
                </>
              ) : (
                <>
                  {sortByArray.map(({id, name}, index) => {
                    return (
                      <TouchableOpacity
                        key={index.toString()}
                        onPress={() => updateArraySortByArray(id)}>
                        <Stack horizontal>
                          {selectedSortby.has(id) ? (
                            <Icon
                              name="check_circle_selected"
                              size={20}
                              color={colors.primary}
                              style={styles.blankDot}
                            />
                          ) : (
                            <View style={styles.blankDot} />
                          )}
                          <TextView
                            weight={selectedSortby.has(id) ? 'bold' : 'regular'}
                            variant={FontSizes.regular}
                            style={styles.selected}>
                            {name}
                          </TextView>
                        </Stack>
                      </TouchableOpacity>
                    );
                  })}
                </>
              )}
            </Stack>
          </Stack>
        </View>
        <Stack
          spacing={16}
          spaceBelow={16}
          horizontal
          center
          style={styles.buttonView}>
          <TouchableOpacity
            onPress={() => closePanel()}
            style={styles.loginButton}>
            <TextView
              weight="medium"
              variant={FontSizes.small}
              style={styles.login}>
              {t('filter:apply')}
            </TextView>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => closePanel()}
            style={styles.addMoreButton}>
            <TextView
              weight="medium"
              variant={FontSizes.small}
              style={styles.addMore}>
              {t('filter:close')}
            </TextView>
          </TouchableOpacity>
        </Stack>
      </View>
    </SwipeablePanel>
  );
};
