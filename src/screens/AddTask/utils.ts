import Translate from 'translation/utils/translateFunction';
import * as yup from 'yup';

export const AssignTaskSubtaskSchema = () => {
  const schema = yup.object().shape({
    company: yup.string().required(Translate('addTask:companyError')),
    title: yup.string().required(Translate('addTask:titleError')),
    name: yup.string().trim().required(Translate('addTask:nameError')),
    //add: yup.string().required(Translate('addTask:addError')),
    description: yup
      .string()
      .trim()
      .required(Translate('addTask:descriptionError')),
    assignTo: yup.string().required(Translate('addTask:assignToError')),
    // relatedTaskName: yup
    //   .string()
    //   .required(Translate('addTask:relatedTaskError')),
    startDate: yup.string().required(Translate('addTask:startDateError')),
    dueDate: yup.string().required(Translate('addTask:dueDateError')),
    //startTime: yup.string().required(Translate('addTask:startTimeError')),
    //dueTime: yup.string().required(Translate('addTask:dueTimeError')),
    priority: yup.string().required(Translate('addTask:priorityError')),
    reportTo: yup.string().required(Translate('addTask:reportToError')),
  });
  return schema;
};
