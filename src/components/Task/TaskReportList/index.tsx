import {FooterComponent} from 'components/FooterComponent';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {TaskReportItem} from '../TaskReportItem';

interface TaskReportListProps {
  data: any[];
  TaskDetailReportNavigation: () => void;
}
export const TaskReportList: React.FC<TaskReportListProps> = ({
  data,
  TaskDetailReportNavigation,
}) => {
  return (
    <View>
      {data.map((_, index) => {
        return (
          <View key={index} style={styles().container}>
            <TaskReportItem
              key={index}
              TaskDetailReport={TaskDetailReportNavigation}
            />
          </View>
        );
      })}
      <FooterComponent />
    </View>
  );
};

const styles = () => {
  const mergeStyles = StyleSheet.create({
    container: {
      paddingBottom: 20,
    },
  });
  return mergeStyles;
};
