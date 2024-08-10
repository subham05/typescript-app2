import {ColorStatusModal} from 'screens/Home/components/FilterModal/components/ColorStatus';
import {SequenceDataModal} from 'screens/Home/components/FilterModal/components/Sequence';

export interface customDataModal {
  chartsType: string;
  SequenceData: SequenceDataModal[];
  SequenceDataOrder: number[];
  ColorStatusData: ColorStatusModal[];
}
interface CustomdataResponsObj {
  dashboardCustomSettings: customDataModal;
}
export interface CustomDataResponse {
  data: CustomdataResponsObj;
  message: string;
}
