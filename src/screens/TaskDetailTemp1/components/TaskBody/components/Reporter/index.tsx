import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Divider} from 'components/Divider';
import {InputTextField} from 'components/InputView';
import {StackItem} from 'components/Stack';
import {TaskInterface} from 'components/Task/TaskItem';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Styles} from '../../index.styles';

interface ReporterTaskBodyProps {
  taskProps: TaskInterface | any;
}
export const ReporterTaskBody: React.FC<ReporterTaskBodyProps> = ({
  taskProps,
}) => {
  const {t} = useTranslation();

  const [reporterName, setReporterName] = useState<string>(
    taskProps.tasksProps.assigneeName,
  );
  const [reporterDesignation, setReporterDesignation] =
    useState<string>('Manager');

  const styles = Styles();
  return (
    <StackItem childrenGap={5} style={styles.openBox}>
      <TextView weight="regular" variant={FontSizes.small} style={styles.label}>
        {t('taskDetails:reporterName')}
      </TextView>
      {taskProps.isEditable ? (
        <InputTextField
          placeholder={reporterName}
          onChangeText={setReporterName}
          value={reporterName}
          taskDetails
        />
      ) : (
        <TextView
          weight="regular"
          variant={FontSizes.regular}
          style={styles.value}>
          {reporterName}
        </TextView>
      )}
      <Divider />
      <TextView weight="regular" variant={FontSizes.small} style={styles.label}>
        {t('taskDetails:designationReporter')}
      </TextView>
      {taskProps.isEditable ? (
        <InputTextField
          placeholder={reporterDesignation}
          onChangeText={setReporterDesignation}
          value={reporterDesignation}
          taskDetails
        />
      ) : (
        <TextView
          weight="regular"
          variant={FontSizes.regular}
          style={styles.value}>
          {reporterDesignation}
        </TextView>
      )}
    </StackItem>
  );
};
