import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {globalScreenWidth} from 'common/utils/ScreenDimensions';
import {TextView} from 'components';
import {DropdownPicker} from 'components/DropdownPicker';
import {Stack, StackItem} from 'components/Stack';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity, View} from 'react-native';
import {RiskFactorData} from 'request/Dashboard';
import {allFilterData, HomeScreenStrings} from 'screens/Home/constants';
import {VictoryPie} from 'victory-native';
import {Styles} from './index.styles';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

interface RiskFactorProps {
  data: RiskFactorData;
  onClickCustom?: () => void;
  typeChart?: string;
  onFilterChange?: (value: string) => void;
  onDateSelect?: (value: string) => void;
  isGraphEmpty: boolean;
}
export const RiskFactorHomeScreen: React.FC<RiskFactorProps> = ({
  data,
  isGraphEmpty,
  onDateSelect,
  onFilterChange,
  onClickCustom,
}) => {
  const tempChartData = data?.graphData?.map(item => {
    let obj;
    if (item.y !== 0) {
      obj = {x: item.x, y: item.y};
      return obj !== undefined ? obj : {};
    }
  });

  const chartData = tempChartData?.filter(element => {
    return element !== undefined;
  });

  const [filter, setFilter] = useState<string>(HomeScreenStrings.MONTH);
  const [isDatePickerVisible, setDatePickerVisibility] =
    useState<boolean>(false);

  const handleConfirm = (pickedDate: Date) => {
    hideDatePicker();
    onFilterChange?.(filter);
    onDateSelect?.(pickedDate.toISOString());
  };

  const hideDatePicker = () => setDatePickerVisibility(false);

  const showDatePicker = () => setDatePickerVisibility(true);

  const styles = Styles();

  const {t} = useTranslation();
  return (
    <>
      <Stack spaceBelow={16} style={styles.chartView}>
        <Stack style={styles.chart}>
          <Stack style={styles.pieChart}>
            <VictoryPie
              style={{
                data: {
                  fill: ({datum}) =>
                    isGraphEmpty
                      ? colors.grey_002
                      : datum.x === 1
                      ? data?.legendsColor.lowRisk
                      : datum.x === 2
                      ? data?.legendsColor.mediumRisk
                      : data?.legendsColor.highRisk,
                },
              }}
              // events={[
              //   {
              //     target: 'data',
              //     eventHandlers: {
              //       onPress: () => {
              //         return [
              //           {
              //             target: 'labels',
              //             mutation: props => {
              //               console.log('Second', props);
              //               return props.text === 'clicked'
              //                 ? null
              //                 : console.log('first logged');
              //             },
              //           },
              //         ];
              //       },
              //     },
              //   },
              // ]}
              standalone={true}
              width={globalScreenWidth / 1}
              height={globalScreenWidth / 2}
              innerRadius={72}
              data={isGraphEmpty ? [{x: 'No data', y: 100}] : chartData}
              labelPosition={'centroid'}
              labelPlacement={'vertical'}
              labels={({datum}) => {
                return isGraphEmpty
                  ? 'No data'
                  : datum.y !== 0
                  ? datum.y + '%'
                  : '';
              }}
              labelRadius={80}
            />
          </Stack>
          <Stack spacing={40} style={styles.statusView}>
            <Stack horizontal horizontalAlign="space-between">
              <Stack horizontal>
                <View
                  style={[
                    styles.assignedDot,
                    {backgroundColor: data?.legendsColor.lowRisk},
                  ]}
                />
                <TextView weight="regular" variant={FontSizes.xSmall}>
                  {t('homePage:lowRisk')}
                </TextView>
              </Stack>
              <Stack horizontal>
                <View
                  style={[
                    styles.inprogressDot,
                    {backgroundColor: data?.legendsColor.mediumRisk},
                  ]}
                />
                <TextView weight="regular" variant={FontSizes.xSmall}>
                  {t('homePage:mediumRisk')}
                </TextView>
              </Stack>
              <Stack horizontal>
                <View
                  style={[
                    styles.resolvedDot,
                    {backgroundColor: data?.legendsColor.highRisk},
                  ]}
                />
                <TextView weight="regular" variant={FontSizes.xSmall}>
                  {t('homePage:highRisk')}
                </TextView>
              </Stack>
            </Stack>
          </Stack>
          <StackItem
            horizontal
            horizontalAlign="flex-end"
            childrenGap={10}
            verticalAlign="center"
            style={styles.filterMenu}>
            <DropdownPicker
              value={filter}
              options={allFilterData}
              onChange={item => {
                setFilter(item.value);
                if (item.value === HomeScreenStrings.CUSTOM) {
                  showDatePicker();
                } else {
                  onDateSelect?.('');
                  onFilterChange?.(item.value);
                }
              }}
              placeholder={t('homePage:dropdownPlaceholder')}
              style={styles.dropdown}
              radioOptions
              optionsFontsize={FontSizes.xSmall}
              fontSize={FontSizes.small}
              textPrimaryColor
              optionsIconSize={18}
            />
            <TouchableOpacity onPress={onClickCustom}>
              <TextView
                weight="medium"
                variant={FontSizes.regular}
                style={{color: colors.primary_007}}>
                {t('homePage:custom')}
              </TextView>
            </TouchableOpacity>
          </StackItem>
          {filter === HomeScreenStrings.CUSTOM && (
            <View>
              <DateTimePickerModal
                date={new Date()}
                isVisible={isDatePickerVisible}
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
              />
            </View>
          )}
        </Stack>
      </Stack>
    </>
  );
};
