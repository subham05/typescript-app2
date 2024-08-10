import {FilterFooter} from 'components/FilterModal/FilterFooter';
import {FilterMenu, optionArrayType} from 'components/FilterModal/FilterMenu';
import {
  CalendarRangePicker,
  MarkedDatesModel,
} from 'components/FilterModal/FilterSubMenu/CalendarRangePicker';
import {FilterSubMenu} from 'components/FilterModal/FilterSubMenu/SubMenu';
import {FilterHeader} from 'components/FilterModal/Header';
import {Stack} from 'components/Stack';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions, KeyboardAvoidingView, Platform, View} from 'react-native';
import Modal from 'react-native-modal';
import {useAppSelector} from 'store/hooks';
import {Styles} from './index.styles';

interface TaskBottomPanelModal {
  panelState: boolean;
  onPressClose: () => void;
  props: any;
  filterCount: (value: number) => void;
  setTitle: (value: masterCollectionType[]) => void;
  setPriority: (value: masterCollectionType[]) => void;
  setStatus: (value: masterCollectionType[]) => void;
  setDate: (start: string, end: string, markedDates: any) => void;
  setFilterValues?: masterFilterType;
}

export interface masterCollectionType {
  id: number;
  name: string;
  value?: string;
}

interface masterFilterType {
  Type: masterCollectionType[];
  Priority: masterCollectionType[];
  Status: masterCollectionType[];
  StartDate?: string | undefined;
  EndDate?: string | undefined;
  MarkedDates?: MarkedDatesModel;
}

export const TaskBottomPanelModal: React.FC<TaskBottomPanelModal> = ({
  panelState,
  onPressClose,
  filterCount,
  setTitle,
  setPriority,
  setStatus,
  setDate,
  setFilterValues,
}) => {
  const {t} = useTranslation();

  const [isPanelActive, setIsPanelActive] = useState(panelState);
  const {userData} = useAppSelector(state => state.formanagement);
  const masterData = userData?.masterData;

  const applyPanel = () => {
    const title = selectedTitles.has(1)
      ? titleArray.filter(item => item.name !== 'All')
      : titleArray.filter(item => selectedTitles.has(item.id));

    const priority = selectedPriority.has(1)
      ? priorityArray.filter(item => item.name !== 'All')
      : priorityArray.filter(item => selectedPriority.has(item.id));

    const status = selectedStatus.has(1)
      ? statusArray.filter(item => item.name !== 'All')
      : statusArray.filter(item => selectedStatus.has(item.id));

    let count = 0;
    if (selectedTitles.size > 0) {
      count++;
    }
    if (selectedPriority.size > 0) {
      count++;
    }
    if (selectedStatus.size > 0) {
      count++;
    }
    if (startDate?.length) {
      count++;
    }
    filterCount(count);
    setTitle(title);
    setPriority(priority);
    setStatus(status);
    setDate(startDate!, endDate!, markedDates);
    setIsPanelActive(false);
    onPressClose();
  };

  const closePanel = () => {
    setIsPanelActive(false);
    onPressClose();
  };

  const [markedDates, setMarkedDates] = useState<MarkedDatesModel | undefined>(
    {},
  );
  const [startDate, setStartDate] = useState<string | undefined>('');
  const [endDate, setEndDate] = useState<string | undefined>('');
  useEffect(() => {
    setSelectedTitles(new Set(setFilterValues?.Type?.map(item => item.id)));
    setSelectedPriority(
      new Set(setFilterValues?.Priority?.map(item => item.id)),
    );
    setSelectedStatus(new Set(setFilterValues?.Status?.map(item => item.id)));
    setStartDate(setFilterValues?.StartDate);
    setEndDate(setFilterValues?.EndDate);
    setMarkedDates(setFilterValues?.MarkedDates);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [option, setOption] = useState<string>(t('filter:title'));
  let titleArray: masterCollectionType[] = [{id: 1, name: 'All'}];
  let priorityArray: masterCollectionType[] = [];
  let statusArray: masterCollectionType[] = [{id: 1, name: 'All'}];
  if (masterData?.typeOfTask.length) {
    masterData?.typeOfTask.map((item, index) => {
      titleArray.push({id: index + 2, name: item});
    });
  }
  if (masterData?.priority.length) {
    masterData?.priority.map((item, index) => {
      priorityArray.push({id: index + 2, name: item});
    });
  }
  if (masterData?.taskStatus.length) {
    masterData?.taskStatus.map((item, index) => {
      statusArray.push({id: index + 2, name: item});
    });
  }

  const [selectedTitles, setSelectedTitles] = useState<Set<number>>(
    new Set<number>(),
  );
  const [selectedPriority, setSelectedPriority] = useState<Set<number>>(
    new Set<number>(),
  );
  const [selectedStatus, setSelectedStatus] = useState<Set<number>>(
    new Set<number>(),
  );

  const optionArray: optionArrayType[] = [
    {label: t('filter:title'), size: selectedTitles},
    {label: t('filter:priority'), size: selectedPriority},
    {label: t('filter:status'), size: selectedStatus},
    {label: t('filter:calendar'), date: startDate},
  ];

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

  const updateArrayPriority = (id: number) => {
    if (selectedPriority.has(id)) {
      selectedPriority.delete(id);
      setSelectedPriority(new Set(selectedPriority));
    } else {
      setSelectedPriority(new Set(selectedPriority.add(id)));
    }
  };

  const updateStatusArray = (id: number) => {
    if (selectedStatus.has(1) && id !== 1) {
      selectedStatus.delete(1);
      setSelectedStatus(new Set(selectedStatus));
    }
    if (selectedStatus.has(id)) {
      selectedStatus.delete(id);
      setSelectedStatus(new Set(selectedStatus));
    } else if (id === 1) {
      selectedStatus.clear();
      setSelectedStatus(new Set(selectedStatus));
      setSelectedStatus(new Set(selectedStatus.add(id)));
    } else {
      setSelectedStatus(new Set(selectedStatus.add(id)));
    }
  };

  const clearAllFunction = () => {
    selectedTitles.clear();
    selectedPriority.clear();
    selectedStatus.clear();
    setSelectedTitles(new Set(selectedTitles));
    setSelectedPriority(new Set(selectedPriority));
    setSelectedStatus(new Set(selectedStatus));
    setMarkedDates({});
    setStartDate('');
    setEndDate('');
  };

  const styles = Styles();
  return (
    <>
      <Modal
        isVisible={isPanelActive}
        onBackdropPress={() => {
          // closePanel();
          setIsPanelActive(false);
          onPressClose();
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
                    selectedTitles.size !== 0 ||
                    selectedPriority.size !== 0 ||
                    selectedStatus.size !== 0 ||
                    Object.keys(markedDates!).length !== 0
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
                    {option === t('filter:priority') ? (
                      <FilterSubMenu
                        titleArray={priorityArray}
                        selectedTitles={selectedPriority}
                        updateArrayTitle={updateArrayPriority}
                        selectAll
                      />
                    ) : option === t('filter:title') ? (
                      <FilterSubMenu
                        titleArray={titleArray}
                        selectedTitles={selectedTitles}
                        updateArrayTitle={updateArrayTitle}
                        selectAll
                      />
                    ) : option === t('filter:status') ? (
                      <FilterSubMenu
                        titleArray={statusArray}
                        selectedTitles={selectedStatus}
                        updateArrayTitle={updateStatusArray}
                        selectAll
                      />
                    ) : (
                      <CalendarRangePicker
                        startingDay={startDate}
                        endingDay={endDate}
                        markedDatesPicked={markedDates!}
                        onSelection={(start, end, marked) => {
                          setStartDate(start);
                          setEndDate(end);
                          setMarkedDates(marked);
                        }}
                      />
                    )}
                  </Stack>
                </Stack>
              </View>
            </KeyboardAvoidingView>
            <FilterFooter applyPanel={applyPanel} closePanel={closePanel} />
          </Stack>
        </View>
      </Modal>
    </>
  );
};
