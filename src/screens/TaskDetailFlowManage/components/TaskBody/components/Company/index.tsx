import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {DropdownPicker} from 'components/DropdownPicker';
import {CompanyProps} from 'components/SelectCompany/CompanyListView';
import {StackItem} from 'components/Stack';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useGetCompanyListQuery} from 'request/AddManager';
// import {useGetCompanyCollectionQuery} from 'request/AddTask';
import {TaskDetails} from 'request/ManageTask';
import {DropDownModel} from 'screens/AddTask';
import {Stack} from 'stack-container';
import {Styles} from '../../index.styles';

interface CompanyTaskBodyProps {
  taskProps?: TaskDetails;
  isEditable: boolean | undefined;
  onCompanyChange: (value: string) => void;
}
export const CompanyTaskBody: React.FC<CompanyTaskBodyProps> = ({
  taskProps,
  isEditable,
  onCompanyChange,
}) => {
  const {t} = useTranslation();

  const {data: companyResponse} = useGetCompanyListQuery();
  const [allCompanyData, setAllCompanyData] = useState<DropDownModel[]>([]);
  const [companyValue, setCompanyValue] = useState<string>();
  const [companyLabel, setCompanyLabel] = useState<string>();
  useEffect(() => {
    if (companyResponse) {
      let companyData: DropDownModel[] = [];
      companyResponse.map((item: CompanyProps) =>
        companyData.push({
          label: item.name,
          value: item._id,
        }),
      );
      setAllCompanyData(companyData);
    }
  }, [companyResponse]);

  useEffect(() => {
    if (companyResponse?.length && taskProps?._id) {
      // item => item._id === taskProps.company._id,
      let companyName = companyResponse.find(
        item => item._id === taskProps.company._id,
      )?.name;
      setCompanyLabel(companyName);
    }
  }, [companyResponse, taskProps]);

  useEffect(() => {
    if (taskProps?.company?._id && taskProps?.company?.name) {
      setCompanyValue(taskProps?.company?._id!);
      setCompanyLabel(taskProps?.company?.name!);
    }
  }, [taskProps]);

  // temporary change for Old company key
  // useEffect(() => {
  //   if (taskProps?.company) {
  //     setCompanyValue(taskProps?.company!);
  //     // setCompanyLabel(taskProps?.companyName!);
  //   }
  // }, [taskProps]);

  const styles = Styles();
  return (
    <>
      {!isEditable ? (
        <StackItem childrenGap={5} style={styles.openBox}>
          <TextView
            weight="regular"
            variant={FontSizes.small}
            style={styles.label}>
            {t('taskDetails:companyName')}
          </TextView>
          <TextView
            weight="regular"
            variant={FontSizes.regular}
            style={styles.value}>
            {companyLabel}
          </TextView>
        </StackItem>
      ) : (
        <Stack spaceBelow={16}>
          <DropdownPicker
            options={allCompanyData}
            value={companyValue}
            onChange={(val: DropDownModel) => {
              setCompanyValue(val.value);
              setCompanyLabel(val.label);
              onCompanyChange(val.value);
            }}
            // onSelect={(val: DropDownModel) => {
            //   setCompanyValue(val.value);
            //   setCompanyLabel(val.label);
            //   onCompanyChange(val.value);
            // }}
            placeholder={t('addTask:companyDropdownPlaceholder')}
          />
        </Stack>
      )}
    </>
  );
};
