export interface AddTaskModel {
  company: string;
  title: string;
  //add: string;
  name: string;
  description: string;
  recording?: string;
  assignTo: string;
  reportTo: string;
  relatedTaskName?: string;
  startDate: string;
  dueDate: string;
  startTime: string;
  dueTime: string;
  priority: string;
  isCritical: boolean;
  documentId?: string;
  emailId?: string;
  //file: string;
}

export interface TitleModel {
  title: string;
  _id: string;
}
