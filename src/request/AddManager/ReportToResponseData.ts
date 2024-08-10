export interface ReportToResponseData {
  success: boolean;
  message: string;
  data: ReportToResponseList[];
}

export interface ReportToResponseList {
  _id: string;
  companyId?: string[];
  name: string;
  profileUrl?: string;
  gender?: string;
  dob?: string;
  language?: string;
  role?: string;
  profile?: string;
  email?: string;
  designation?: string;
  position?: string;
}
export interface ReportToParams {
  searchText?: string;
  companyId?: string[];
  role?: string;
}
