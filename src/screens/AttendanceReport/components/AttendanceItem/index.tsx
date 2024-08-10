import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import moment, {Moment} from 'moment';
import React from 'react';
import {attendanceReportData} from 'request/AttendanceReport/types';
import {Stack} from 'stack-container';
import AttendanceWeek from '../AttendanceWeek';

interface AttendanceReportItemProps {
  data: attendanceReportData;
  currentDate?: {date: string | undefined};
  isDisabled: boolean;
  onLeaveApply: (val: string) => void;
  selectedDate: Moment;
}

export interface AttendanceModel {
  date: string;
  day: string;
  checkIn?: string | null;
  checkInLocation?: string | null;
  checkOut?: string | null;
  checkOutLocation?: string | null;
  workingHours?: string | null;
  holiday?: boolean;
  isLeave?: boolean;
  isAbsent?: boolean;
}

export interface AttendanceReportModel {
  range?: string;
  nodes: AttendanceModel[];
}

export const AttendanceReportItem: React.FC<AttendanceReportItemProps> = ({
  data,
  currentDate,
  isDisabled,
  onLeaveApply,
  selectedDate,
}) => {
  return (
    <Stack>
      <Stack spaceBelow={10}>
        {moment(data.startDate).isSameOrBefore(
          moment(selectedDate).endOf('month'),
        ) && (
          <TextView weight="regular" variant={FontSizes.regular}>
            {data?.range}
          </TextView>
        )}
      </Stack>
      {[...data?.weekData].map((item, index) => {
        if (
          (moment(item.date).isBefore(moment(currentDate?.date)) ||
            item.date.trim() === currentDate?.date) &&
          moment(item.date).format('MM') === moment(selectedDate).format('MM')
        ) {
          return (
            <AttendanceWeek
              index={index}
              isDisabled={isDisabled}
              item={item}
              onLeaveApply={onLeaveApply}
            />
          );
        }
      })}
    </Stack>
  );
};
