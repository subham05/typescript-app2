import React, {useRef, useState} from 'react';
import {FlatList} from 'react-native';
import {SelectedStaffItem} from '../SelectedStaffItem';

interface SelectedStaffProps {
  data: any[];
  props: any;
}
export const SelectedStaffList: React.FC<SelectedStaffProps> = ({
  data,
  props,
}) => {
  let scrollRef = useRef<FlatList | null>(null);

  const defaultStaff = 'Owner';
  const [selectedStaff, setSelectedStaff] = useState<string>(defaultStaff);
  return (
    <FlatList
      ref={scrollRef}
      data={data}
      horizontal
      showsHorizontalScrollIndicator={false}
      renderItem={({item, index}) => (
        <SelectedStaffItem
          item={item}
          selectedStaff={selectedStaff!}
          onPress={(val, num) => {
            setSelectedStaff(val);
            scrollRef.current?.scrollToIndex({animated: true, index: num});
          }}
          props={props}
          index={index}
        />
      )}
      keyExtractor={(_, index) => index.toString()}
    />
  );
};
