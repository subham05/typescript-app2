import Translate from 'translation/utils/translateFunction';
import * as yup from 'yup';

export const AddSubtaskSchema = () => {
  const schema = yup.object().shape({
    title: yup.string().required(Translate('addTask:titleError')),
    name: yup.string().required(Translate('addTask:nameError')),
    description: yup.string().required(Translate('addTask:descriptionError')),
    assignTo: yup.string().required(Translate('addTask:assignToError')),
    startDate: yup.string().required(Translate('addTask:startDateError')),
    dueDate: yup.string().required(Translate('addTask:dueDateError')),
    priority: yup.string().required(Translate('addTask:priorityError')),
    reportTo: yup.string().required(Translate('addTask:reportToError')),
    parentName: yup.string().required(Translate('addTask:parentNameError')),
  });
  return schema;
};
