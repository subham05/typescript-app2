import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {DropdownPicker} from 'components/DropdownPicker';
import {Stack, StackItem} from 'components/Stack';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions, TouchableOpacity, View} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {TaskProgressData} from 'request/Dashboard';
import {HomeScreenStrings} from 'screens/Home/constants';
import {useAppSelector} from 'store/hooks';
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLine,
  VictoryPie,
  VictoryTheme,
  VictoryTooltip,
} from 'victory-native';
import {Styles} from '../../index.styles';
import StackBarGraph from '../StackBarGraph';

export enum chartsType {
  Bar = 'Bar',
  StackBar = 'StackBar',
  Line = 'Line',
  Pie = 'Pie',
  PieWithInnerRadius = 'PieWithInnerRadius',
}
interface ChartProps {
  data: TaskProgressData;
  onClickCustom: () => void;
  typeChart: string;
  onFilterChange: (value: string) => void;
  onDateSelect?: (value: string) => void;
}
export const ChartHomeScreen: React.FC<ChartProps> = ({
  data,
  onClickCustom,
  typeChart,
  onFilterChange,
  onDateSelect,
}) => {
  const blankChartData = [
    // {x: 1, y: 0},
    {x: 2, y: 0},
    {x: 3, y: 0},
    {x: 4, y: 0},
    {x: 5, y: 0},
    {x: 6, y: 0},
  ];
  const chartData = data?.[0]?.graphData?.map(item => {
    const obj = {x: item.x, y: item.y};
    return obj;
  });

  const {userData} = useAppSelector(state => state?.formanagement);

  const [filter, setFilter] = useState<string>('MONTH');
  const [isDatePickerVisible, setDatePickerVisibility] =
    useState<boolean>(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (pickedDate: Date) => {
    // setDate(pickedDate.toISOString());
    hideDatePicker();
    onFilterChange(filter);
    onDateSelect?.(pickedDate.toISOString());
  };

  const allFilterData = [
    {label: HomeScreenStrings.Daily, value: HomeScreenStrings.DAY},
    {label: HomeScreenStrings.lastWeek, value: HomeScreenStrings.WEEK},
    {label: HomeScreenStrings.lastMonth, value: HomeScreenStrings.MONTH},
    {label: HomeScreenStrings.lastQuarter, value: HomeScreenStrings.QUARTER},
    {label: HomeScreenStrings.lastYear, value: HomeScreenStrings.YEAR},
    {label: HomeScreenStrings.customDate, value: HomeScreenStrings.CUSTOM},
  ];

  // const [chartType] = useState<string>(typeChart);

  const styles = Styles();

  const {t} = useTranslation();

  return (
    <>
      <Stack spaceBelow={16} style={styles.chartView}>
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
                onFilterChange(item.value);
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
          {userData?.role.type === 'OWNER' && (
            <TouchableOpacity onPress={onClickCustom}>
              <TextView
                weight="medium"
                variant={FontSizes.regular}
                style={{color: colors.primary_007}}>
                {t('homePage:custom')}
              </TextView>
            </TouchableOpacity>
          )}
        </StackItem>
        <Stack style={styles.chart}>
          {typeChart === chartsType.Bar ? (
            <VictoryChart theme={VictoryTheme.material} domainPadding={{x: 1}}>
              <VictoryBar
                style={{
                  data: {
                    fill: ({datum}) =>
                      // datum.x === 1
                      //   ? data?.[0]?.legendsColor.assigned
                      //   :
                      datum.x === 2
                        ? data?.[0]?.legendsColor.inprogress
                        : datum.x === 3
                        ? data?.[0]?.legendsColor.resolved
                        : datum.x === 4
                        ? data?.[0]?.legendsColor.completed
                        : datum.x === 5
                        ? data?.[0]?.legendsColor.overdue
                        : data?.[0]?.legendsColor.reopened,
                  },
                }}
                data={
                  chartData?.length ? chartData.slice(1, 6) : blankChartData
                }
                labels={({datum}) => datum.y + '%'}
              />
              <VictoryAxis
                style={{
                  axis: {stroke: 'transparent'},
                  ticks: {stroke: 'transparent'},
                  tickLabels: {fill: 'transparent'},
                  grid: {stroke: 'transparent'},
                }}
              />
            </VictoryChart>
          ) : typeChart === chartsType.StackBar ? (
            <StackBarGraph data={data} />
          ) : typeChart === chartsType.Line ? (
            <Stack style={styles.lineChart}>
              <VictoryChart
                theme={VictoryTheme.material}
                domainPadding={{x: 0}}>
                <VictoryLine
                  style={{
                    data: {
                      stroke: colors.primary,
                      // strokeWidth: 15,
                      // strokeLinecap: 'round',
                    },
                    // axis: {stroke: 'transparent'},
                  }}
                  data={
                    chartData?.length ? chartData.slice(1, 6) : blankChartData
                  }
                  labels={({datum}) => datum.y}
                />
              </VictoryChart>
            </Stack>
          ) : typeChart === chartsType.Pie ? (
            <Stack style={styles.pieChart}>
              <VictoryPie
                colorScale={Object.values(data[0].legendsColor)}
                standalone={true}
                width={Dimensions.get('screen').width / 1}
                height={Dimensions.get('screen').width / 1.4}
                data={
                  chartData?.length ? chartData.slice(1, 6) : blankChartData
                }
                labels={({datum}) => datum.y + '%'}
                labelRadius={100}
                style={{labels: {fill: colors.white}}}
                events={[
                  {
                    target: 'data',
                    eventHandlers: {
                      onPressIn: () => {
                        return [
                          {
                            target: 'labels',
                            eventKey: 'all',
                            mutation: () => ({active: false}),
                          },
                        ];
                      },
                      onPressOut: () => {
                        return [
                          {
                            target: 'labels',
                            mutation: () => ({active: true}),
                          },
                        ];
                      },
                    },
                  },
                ]}
                labelComponent={
                  <VictoryTooltip
                    // eslint-disable-next-line react-native/no-inline-styles
                    flyoutStyle={{
                      stroke: colors?.primary,
                      strokeOpacity: 0.4,
                      fill: colors.black,
                    }}
                  />
                }
              />
            </Stack>
          ) : (
            <Stack style={styles.pieChart}>
              <VictoryPie
                colorScale={Object.values(data[0].legendsColor)}
                standalone={true}
                width={Dimensions.get('screen').width / 1}
                height={Dimensions.get('screen').width / 2}
                innerRadius={72}
                data={
                  chartData?.length ? chartData.slice(1, 6) : blankChartData
                }
                labelPosition={'centroid'}
                labelPlacement={'vertical'}
                labels={({datum}) => datum.y + '%'}
                labelRadius={80}
                style={{labels: {fill: colors.white}}}
                events={[
                  {
                    target: 'data',
                    eventHandlers: {
                      onPressIn: () => {
                        return [
                          {
                            target: 'labels',
                            eventKey: 'all',
                            mutation: () => ({active: false}),
                          },
                        ];
                      },
                      onPressOut: () => {
                        return [
                          {
                            target: 'labels',
                            mutation: () => ({active: true}),
                          },
                        ];
                      },
                    },
                  },
                ]}
                labelComponent={
                  <VictoryTooltip
                    // eslint-disable-next-line react-native/no-inline-styles
                    flyoutStyle={{
                      stroke: colors?.primary,
                      strokeOpacity: 0.4,
                      fill: colors.black,
                    }}
                  />
                }
              />
            </Stack>
          )}

          <Stack
            horizontal
            horizontalAlign="space-between"
            style={styles.mainLegendView}>
            <StackItem childrenGap={15}>
              <Stack horizontal>
                <View
                  style={[
                    styles.inprogressDot,
                    {backgroundColor: data?.[0]?.legendsColor.inprogress},
                  ]}
                />
                <TextView weight="regular" variant={FontSizes.xSmall}>
                  {t('homePage:inProgress')}
                </TextView>
              </Stack>
              <Stack horizontal>
                <View
                  style={[
                    styles.overdueDot,
                    {backgroundColor: data?.[0]?.legendsColor.overdue},
                  ]}
                />
                <TextView weight="regular" variant={FontSizes.xSmall}>
                  {t('homePage:overdue')}
                </TextView>
              </Stack>
            </StackItem>

            <StackItem childrenGap={15}>
              <Stack horizontal>
                <View
                  style={[
                    styles.resolvedDot,
                    {backgroundColor: data?.[0]?.legendsColor.resolved},
                  ]}
                />
                <TextView weight="regular" variant={FontSizes.xSmall}>
                  {t('homePage:resolved')}
                </TextView>
              </Stack>
              <Stack horizontal>
                <View
                  style={[
                    styles.reopenedDot,
                    {backgroundColor: data?.[0]?.legendsColor.reopened},
                  ]}
                />
                <TextView weight="regular" variant={FontSizes.xSmall}>
                  {t('homePage:reOpened')}
                </TextView>
              </Stack>
            </StackItem>

            <Stack>
              <Stack horizontal>
                <View
                  style={[
                    styles.completedDot,
                    {backgroundColor: data?.[0]?.legendsColor.completed},
                  ]}
                />
                <TextView weight="regular" variant={FontSizes.xSmall}>
                  {t('homePage:complete')}
                </TextView>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Stack>

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
    </>
  );
};
