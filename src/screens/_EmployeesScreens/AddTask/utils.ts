import Translate from 'translation/utils/translateFunction';
import * as yup from 'yup';

export const AssignTaskSubtaskSchema = () => {
  const schema = yup.object().shape({
    title: yup.string().required(Translate('addTask:titleError')),
    name: yup.string().required(Translate('addTask:nameError')),
    add: yup.string().required(Translate('addTask:addError')),
    description: yup.string().required(Translate('addTask:descriptionError')),
    startDate: yup.string().required(Translate('addTask:dateError')),
    dueDate: yup.string().required(Translate('addTask:dateError')),
    fromTime: yup.string().required(Translate('addTask:timeError')),
    Totime: yup.string().required(Translate('addTask:timeError')),
    assignTo: yup.string().required(Translate('addTask:assignToError')),
    reportTo: yup.string().required(Translate('addTask:reportToError')),
  });
  return schema;
};
