import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {Divider} from 'components/Divider';
import {StackItem} from 'components/Stack';
import {TextView} from 'components/TextView';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Ripple from 'react-native-material-ripple';
import {MailMessageInterface, MailMessageItem} from '../MailMessageItem';

interface MailMessageListViewProps {
  data: MailMessageInterface[];
  onPressCreateTask: () => void;
  onPressRelatedTask: () => void;
}
export const MailMessageListView: React.FC<MailMessageListViewProps> = ({
  data,
  onPressCreateTask,
  onPressRelatedTask,
}) => {
  let dataLenth = data.length;

  const [showCount, setShowCount] = useState<boolean>(false);

  useEffect(() => {
    setShowCount(dataLenth <= 3 ? false : true);
  }, [dataLenth]);
  return (
    <>
      {!showCount ? (
        <View>
          {data.map((item, index) => {
            return (
              <View key={index} style={styles().container}>
                <MailMessageItem
                  data={item}
                  key={index}
                  onPressCreateTask={onPressCreateTask}
                  onPressRelatedTask={onPressRelatedTask}
                  dataLenth={dataLenth}
                  opened={index === dataLenth - 1 ? true : false}
                />
              </View>
            );
          })}
        </View>
      ) : (
        <StackItem childrenGap={15}>
          <View style={[styles().paddingHorizontal]}>
            <MailMessageItem
              data={data[0]}
              onPressCreateTask={onPressCreateTask}
              onPressRelatedTask={onPressRelatedTask}
              dataLenth={dataLenth}
            />
          </View>
          <StackItem childrenGap={4}>
            <Divider size={2} color={colors.grey_008} />
            <Divider size={2} color={colors.grey_008} />
          </StackItem>
          <Ripple
            onPress={() => setShowCount(!showCount)}
            style={styles().countContainer}
            rippleContainerBorderRadius={48 / 2}>
            {/* <Stack center style={styles().countContainer}> */}
            <TextView
              weight="bold"
              variant={FontSizes.regular}
              adjustsFontSizeToFit={true}
              style={styles().count}>
              {dataLenth - 2}
            </TextView>
            {/* </Stack> */}
          </Ripple>
          <View style={[styles().paddingHorizontal]}>
            <MailMessageItem
              data={data[dataLenth - 1]}
              onPressCreateTask={onPressCreateTask}
              onPressRelatedTask={onPressRelatedTask}
              dataLenth={dataLenth}
              opened={true}
            />
          </View>
        </StackItem>
      )}
    </>
  );
};

const styles = () => {
  const mergeStyles = StyleSheet.create({
    container: {
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    paddingHorizontal: {
      paddingHorizontal: 20,
    },
    countContainer: {
      backgroundColor: colors.grey_001,
      borderRadius: 48 / 2,
      height: 48,
      width: 48,
      borderColor: colors.grey_003,
      borderWidth: 1.5,
      position: 'absolute',
      top: -41,
      left: 19,
      justifyContent: 'center',
      alignItems: 'center',
    },
    count: {
      color: colors.grey_003,
    },
  });
  return mergeStyles;
};
