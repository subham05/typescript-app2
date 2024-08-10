import {DateTimeFormats} from 'common/utils/DateTimeFormats';
import {FilterFooter} from 'components/FilterModal/FilterFooter';
import {FilterMenu, optionArrayType} from 'components/FilterModal/FilterMenu';
import {
  CalendarRangePicker,
  MarkedDatesModel,
} from 'components/FilterModal/FilterSubMenu/CalendarRangePicker';
import {FilterCompany} from 'components/FilterModal/FilterSubMenu/Company';
import {FilterHeader} from 'components/FilterModal/Header';
import {Stack} from 'components/Stack';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import {useCompanyListingMutation} from 'request/CompanyList';
import {useAppSelector} from 'store/hooks';
import {Styles} from './index.styles';

interface ActivityLogBottomPanelModal {
  panelState: boolean;
  onPressClose: () => void;
  props: any;
  filterCount: (value: number) => void;
  companylist?: Set<string>;
  setSelectedCompanyList?: (
    value?: Set<string>,
    toDate?: string,
    fromDate?: string,
    markedDate?: MarkedDatesModel,
  ) => void;
  selectedToDate?: string;
  selectedFromDate?: string;
  markedDate?: MarkedDatesModel;
}

export const ActivityLogBottomPanelModal: React.FC<
  ActivityLogBottomPanelModal
> = ({
  panelState,
  onPressClose,
  filterCount,
  companylist,
  setSelectedCompanyList,
  selectedToDate = '',
  selectedFromDate = '',
  markedDate = undefined,
}) => {
  const {t} = useTranslation();
  const [isPanelActive, setIsPanelActive] = useState(panelState);
  const [markedDates, setMarkedDates] = useState(markedDate);
  const [fromDate, setFromDate] = useState<string>(
    selectedFromDate
      ? moment(selectedFromDate).format(DateTimeFormats.YearMonthDay)
      : '',
  );
  const [toDate, setToDate] = useState<string>(
    selectedToDate
      ? moment(selectedToDate).format(DateTimeFormats.YearMonthDay)
      : '',
  );
  // const [fromDateTZ, setFromDateTZ] = useState<string>();
  // const [toDateTZ, setToDateTZ] = useState<string>();
  const {companyId} = useAppSelector(state => state?.formanagement);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [getCompanies, {data: companyData, isLoading: isLoadingCompanyData}] =
    useCompanyListingMutation({fixedCacheKey: 'CompaniesFilter'});
  const closePanel = () => {
    setIsPanelActive(false);
    onPressClose();
  };
  const applyPanel = () => {
    setSelectedCompanyList?.(
      selectedCompanies,
      toDate,
      fromDate,
      // toDateTZ,
      // fromDateTZ,
      markedDates,
    );
    setIsPanelActive(false);
    onPressClose();
  };
  const [option, setOption] = useState<string>(t('filter:companies'));

  const [selectedCompanies, setSelectedCompanies] = useState<Set<string>>(
    new Set<string>(),
  );

  const optionArray: optionArrayType[] = [
    {label: t('filter:companies'), size: selectedCompanies},
    {label: t('filter:calendar'), date: fromDate},
  ];
  useEffect(() => {
    if (panelState) {
      setSelectedCompanies(new Set(selectedCompanies));
      setSelectedCompanies(new Set(companylist!));
      // setToDateTZ(selectedToDate);
      // setFromDateTZ(selectedFromDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [panelState]);
  let count = 0;
  if (selectedCompanies.size > 0) {
    count++;
  }
  if (fromDate.length) {
    count++;
  }
  filterCount(count);

  const updateArrayCompanies = (id: string) => {
    if (selectedCompanies.size === companyData?.data?.length && id === '1') {
      selectedCompanies.clear();
      setSelectedCompanies(new Set(selectedCompanies));
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

  const clearAllFunction = () => {
    Alert.alert('At least one company is required');
    const [first] = selectedCompanies;
    setSelectedCompanies(new Set([first]));
    setFromDate('');
    // setFromDateTZ('');
    setToDate('');
    // setToDateTZ('');
    setMarkedDates(undefined);
  };
  const styles = Styles();
  return (
    <>
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
                    (markedDates && Object.keys(markedDates!)?.length !== 0)
                      ? true
                      : false
                  }
                  clearAllFunction={clearAllFunction}
                />
                <Stack horizontal style={styles.spaceAbove}>
                  <Stack>
                    <FilterMenu
                      option={option}
                      optionArray={optionArray}
                      setOption={setOption}
                    />
                  </Stack>
                  <Stack spacing={16} style={styles.subOptions}>
                    {option === t('filter:companies') ? (
                      <FilterCompany
                        selectedCompanies={selectedCompanies}
                        updateArrayCompanies={updateArrayCompanies}
                        companyIdsLength={companyId?.length}
                      />
                    ) : (
                      <CalendarRangePicker
                        startingDay={fromDate}
                        // startingDayTZ={fromDateTZ}
                        endingDay={toDate}
                        // endingDayTZ={toDateTZ}
                        markedDatesPicked={markedDates}
                        onSelection={(start, stratTZ, end, endTZ, marked) => {
                          setFromDate(start);
                          // setFromDateTZ(stratTZ);
                          setToDate(end);
                          // setToDateTZ(endTZ);
                          setMarkedDates(marked);
                        }}
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
    </>
  );
};
