import Translate from 'translation/utils/translateFunction';
import * as yup from 'yup';

export const CreateEventSchema = () => {
  const schema = yup.object().shape({
    subject: yup.string().required(Translate('createEvent:subjectError')),
    // description: yup
    //   .string()
    //   .required(Translate('createEvent:descriptionError')),
    startDate: yup.string().required(Translate('createEvent:dateError')),
    endDate: yup.string().required(Translate('createEvent:dateError')),
    timezone: yup.string().required(Translate('createEvent:timezoneError')),
    // startTime: yup.string().required(Translate('createEvent:timeError')),
    // endTime: yup.string().required(Translate('createEvent:timeError')),
    // venue: yup.string().required(Translate('createEvent:venueError')),
    repeatEvent: yup
      .string()
      .required(Translate('createEvent:repeatEventError')),
    reminderType: yup.string().required(Translate('createEvent:reminderError')),
    companyId: yup.string().required(Translate('addTask:companyError')),
  });
  return schema;
};
