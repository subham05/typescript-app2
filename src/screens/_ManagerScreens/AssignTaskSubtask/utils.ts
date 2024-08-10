import Translate from 'translation/utils/translateFunction';
import * as yup from 'yup';
export const AssignTaskSubtaskSchema = () => {
  const schema = yup.object().shape({
    company: yup.string().required(Translate('assign:companyError')),
    title: yup.string().required(Translate('assign:titleError')),
    name: yup.string().required(Translate('assign:nameError')),
    add: yup.string().required(Translate('assign:addError')),
    description: yup.string().required(Translate('assign:descriptionError')),
    assignTo: yup.string().required(Translate('assign:assignToError')),
    startDate: yup.string().required(Translate('assign:startDateError')),
    dueDate: yup.string().required(Translate('assign:dueDateError')),
    priority: yup.string().required(Translate('assign:priorityError')),
    reportTo: yup.string().required(Translate('assign:reportToError')),
  });
  return schema;
};
