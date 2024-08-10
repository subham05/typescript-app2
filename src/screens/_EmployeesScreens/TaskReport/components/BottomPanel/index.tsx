import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Divider} from 'components/Divider';
import {Icon} from 'components/Icon';
import {Stack, StackItem} from 'components/Stack';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions, TouchableOpacity, View} from 'react-native';
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

  const [option, setOption] = useState<string>('Priority');

  const priorityArray = [
    {id: 1, name: t('filter:all')},
    {id: 2, name: t('filter:emergency')},
    {id: 3, name: t('filter:high')},
    {id: 4, name: t('filter:medium')},
    {id: 5, name: t('filter:low')},
  ];
  const sortByArray = [
    {id: 1, name: t('filter:recentTask')},
    {id: 2, name: t('filter:allTask')},
  ];

  const [selectedPriority, setSelectedPriority] = useState<Set<number>>(
    new Set<number>(),
  );
  const [selectedSortby, setSelectedSortby] = useState<Set<number>>(
    new Set<number>(),
  );

  if (selectedPriority.size > 0 && selectedSortby.size === 0) {
    filterCount(1);
  } else if (selectedPriority.size === 0 && selectedSortby.size > 0) {
    filterCount(1);
  } else if (selectedPriority.size > 0 && selectedSortby.size > 0) {
    filterCount(2);
  } else {
    filterCount(0);
  }

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

  const updateArraySortByArray = (id: number) => {
    if (selectedSortby.has(id)) {
      selectedSortby.delete(id);
      setSelectedSortby(new Set(selectedSortby));
    } else {
      setSelectedSortby(new Set(selectedSortby.add(id)));
    }
  };

  const clearAllFunction = () => {
    selectedPriority.clear();
    selectedSortby.clear();
    setSelectedPriority(new Set(selectedPriority));
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
            {(selectedPriority.size !== 0 || selectedSortby.size !== 0) && (
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
            <Divider />
          </Stack>
          <Stack spacing={16} horizontal style={styles.spaceAbove}>
            <Stack>
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
              {option === 'Priority' ? (
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
