export enum HomeScreenStrings {
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  QUARTER = 'QUARTER',
  YEAR = 'YEAR',
  CUSTOM = 'CUSTOM',
  Daily = 'Daily',
  lastWeek = 'Last week',
  lastMonth = 'Last month',
  lastQuarter = 'Last quarter',
  lastYear = 'Last year',
  customDate = 'Custom date',
}

export const allFilterData = [
  {label: HomeScreenStrings.Daily, value: HomeScreenStrings.DAY},
  {label: HomeScreenStrings.lastWeek, value: HomeScreenStrings.WEEK},
  {label: HomeScreenStrings.lastMonth, value: HomeScreenStrings.MONTH},
  {label: HomeScreenStrings.lastQuarter, value: HomeScreenStrings.QUARTER},
  {label: HomeScreenStrings.lastYear, value: HomeScreenStrings.YEAR},
  {label: HomeScreenStrings.customDate, value: HomeScreenStrings.CUSTOM},
];
