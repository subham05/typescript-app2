import React, {useEffect, useRef, useState} from 'react';
import {FlatList} from 'react-native';
import {ActivityLogsProps} from 'screens/ActivityLog';
import {StaffReportProps} from 'screens/StaffReport';
import {TopTabItem} from './TopTabScrollItem';

interface TopTabProps {
  data: string[];
  props: StaffReportProps | ActivityLogsProps;
  defaultValue?: string | undefined;
  onPress: (selectedItem: any) => void;
}
export const TopTabBar: React.FC<TopTabProps> = ({
  data,
  props,
  defaultValue,
  onPress,
}) => {
  let scrollRef = useRef<FlatList | null>(null);

  useEffect(() => {
    setTopTabValue(defaultValue!);
  }, [defaultValue]);

  // const defaultStaff = 'Owner';
  const [topTabValue, setTopTabValue] = useState<string>(defaultValue!);
  return (
    <FlatList
      ref={scrollRef}
      data={data}
      horizontal
      showsHorizontalScrollIndicator={false}
      renderItem={({item, index}) => (
        <TopTabItem
          item={item}
          TopTab={topTabValue!}
          onPress={(val, num) => {
            setTopTabValue(val);
            scrollRef.current?.scrollToIndex({animated: true, index: num});
            onPress!(val);
          }}
          props={props}
          index={index}
        />
      )}
      keyExtractor={(_, index) => index.toString()}
    />
  );
};
