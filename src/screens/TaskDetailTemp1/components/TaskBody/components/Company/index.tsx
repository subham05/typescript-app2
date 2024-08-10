import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {InputTextField} from 'components/InputView';
import {StackItem} from 'components/Stack';
import {TaskInterface} from 'components/Task/TaskItem';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Stack} from 'stack-container';
import {Styles} from '../../index.styles';

interface CompanyTaskBodyProps {
  taskProps: TaskInterface | any;
}
export const CompanyTaskBody: React.FC<CompanyTaskBodyProps> = ({
  taskProps,
}) => {
  const {t} = useTranslation();

  const [companyName, setCompanyName] = useState<string>(
    taskProps.tasksProps.taskName,
  );

  const styles = Styles();
  return (
    <StackItem childrenGap={5} style={styles.openBox}>
      <TextView weight="regular" variant={FontSizes.small} style={styles.label}>
        {t('taskDetails:companyName')}
      </TextView>
      {taskProps.isEditable ? (
        <Stack>
          <InputTextField
            placeholder={companyName}
            onChangeText={setCompanyName}
            value={companyName}
            taskDetails
          />
        </Stack>
      ) : (
        <TextView
          weight="regular"
          variant={FontSizes.regular}
          style={styles.value}>
          {companyName}
        </TextView>
      )}
    </StackItem>
  );
};
